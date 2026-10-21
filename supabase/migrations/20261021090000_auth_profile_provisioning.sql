-- Creates a Prisma User row when Supabase Auth creates an email user.
-- Prepared only; this migration has NOT been applied to production.
-- Test on a disposable/staging project first: trigger failures can block signups.

create schema if not exists private;
create or replace function private.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- The storefront requires email for a Prisma User profile. Avoid breaking
  -- phone-only Auth signups if those are enabled in the future.
  if new.email is not null then
    insert into public."User" ("id", "email", "auth_provider", "role")
    values (new.id::text, new.email, 'supabase', 'Customer')
    on conflict do nothing;
  end if;
  return new;
end;
$$;

-- Trigger execution does not require broad API execution privileges.
revoke all on function private.handle_new_auth_user() from public;
revoke all on function private.handle_new_auth_user() from anon;
revoke all on function private.handle_new_auth_user() from authenticated;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
after insert on auth.users
for each row
execute function private.handle_new_auth_user();

comment on function private.handle_new_auth_user() is
  'Internal trigger function: creates a default Prisma User for email-based Supabase Auth users. Conflicts are intentionally ignored for safe signup; app-level provisioning reports ID/email mismatches.';
