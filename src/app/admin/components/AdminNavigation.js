'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, BarChart2, ShoppingBag, Tags, 
  ShoppingCart, Image as ImageIcon, FileText, Settings,
  Ticket, LogOut, Menu, X
} from 'lucide-react'

export default function AdminNavigation({ userEmail }) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart2 },
    { name: 'Products', href: '/admin/products', icon: ShoppingBag },
    { name: 'Collections', href: '/admin/collections', icon: Tags },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
    { name: 'Blog', href: '/admin/blog', icon: FileText },
    { name: 'Discounts', href: '/admin/discounts', icon: Ticket },
    { name: 'Store Appearance', href: '/admin/settings', icon: Settings },
  ]

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="lg:hidden flex items-center justify-between bg-sidebar-bg text-white p-4 sticky top-0 z-50 shadow-md">
        <span className="text-xl font-bold tracking-widest uppercase">Reckless Era</span>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 hover:bg-sidebar-hover rounded-md transition-colors">
          {isMobileMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-brand-gold" />}
        </button>
      </div>

      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* THE SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-sidebar-bg text-gray-300 flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block border-r border-sidebar-hover
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="h-20 hidden lg:flex items-center px-6 border-b border-sidebar-hover">
          <h1 className="text-xl font-bold text-white tracking-widest uppercase">
            Reckless Era<span className="text-brand-pink">.</span>
          </h1>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-6 px-4">
          <ul className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
                      ${isActive 
                        ? 'bg-brand-pink text-white shadow-md shadow-brand-pink/20' 
                        : 'text-gray-400 hover:bg-sidebar-hover hover:text-white'}
                    `}
                  >
                    <Icon className={`h-5 w-5 transition-colors ${isActive ? 'text-gray' : 'text-gray-500 group-hover:text-gray-300'}`} />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-sidebar-hover bg-sidebar-bg">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="flex-1 truncate">
              <p className="text-sm font-semibold text-white truncate">{userEmail}</p>
              <p className="text-xs text-brand-gold">System Admin</p>
            </div>
            <form action="/auth/signout" method="post">
              <button title="Log out" className="p-2 text-gray-500 hover:text-brand-red hover:bg-sidebar-hover rounded-md transition-all">
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  )
}