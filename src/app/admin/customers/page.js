import { prisma } from '@/lib/prisma'
import { Users, Mail, Phone, ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
import Link from 'next/link'

export default async function CustomersPage({ searchParams }) {
  const params = await searchParams
  const currentPage = Number(params?.page) || 1
  const ITEMS_PER_PAGE = 10

  const totalCustomers = await prisma.user.count({ 
    where: { role: 'Customer' } 
  })
  const totalPages = Math.ceil(totalCustomers / ITEMS_PER_PAGE)

  const customers = await prisma.user.findMany({
    where: { role: 'Customer' },
    skip: (currentPage - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
    orderBy: { created_at: 'desc' },
    include: {
      orders: {
        select: { total_amount: true }
      }
    }
  })

  const formattedCustomers = customers.map(customer => {
    const totalSpend = customer.orders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
    
    // Safely check if they have addresses saved in the JSON
    let addressCount = 0
    if (customer.saved_addresses && Array.isArray(customer.saved_addresses)) {
      addressCount = customer.saved_addresses.length
    }

    return {
      ...customer,
      orderCount: customer.orders.length,
      totalSpend,
      addressCount
    }
  })

  return (
    <div className="max-w-5xl mx-auto w-full text-left">
      <div className="mb-10 flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Customer Directory</h1>
        <p className="text-sm font-medium text-gray-500">Manage your user base and track lifetime value.</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Users className="h-4 w-4 text-brand-pink" />
            Registered Customers ({totalCustomers})
          </h3>
        </div>

        <div className="divide-y divide-gray-50">
          {formattedCustomers.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-sm font-medium text-gray-500">No customers found yet.</p>
            </div>
          ) : (
            formattedCustomers.map((customer) => (
              <div key={customer.id} className="p-5 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center gap-4 group">
                
                <div className="h-12 w-12 rounded-full bg-brand-pink/10 flex items-center justify-center text-brand-pink font-bold text-lg flex-shrink-0">
                  {customer.name?.charAt(0) || customer.email.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900 truncate">
                      {customer.name || 'No Name Set'}
                    </span>
                    {customer.orderCount > 5 && (
                      <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-tighter bg-brand-gold/10 text-brand-gold-hover rounded-md">
                        VIP
                      </span>
                    )}
                  </div>
                  
                  {/* NEW: Added Phone and Address info to the list view */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                    <span className="flex items-center gap-1 text-xs text-gray-500 font-medium truncate">
                      <Mail className="h-3 w-3" /> {customer.email}
                    </span>
                    {customer.phone_number && (
                      <>
                        <span className="text-gray-300 text-xs">•</span>
                        <span className="flex items-center gap-1 text-xs text-gray-500 font-medium truncate">
                          <Phone className="h-3 w-3" /> {customer.phone_number}
                        </span>
                      </>
                    )}
                    {customer.addressCount > 0 && (
                      <>
                        <span className="text-gray-300 text-xs">•</span>
                        <span className="flex items-center gap-1 text-xs text-brand-pink font-bold">
                          <MapPin className="h-3 w-3" /> {customer.addressCount} Saved Address{customer.addressCount > 1 ? 'es' : ''}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-8 sm:gap-12 flex-shrink-0 pt-2 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Orders</p>
                    <p className="text-sm font-bold text-gray-900">{customer.orderCount}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Spend</p>
                    <p className="text-sm font-bold text-brand-gold">₦{customer.totalSpend.toLocaleString()}</p>
                  </div>
                </div>

                <div className="sm:ml-4 pt-3 sm:pt-0 border-t border-gray-100 sm:border-t-0 mt-2 sm:mt-0">
                  <Link 
                    href={`/admin/customers/${customer.id}`}
                    className="inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:text-brand-pink hover:border-brand-pink/30 hover:bg-brand-pink/5 transition-all w-full sm:w-auto"
                  >
                    View History
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <p className="text-xs font-medium text-gray-500">
              Page <span className="font-bold text-gray-900">{currentPage}</span> of <span className="font-bold text-gray-900">{totalPages}</span>
            </p>
            <div className="flex items-center gap-2">
              <Link 
                href={`?page=${currentPage - 1}`} 
                className={`p-1.5 border border-gray-200 rounded-md bg-white text-gray-600 hover:bg-gray-50 transition-colors ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
              >
                <ChevronLeft className="h-4 w-4" />
              </Link>
              <Link 
                href={`?page=${currentPage + 1}`} 
                className={`p-1.5 border border-gray-200 rounded-md bg-white text-gray-600 hover:bg-gray-50 transition-colors ${currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}`}
              >
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}