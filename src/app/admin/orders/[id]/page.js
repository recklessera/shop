import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Package, User, MapPin, CreditCard } from 'lucide-react'
import OrderStatusForm from './components/OrderStatusForm'

export default async function OrderDetailPage({ params }) {
  const { id } = await params

  // Deeply fetch the order, customer, items, and the primary product image for each item
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
          }
        }
      }
    }
  })

  if (!order) {
    notFound()
  }

  // Parse the JSON address (safely handling if it is null or a string)
  let address = {}
  try {
    address = typeof order.shipping_address === 'string' 
      ? JSON.parse(order.shipping_address) 
      : (order.shipping_address || {})
  } catch (e) {
    address = {}
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-6xl text-left">
      <div className="mb-6">
        <Link href="/admin/orders" className="text-sm text-gray-500 hover:text-foreground flex items-center gap-2 transition-colors inline-flex">
          <ArrowLeft className="h-4 w-4" /> Back to Orders
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
            Order #{order.id.slice(0, 8).toUpperCase()}
            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
              {order.status.toUpperCase()}
            </span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">Placed on {new Date(order.created_at).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Line Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-background border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <Package className="h-5 w-5 text-gray-500" />
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Line Items</h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {order.items.map((item) => (
                <div key={item.id} className="p-6 flex items-center gap-6 hover:bg-gray-50 transition-colors">
                  {/* Thumbnail */}
                  <div className="h-16 w-16 flex-shrink-0 border border-gray-200 rounded-md overflow-hidden bg-gray-100">
                    {item.product.images[0]?.image_url ? (
                      <img src={item.product.images[0].image_url} alt={item.product.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                    )}
                  </div>
                  
                  {/* Details */}
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-foreground">{item.product.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">SKU: {item.product.sku}</p>
                  </div>
                  
                  {/* Price & Qty */}
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">₦{item.price_at_purchase.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                  </div>
                  
                  {/* Total Line Price */}
                  <div className="text-right w-24">
                    <p className="text-sm font-bold text-foreground">₦{(item.price_at_purchase * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Financial Summary Footer */}
            <div className="bg-gray-50 px-6 py-6 border-t border-gray-200">
              <div className="flex justify-between items-center text-sm mb-2 text-gray-500">
                <span>Subtotal</span>
                <span>₦{order.total_amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm mb-2 text-gray-500">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold text-foreground mt-4 pt-4 border-t border-gray-200">
                <span>Total</span>
                <span>₦{order.total_amount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customer, Shipping, & Controls */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Status Control Box */}
          <div className="bg-background border border-gray-200 rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Fulfillment</h3>
            <div className="bg-gray-50 p-4 border border-gray-200 rounded text-sm text-gray-700">
              Current Status: <span className="font-bold">{order.status}</span>
            </div>
            <OrderStatusForm orderId={order.id} currentStatus={order.status} />
          </div>

          {/* Customer Info Box */}
          <div className="bg-background border border-gray-200 rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-gray-500" />
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Customer</h3>
            </div>
            <div className="text-sm text-gray-700 space-y-2">
              <p className="font-medium text-foreground">{order.customer?.name || 'Guest User'}</p>
              <p><a href={`mailto:${order.customer?.email}`} className="text-blue-600 hover:underline">{order.customer?.email}</a></p>
              <p className="text-gray-500 text-xs mt-2">Account Type: {order.customer?.role}</p>
            </div>
          </div>

          {/* Shipping Address Box */}
          <div className="bg-background border border-gray-200 rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-gray-500" />
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Shipping Address</h3>
            </div>
            <div className="text-sm text-gray-700 leading-relaxed">
              {Object.keys(address).length === 0 ? (
                <p className="text-red-500 italic">No valid shipping address provided.</p>
              ) : (
                <>
                  <p>{address.firstName} {address.lastName}</p>
                  <p>{address.street}</p>
                  <p>{address.apartment && `${address.apartment}`}</p>
                  <p>{address.city}, {address.state} {address.postalCode}</p>
                  <p>{address.country}</p>
                  {address.phone && <p className="mt-2 text-gray-500">Tel: {address.phone}</p>}
                </>
              )}
            </div>
          </div>

          {/* Payment Info Box */}
          <div className="bg-background border border-gray-200 rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-gray-500" />
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Payment Gate</h3>
            </div>
            <div className="text-sm text-gray-700">
              {order.squad_transaction_ref ? (
                <p className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">Squad Ref:</span>
                  <span className="font-mono bg-gray-100 p-1 rounded text-xs break-all border border-gray-200">{order.squad_transaction_ref}</span>
                </p>
              ) : (
                <p className="text-gray-500 italic">Manual / Cash on Delivery</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}