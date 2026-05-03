import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ShoppingBag, Mail, Phone, Calendar, MapPin, Building } from 'lucide-react'

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

  const totalSpent = customer.orders.reduce((sum, o) => sum + (o.total_amount || 0), 0)
  
  // Safely parse saved addresses (assuming it's an array of objects)
  const addresses = Array.isArray(customer.saved_addresses) ? customer.saved_addresses : []

  return (
    <div className="max-w-5xl mx-auto w-full text-left">
      <div className="mb-6">
        <Link href="/admin/customers" className="text-sm font-bold text-gray-500 hover:text-brand-pink flex items-center gap-2 transition-colors inline-flex px-3 py-2 -ml-3 rounded-lg hover:bg-brand-pink/5">
          <ArrowLeft className="h-4 w-4" /> Back to Directory
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile & Addresses */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Profile Card */}
          <div className="bg-white border border-gray-100 p-6 md:p-8 rounded-2xl shadow-sm">
            <div className="h-20 w-20 bg-brand-pink/10 rounded-full flex items-center justify-center text-brand-pink font-bold text-2xl mb-5 border-4 border-white shadow-sm">
              {customer.name?.charAt(0) || customer.email.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-gray-900">{customer.name || 'Anonymous'}</h2>
              {customer.orders.length > 5 && (
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-tighter bg-brand-gold/10 text-brand-gold-hover rounded-md">VIP</span>
              )}
            </div>
            
            <div className="space-y-3 mt-4">
              <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                <Mail className="h-4 w-4 text-gray-400" />
                {customer.email}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                <Phone className="h-4 w-4 text-gray-400" />
                {customer.phone_number || <span className="text-gray-400 italic">No phone provided</span>}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                <Calendar className="h-4 w-4 text-gray-400" />
                Joined {new Date(customer.created_at).toLocaleDateString()}
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Total Value</p>
                <p className="text-xl font-black text-brand-gold">₦{totalSpent.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Total Orders</p>
                <p className="text-xl font-black text-gray-900">{customer.orders.length}</p>
              </div>
            </div>
          </div>

          {/* Saved Addresses Card */}
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 mb-4">
              <MapPin className="h-4 w-4 text-brand-pink" />
              Saved Addresses
            </h3>
            
            <div className="space-y-4">
              {addresses.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No addresses saved yet.</p>
              ) : (
                addresses.map((addr, idx) => (
                  <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm">
                    <p className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                      <Building className="h-3 w-3 text-gray-400" /> 
                      {addr.label || `Address ${idx + 1}`}
                    </p>
                    <p className="text-gray-600">{addr.street}</p>
                    <p className="text-gray-600">{addr.city}{addr.state ? `, ${addr.state}` : ''}</p>
                    {addr.country && <p className="text-gray-500 font-medium mt-1">{addr.country}</p>}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Order History */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden h-full flex flex-col">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-2 bg-white flex-shrink-0">
              <ShoppingBag className="h-4 w-4 text-brand-pink" />
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Order History</h3>
            </div>
            
            <div className="divide-y divide-gray-50 flex-1 overflow-y-auto">
              {customer.orders.length === 0 ? (
                <div className="p-12 text-center">
                  <ShoppingBag className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-500">No orders placed yet.</p>
                </div>
              ) : (
                customer.orders.map(order => (
                  <Link key={order.id} href={`/admin/orders/${order.id}`} className="p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 hover:bg-gray-50 transition-colors group">
                    <div>
                      <p className="text-sm font-bold text-gray-900 group-hover:text-brand-pink transition-colors">
                        Order #{order.id.slice(-6).toUpperCase()}
                      </p>
                      <p className="text-xs font-medium text-gray-500 mt-1">
                        {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-1">
                      <p className="text-sm font-black text-gray-900">₦{(order.total_amount || 0).toLocaleString()}</p>
                      <span className={`px-2.5 py-0.5 inline-flex text-[10px] uppercase tracking-wider font-extrabold rounded-md ${
                        order.status === 'completed' || order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-brand-gold/10 text-brand-gold-hover'
                      }`}>
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