import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import CheckoutClient from '@/components/checkout/CheckoutClient';

export const metadata = {
  title: "Secure Checkout | Reckless Era",
};

export default async function CheckoutPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Protect the route
  if (!user) {
    redirect('/account');
  }

  // Fetch the user's saved data to pre-fill the form
  const dbUser = await prisma.user.findUnique({
    where: { email: user.email }
  });

  return (
    <div className="w-full min-h-screen bg-app-bg py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter text-black mb-4">
            Checkout
          </h1>
          <p className="text-gray-500 text-sm">
            Complete your order securely via Squad.
          </p>
        </div>

        <CheckoutClient initialUserData={dbUser} />

      </div>
    </div>
  );
}