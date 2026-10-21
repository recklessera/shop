export class UserProfileIdentityMismatchError extends Error {
  constructor(email) {
    super(`A profile already exists for ${email} with a different ID. Account recovery is required before this account can continue.`);
    this.name = "UserProfileIdentityMismatchError";
    this.code = "USER_PROFILE_IDENTITY_MISMATCH";
  }
}

function isUniqueConstraintError(error) {
  return error?.code === "P2002";
}

/**
 * Ensures a Supabase Auth user has a matching Prisma User row.
 * Auth UUID is canonical; mismatched legacy IDs are never silently adopted.
 * The db argument is injectable for focused concurrency/error-path tests.
 */
export async function ensureUserProfile(authUser, db) {
  if (!db?.user) throw new Error("A Prisma-compatible database client is required.");
  if (!authUser?.id || !authUser?.email) {
    throw new Error("A signed-in user with an email address is required.");
  }

  const byId = await db.user.findUnique({ where: { id: authUser.id } });
  if (byId) return byId;

  const byEmail = await db.user.findUnique({ where: { email: authUser.email } });
  if (byEmail) {
    if (byEmail.id !== authUser.id) {
      throw new UserProfileIdentityMismatchError(authUser.email);
    }
    return byEmail;
  }

  try {
    return await db.user.create({
      data: { id: authUser.id, email: authUser.email, auth_provider: "supabase", role: "Customer" },
    });
  } catch (error) {
    // A concurrent request or Auth trigger may have created the row first.
    if (!isUniqueConstraintError(error)) throw error;

    const createdById = await db.user.findUnique({ where: { id: authUser.id } });
    if (createdById) return createdById;

    const createdByEmail = await db.user.findUnique({ where: { email: authUser.email } });
    if (createdByEmail && createdByEmail.id !== authUser.id) {
      throw new UserProfileIdentityMismatchError(authUser.email);
    }
    if (createdByEmail) return createdByEmail;
    throw error;
  }
}
