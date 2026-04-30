import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AdminNavigation from './components/AdminNavigation'

export default async function AdminLayout({ children }) {
  const supabase = await createClient()
  
  // 1. Double-check auth status on the server component level
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    redirect('/login')
  }

  // 2. NEW: Role-based Authorization Check
  // Check the database to see if this user has the Admin badge
  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
    select: { role: true } // Only pull the role field to keep the query lightning fast
  })

  if (!dbUser || dbUser.role !== 'Admin') {
    // They are logged in, but just a normal Customer. Kick them to the storefront.
    redirect('/') 
  }

  // 3. If they pass both checks, render the secure Admin UI
  return (
    <div className="flex flex-col lg:flex-row h-screen bg-app-bg text-left overflow-hidden font-sans">
      
      {/* The isolated Client Component handling the dark UI and mobile toggle */}
      <AdminNavigation userEmail={user.email} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8 w-full max-w-screen-2xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}