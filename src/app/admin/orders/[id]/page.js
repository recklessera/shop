import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Package, User, MapPin, CreditCard, Clock, Phone } from 'lucide-react'
import OrderStatusForm from './components/OrderStatusForm'

export default async function OrderDetailPage({ params }) {
  const { id } = await params

  // Deeply fetch the order, customer, items, variants, and images
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      customer: true,
      items: {
        include: {
          product: {
            include: {
              images: { where: { is_primary: true }, take: 1 }
            }
          },
          variant: true
        }
      }
    }
  })

  if (!order) {
    notFound()
  }

  // Parse the JSON address
  let address = {}
  try {
    address = typeof order.shipping_address === 'string' 
      ? JSON.parse(order.shipping_address) 
      : (order.shipping_address || {})
  } catch (e) {
    address = {}
  }

  // Upgraded SaaS Status Colors
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-brand-gold/10 text-brand-gold-hover'
      case 'processing': return 'bg-brand-pink/10 text-brand-pink'
      case 'shipped': return 'bg-blue-100 text-blue-700'
      case 'delivered': return 'bg-green-100 text-green-700'
      case 'cancelled': return 'bg-brand-red/10 text-brand-red'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="max-w-6xl mx-auto text-left w-full">
      
      <div className="mb-6">
        <Link href="/admin/orders" className="text-sm font-bold text-gray-500 hover:text-brand-pink flex items-center gap-2 transition-colors inline-flex px-3 py-2 -ml-3 rounded-lg hover:bg-brand-pink/5">
          <ArrowLeft className="h-4 w-4" /> Back to Orders
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-4">
            <span className="font-mono tracking-wider"><span className="text-gray-400">#</span>{order.id.slice(0, 8).toUpperCase()}</span>
            <span className={`px-3 py-1 inline-flex text-[11px] uppercase tracking-wider font-extrabold rounded-full ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </h2>
          <p className="text-sm font-medium text-gray-500 mt-2 flex items-center gap-1.5">
            <Clock className="h-4 w-4" /> Placed on {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Line Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3 bg-white">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Package className="h-5 w-5 text-gray-600" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Line Items</h3>
            </div>
            
            <div className="divide-y divide-gray-50">
              {order.items.map((item) => (
                <div key={item.id} className="p-6 flex items-center gap-6 hover:bg-gray-50 transition-colors group">
                  {/* Thumbnail */}
                  <div className="h-16 w-16 flex-shrink-0 border border-gray-100 rounded-xl overflow-hidden bg-gray-50 shadow-sm">
                    {item.product.images[0]?.image_url ? (
                      <img src={item.product.images[0].image_url} alt={item.product.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase">No Img</div>
                    )}
                  </div>
                  
                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 group-hover:text-brand-pink transition-colors truncate pr-4">
                      {item.product.title}
                    </h4>
                    
                    {item.variant_snapshot && (
                      <p className="text-xs font-bold text-brand-pink mt-1 bg-brand-pink/5 inline-block px-2 py-0.5 rounded">
                        {item.variant_snapshot}
                      </p>
                    )}
                    
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1.5">
                      SKU: {item.variant?.sku || 'N/A'}
                    </p>
                  </div>
                  
                  {/* Price & Qty */}
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">₦{item.price_at_purchase.toLocaleString()}</p>
                    <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">Qty: {item.quantity}</p>
                  </div>
                  
                  {/* Total Line Price */}
                  <div className="text-right w-28">
                    <p className="text-base font-extrabold text-gray-900">₦{(item.price_at_purchase * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Financial Summary Footer */}
            <div className="bg-gray-50/50 px-6 py-6 border-t border-gray-100">
              <div className="flex justify-between items-center text-sm mb-3 font-medium text-gray-500">
                <span>Subtotal</span>
                {/* Calculate subtotal on the fly since total_amount includes shipping */}
                <span className="text-gray-900 font-bold">
                  ₦{(order.total_amount - (address.cost || 0)).toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between items-center text-sm mb-4 font-medium text-gray-500">
                <span className="capitalize">Shipping {address.method ? `(${address.method})` : ''}</span>
                {address.cost !== undefined ? (
                  <span className="text-gray-900 font-bold">
                    {address.cost === 0 ? 'Free' : `₦${address.cost.toLocaleString()}`}
                  </span>
                ) : (
                  <span className="italic text-gray-400">Calculated at checkout</span>
                )}
              </div>
              
              <div className="flex justify-between items-center text-lg font-black text-gray-900 pt-4 border-t border-gray-200">
                <span>Total</span>
                <span className="text-brand-pink">₦{order.total_amount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customer, Shipping, & Controls */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Status Control Box */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 md:p-8">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5">Order Management</h3>
            <div className="bg-gray-50 p-4 border border-gray-100 rounded-xl text-sm text-gray-700 flex justify-between items-center">
              <span className="font-medium text-gray-500">Current Status</span>
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${getStatusColor(order.status)}`}>{order.status}</span>
            </div>
            <OrderStatusForm orderId={order.id} currentStatus={order.status} />
          </div>

          {/* Customer Info Box (UPDATED WITH PHONE) */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-brand-pink/10 rounded-lg">
                <User className="h-5 w-5 text-brand-pink" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Customer Contact</h3>
            </div>
            <div className="text-sm text-gray-900 space-y-3">
              <div>
                <p className="font-extrabold text-base">{order.customer?.name || 'Guest User'}</p>
                <div className="flex items-center gap-2 mt-1 text-gray-500 hover:text-brand-pink transition-colors">
                  <a href={`mailto:${order.customer?.email}`} className="font-medium">{order.customer?.email}</a>
                </div>
              </div>
              
              {/* Displays the direct order contact number */}
              {order.phone_number && (
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100 mt-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <a href={`tel:${order.phone_number}`} className="font-bold text-gray-900 hover:text-brand-pink transition-colors">
                    {order.phone_number}
                  </a>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Account Tier</span>
                <span className="text-xs font-bold text-gray-700 capitalize px-2 py-1 bg-gray-100 rounded-md">
                  {order.customer?.role || 'Guest'}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address Box */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-brand-gold/10 rounded-lg">
                <MapPin className="h-5 w-5 text-brand-gold-hover" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Shipping Details</h3>
              {/* NEW: Method Badge */}
              {address.method && (
                <span className="ml-auto bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider">
                  {address.method}
                </span>
              )}
            </div>
            <div className="text-sm text-gray-700 leading-relaxed font-medium space-y-1">
              {Object.keys(address).length === 0 ? (
                <p className="text-brand-red italic bg-brand-red/10 p-3 rounded-lg text-center font-bold">No valid shipping address provided.</p>
              ) : (
                <>
                  <p className="font-extrabold text-gray-900">{address.firstName} {address.lastName}</p>
                  <p>{address.street}</p>
                  {address.apartment && <p>{address.apartment}</p>}
                  <p>{address.city}, {address.state} {address.postalCode}</p>
                  <p className="font-bold mt-1">{address.country}</p>
                  
                  {/* Fallback phone check inside the JSON if the main column is empty */}
                  {!order.phone_number && address.phone && (
                    <p className="mt-3 pt-3 border-t border-gray-100 text-gray-500">
                      Tel: <span className="font-bold text-gray-900">{address.phone}</span>
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Payment Info Box */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <CreditCard className="h-5 w-5 text-green-700" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Payment Gate</h3>
            </div>
            <div className="text-sm text-gray-700">
              {order.squad_transaction_ref ? (
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Squad Ref</span>
                  <span className="font-mono bg-gray-50 p-2 rounded-lg text-xs break-all border border-gray-200 font-bold text-gray-900 tracking-wider">
                    {order.squad_transaction_ref}
                  </span>
                </div>
              ) : (
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-center">
                  <p className="text-gray-500 font-bold italic text-xs">Manual / Cash on Delivery</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}