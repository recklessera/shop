import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ShoppingBag, Mail, Calendar, User } from 'lucide-react'

export default async function CustomerDetailPage({ params }) {
  const { id } = await params

  const customer = await prisma.user.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: { created_at: 'desc' },
      }
    }
  })

  if (!customer) notFound()

  const totalSpent = customer.orders.reduce((sum, o) => sum + o.total_amount, 0)

  return (
    <div className="max-w-4xl mx-auto w-full text-left">
      <div className="mb-6">
        <Link href="/admin/customers" className="text-sm font-bold text-gray-500 hover:text-brand-pink flex items-center gap-2 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Directory
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
            <div className="h-20 w-20 bg-brand-pink/10 rounded-full flex items-center justify-center text-brand-pink font-bold text-2xl mb-4">
              {customer.name?.charAt(0) || customer.email.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{customer.name || 'Anonymous'}</h2>
            <p className="text-sm text-gray-500 mt-1">{customer.email}</p>
            
            <div className="mt-6 pt-6 border-t border-gray-50 space-y-4">
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Value</p>
                <p className="text-xl font-black text-brand-gold">₦{totalSpent.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Member Since</p>
                <p className="text-sm font-bold text-gray-700">{new Date(customer.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="md:col-span-2">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-brand-pink" />
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Order History</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {customer.orders.length === 0 ? (
                <p className="p-8 text-center text-sm text-gray-500">No orders placed yet.</p>
              ) : (
                customer.orders.map(order => (
                  <Link key={order.id} href={`/admin/orders/${order.id}`} className="p-5 flex justify-between items-center hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="text-sm font-bold text-gray-900">Order #{order.id.slice(-6).toUpperCase()}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">₦{order.total_amount.toLocaleString()}</p>
                      <span className={`text-[10px] font-bold uppercase ${order.status === 'completed' ? 'text-green-500' : 'text-brand-gold'}`}>
                        {order.status}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}