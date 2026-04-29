import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { 
  LayoutDashboard, 
  BarChart2,
  ShoppingBag, 
  Tags, 
  ShoppingCart, 
  Image as ImageIcon, 
  FileText, 
  Settings,
  LogOut
} from 'lucide-react'

export default async function AdminLayout({ children }) {
  const supabase = await createClient()
  
  // Double-check auth status on the server component level
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    redirect('/login')
  }

  const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart2 },
    { name: 'Products', href: '/admin/products', icon: ShoppingBag },
    { name: 'Collections', href: '/admin/collections', icon: Tags },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
    { name: 'Blog', href: '/admin/blog', icon: FileText },
    { name: 'Store Appearance', href: '/admin/settings', icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-gray-50 text-left">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 bg-background flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <h1 className="text-lg font-bold text-foreground">Reckless Era</h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-foreground transition-colors text-left"
                  >
                    <Icon className="h-5 w-5 text-gray-400" />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="flex-1 truncate">
              <p className="text-sm font-medium text-foreground text-left">{user.email}</p>
              <p className="text-xs text-gray-500 text-left">Admin</p>
            </div>
            <form action="/auth/signout" method="post">
              <button className="text-gray-400 hover:text-red-600 transition-colors">
                <LogOut className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}