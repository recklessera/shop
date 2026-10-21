import test from "node:test";
import assert from "node:assert/strict";
import { ensureUserProfile, UserProfileIdentityMismatchError } from "../src/lib/ensure-user-profile.js";

const authUser = { id: "auth-uuid-1", email: "new@example.com" };
const profile = { id: authUser.id, email: authUser.email, auth_provider: "supabase", role: "Customer" };
function fakeDb({ idRow = null, emailRow = null, create = async () => profile } = {}) {
  return { user: { findUnique: async ({ where }) => Object.hasOwn(where, "id") ? idRow : emailRow, create } };
}

test("returns an existing profile by canonical Auth ID", async () => {
  const existing = { ...profile, name: "Existing Name", role: "Admin" };
  assert.equal(await ensureUserProfile(authUser, fakeDb({ idRow: existing })), existing);
});

test("creates a profile with the Auth UUID and default Customer role", async () => {
  let input;
  const result = await ensureUserProfile(authUser, fakeDb({ create: async ({ data }) => (input = data) }));
  assert.deepEqual(result, profile);
  assert.deepEqual(input, profile);
});

test("refuses to adopt an email-matched profile with another ID", async () => {
  await assert.rejects(ensureUserProfile(authUser, fakeDb({ emailRow: { ...profile, id: "legacy-id" } })), UserProfileIdentityMismatchError);
});

test("recovers when a concurrent request creates the profile first", async () => {
  let calls = 0;
  const db = { user: { findUnique: async ({ where }) => { calls += 1; if (calls <= 2) return null; if (Object.hasOwn(where, "id")) return profile; return null; }, create: async () => { const error = new Error("Unique constraint failed"); error.code = "P2002"; throw error; } } };
  assert.equal(await ensureUserProfile(authUser, db), profile);
});

test("rejects auth users without an email", async () => {
  await assert.rejects(ensureUserProfile({ id: "auth-uuid-2" }, fakeDb()), /email address is required/);
});
