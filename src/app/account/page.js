import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import AuthForm from '@/components/account/AuthForm';
import CancelOrderButton from '@/components/account/CancelOrderButton';
import AccountSettings from '@/components/account/AccountSettings';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Account | Reckless Era",
};

export default async function AccountPage() {
  // 1. Initialize Supabase and check session
  const supabase = await createClient();
  const { data: { user: authUser }, error } = await supabase.auth.getUser();

  if (error || !authUser) {
    return (
      <div className="w-full min-h-[70vh] bg-white flex items-center justify-center">
        <AuthForm />
      </div>
    );
  }

  // 2. Fetch or Create the Prisma User record
  // (Ensures relational data doesn't break if this is their first login)
  let dbUser = await prisma.user.findUnique({
    where: { email: authUser.email }
  });

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        id: authUser.id,
        email: authUser.email,
        auth_provider: "supabase",
        role: "Customer"
      }
    });
  }

  // 3. Fetch Orders matching exact schema names
  const orders = await prisma.order.findMany({
    where: { 
      customer_id: dbUser.id 
    },
    orderBy: { 
      created_at: 'desc' 
    },
    include: {
      items: {
        include: { product: true }
      }
    }
  });

  return (
    <div className="w-full min-h-screen bg-app-bg py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 border-b border-gray-200 pb-8 text-left">
          <h1 className="text-4xl font-bold uppercase tracking-tighter text-black mb-2">
            My Account
          </h1>
          <p className="text-gray-500 text-sm">
            Welcome back, <span className="font-bold text-black">{dbUser.name || authUser.email}</span>
          </p>
        </div>

        {/* Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Column: Order History */}
          <div className="col-span-1 lg:col-span-2 flex flex-col space-y-6">
            <h2 className="text-lg font-bold uppercase tracking-widest border-b border-gray-200 pb-4">Order History</h2>
            
            {orders.length === 0 ? (
              <div className="bg-white p-8 text-left border border-gray-100">
                <p className="text-gray-500 text-sm mb-4">You haven't placed any orders yet.</p>
                <a href="/shop" className="inline-block bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-brand-primary hover:text-black transition-colors">
                  Start Shopping
                </a>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white border border-gray-200 p-6 flex flex-col">
                    <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
                      <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Order #{order.id.slice(-6).toUpperCase()}</p>
                        <p className="text-sm">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block bg-gray-100 text-black px-3 py-1 text-xs font-bold uppercase tracking-widest mb-1">
                          {order.status}
                        </span>
                        <p className="font-bold">₦{order.total_amount.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {order.items?.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm text-gray-600">
                          <span>{item.quantity}x {item.product?.title || 'Unknown Product'}</span>
                          <span>₦{(item.price_at_purchase * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                      {/* NEW: Cancel Button for Pending Orders */}
                          {order.status === "pending" && (
                            <div className="border-t border-gray-100 mt-4 pt-4">
                              <CancelOrderButton orderId={order.id} />
                            </div>
                          )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Sidebar: Account Settings & Logout */}
          <div className="col-span-1 flex flex-col space-y-6 h-fit">
            <h2 className="text-lg font-bold uppercase tracking-widest border-b border-gray-200 pb-4">Account Settings</h2>
            
            {/* The interactive management component */}
            <AccountSettings dbUser={dbUser} authUser={authUser} />

            <div className="bg-white p-6 border border-gray-200">
              <form action="/auth/signout" method="post">
                <button className="w-full border-2 border-black text-black py-4 font-bold uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all">
                  Sign Out
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}