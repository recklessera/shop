import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { ensureUserProfile, UserProfileIdentityMismatchError } from '@/lib/ensure-user-profile';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  // Optional: Supabase passes a 'next' param if you want to redirect somewhere specific after login
  const next = searchParams.get('next') ?? '/account';

  if (code) {
    const supabase = await createClient();
    
    // Exchange the code for a secure session cookie
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const { data: { user: authUser }, error: userError } = await supabase.auth.getUser();
      if (!userError && authUser) {
        try {
          await ensureUserProfile(authUser);
        } catch (profileError) {
          if (profileError instanceof UserProfileIdentityMismatchError) {
            return NextResponse.redirect(`${origin}/account?profile_error=identity_mismatch`);
          }
          throw profileError;
        }
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If there's an error, redirect to the account page with an error parameter
  return NextResponse.redirect(`${origin}/account?auth_error=true`);
}