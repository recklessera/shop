import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AdminNavigation from './components/AdminNavigation'

export default async function AdminLayout({ children }) {
  const supabase = await createClient()
  
  // Double-check auth status on the server component level
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    redirect('/login')
  }

  return (
    // Clean, dynamic background color from our CSS variables
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