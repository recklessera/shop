# Auth profile reconciliation and rollout

## Current live audit findings

The read-only production audit found 12 Supabase Auth users with email and 11 rows in `public."User"`. Three Auth users have no profile with the exact Auth UUID. One of those has an email-matched profile under a different ID; two have no email-matched profile. Two profile rows have no matching Auth UUID, including the mismatched-ID profile. The orphan profiles had no orders, blog posts, or Admin role at audit time.

These counts can change. Re-run the diagnostics immediately before any data repair.

## Why the app does not auto-adopt a profile with a different ID

The Auth UUID is the canonical ID for new profiles and orders. Automatically changing a profile ID or reassigning references can break foreign keys or change identity/authorization. The helper therefore fails safely and asks for manual reconciliation instead.

## Read-only diagnostics

Run these against the target database before any write. Do not publish email addresses or other personal data in logs/issues.

```sql
-- Auth users without a profile whose ID matches the Auth UUID.
select count(*) as auth_users_missing_exact_profile
from auth.users a
where a.email is not null
  and not exists (
    select 1 from public."User" u where u.id = a.id::text
  );

-- Auth users whose email matches a profile with a different ID.
select count(*) as mismatched_email_identity_count
from auth.users a
join public."User" u on lower(u.email) = lower(a.email)
where a.email is not null and u.id <> a.id::text;

-- Profiles without a matching Auth UUID.
select count(*) as profile_rows_without_auth_uuid
from public."User" u
where not exists (
  select 1 from auth.users a where a.id::text = u.id
);

-- Duplicate profile emails ignoring case (should return no rows).
select lower(email) as normalized_email, count(*)
from public."User"
group by lower(email)
having count(*) > 1;
```

## Staged rollout

1. Restore a recent backup or use a disposable/staging project.
2. Apply `supabase/migrations/20261021090000_auth_profile_provisioning.sql` to staging only.
3. Test signup with email confirmation enabled, confirmed signup, repeat login, simultaneous first account visits, and a profile whose email conflicts with another ID. Confirm the conflict does not block signup and the app surfaces a safe recovery error.
4. Verify the trigger function is not executable by `PUBLIC`, `anon`, or `authenticated`, and that the function is in the non-exposed `private` schema.
5. Run the read-only diagnostics again. Resolve the mismatched-ID identity only with owner-approved evidence before any reassignment; preserve the unrelated orphan until its origin is known.
6. Review the migration and application diff, run tests/build, and obtain explicit production approval before applying any production migration or backfill.

## Scope

The migration only adds the trigger/function; it does not backfill or modify existing profile rows. The separate review of the existing `public.rls_auto_enable()` SECURITY DEFINER function/event trigger is intentionally not bundled into this migration.
