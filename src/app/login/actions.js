'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    // Redirect back to the login page with an error message
    redirect('/login?message=Could not authenticate user. Check your credentials.')
  }

  // If successful, revalidate the layout and send them to the secure dashboard
  revalidatePath('/', 'layout')
  redirect('/admin')
}