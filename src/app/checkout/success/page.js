import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Order Status | Reckless Era",
};

export default async function CheckoutSuccessPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const ref = resolvedParams.ref;

  if (!ref) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <XCircle className="w-16 h-16 text-red-500 mb-6" />
        <h1 className="text-2xl font-bold uppercase tracking-widest mb-4">Invalid Request</h1>
        <p className="text-gray-500 mb-8">No transaction reference was provided.</p>
        <Link href="/shop" className="bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-brand-primary hover:text-black transition-colors">
          Return to Shop
        </Link>
      </div>
    );
  }

  try {
    // 1. Fetch the order from your database
    const order = await prisma.order.findFirst({
      where: { squad_transaction_ref: ref },
    });

    if (!order) {
      throw new Error("Order not found in the database.");
    }

    let isSuccess = false;

    // 2. Check if the webhook already processed it
    if (order.status === "processing" || order.status === "paid") {
      isSuccess = true;
    } else {
      // 3. If webhook is delayed, query Squad directly just to verify for the UI
      const squadResponse = await fetch(`https://sandbox-api-d.squadco.com/transaction/verify/${ref}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.SQUAD_SECRET_KEY}`,
        },
        cache: "no-store", 
      });

      const squadData = await squadResponse.json();
      
      if (squadData?.data?.transaction_status === "success") {
        isSuccess = true;
        // NOTE: We do NOT update the database or deduct inventory here.
        // We let the webhook handle the database update and email sending in the background.
      }
    }

    if (isSuccess) {
      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
          <CheckCircle className="w-16 h-16 text-green-600 mb-6" />
          <h1 className="text-4xl font-bold uppercase tracking-tighter text-black mb-4">Payment Successful</h1>
          <p className="text-gray-500 max-w-md mx-auto mb-2">
            Your order <span className="font-bold text-black">#{order.id.slice(-6).toUpperCase()}</span> has been confirmed.
          </p>
          <p className="text-sm text-gray-400 mb-10">A confirmation email will be sent to your account address shortly.</p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/account" className="border-2 border-black bg-white text-black px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
              View Dashboard
            </Link>
            <Link href="/shop" className="bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-brand-primary hover:text-black transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      );
    } else {
      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
          <XCircle className="w-16 h-16 text-red-500 mb-6" />
          <h1 className="text-4xl font-bold uppercase tracking-tighter text-black mb-4">Payment Failed</h1>
          <p className="text-gray-500 max-w-md mx-auto mb-10">
            We could not verify your payment. If you were charged, please contact our support team with your reference: <span className="font-mono text-xs">{ref}</span>
          </p>
          <Link href="/checkout" className="bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-brand-primary hover:text-black transition-colors">
            Try Again
          </Link>
        </div>
      );
    }

  } catch (error) {
    console.error("Verification error:", error);
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <XCircle className="w-16 h-16 text-red-500 mb-6" />
        <h1 className="text-4xl font-bold uppercase tracking-tighter text-black mb-4">System Error</h1>
        <p className="text-gray-500 max-w-md mx-auto mb-10">An error occurred while verifying your order. Our team has been notified.</p>
        <Link href="/account" className="bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-brand-primary hover:text-black transition-colors">
          Go to Dashboard
        </Link>
      </div>
    );
  }
}