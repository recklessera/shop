"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { createPendingOrder } from "@/app/actions/checkout";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock } from "lucide-react";

export default function CheckoutClient({ initialUserData }) {
  const { items, discount, clearCart } = useCartStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form State (Pre-fill if user has saved data)
  const [shipping, setShipping] = useState({
    firstName: initialUserData?.name?.split(" ")[0] || "",
    lastName: initialUserData?.name?.split(" ")[1] || "",
    phone: initialUserData?.phone_number || "",
    street: initialUserData?.saved_addresses?.street || "",
    city: initialUserData?.saved_addresses?.city || "",
    state: initialUserData?.saved_addresses?.state || "",
  });

  // Load Squad Script dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.squadco.com/widget/squad.min.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const handleInputChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Create the pending order securely on the server
    const result = await createPendingOrder(items, shipping, discount?.code);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    // 2. Trigger the Squad Inline Payment Widget
    const squadInstance = new window.SquadPay({
      onClose: () => {
        setLoading(false);
        console.log("Widget closed");
      },
      onLoad: () => {
        console.log("Widget loaded successfully");
      },
      onSuccess: () => {
        // Payment successful! Clear the cart and go to success page
        clearCart();
        router.push(`/checkout/success?ref=${result.transactionRef}`);
      },
      key: process.env.NEXT_PUBLIC_SQUAD_PUBLIC_KEY,
      email: result.email,
      amount: result.amountInKobo, 
      currency_code: "NGN",
      transaction_ref: result.transactionRef,
      customer_name: `${shipping.firstName} ${shipping.lastName}`,
    });

    squadInstance.setup();
    squadInstance.open();
  };

  // Calculations for UI display
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const discountAmount = discount ? discount.deduction : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  if (items.length === 0) {
    return <div className="text-center py-20">Your cart is empty.</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      
      {/* LEFT: Shipping Form */}
      <div>
        <h2 className="text-xl font-bold uppercase tracking-widest mb-6 border-b border-gray-200 pb-4">Shipping Details</h2>
        
        {error && <div className="bg-red-50 text-red-600 p-4 text-sm font-bold mb-6">{error}</div>}

        <form onSubmit={handlePayment} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">First Name</label>
              <input required name="firstName" value={shipping.firstName} onChange={handleInputChange} className="border-b-2 border-gray-200 py-2 focus:outline-none focus:border-black bg-transparent" />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Last Name</label>
              <input required name="lastName" value={shipping.lastName} onChange={handleInputChange} className="border-b-2 border-gray-200 py-2 focus:outline-none focus:border-black bg-transparent" />
            </div>
          </div>
          
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Phone Number</label>
            <input required type="tel" name="phone" value={shipping.phone} onChange={handleInputChange} className="border-b-2 border-gray-200 py-2 focus:outline-none focus:border-black bg-transparent" />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Street Address</label>
            <input required name="street" value={shipping.street} onChange={handleInputChange} className="border-b-2 border-gray-200 py-2 focus:outline-none focus:border-black bg-transparent" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">City</label>
              <input required name="city" value={shipping.city} onChange={handleInputChange} className="border-b-2 border-gray-200 py-2 focus:outline-none focus:border-black bg-transparent" />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">State</label>
              <input required name="state" value={shipping.state} onChange={handleInputChange} className="border-b-2 border-gray-200 py-2 focus:outline-none focus:border-black bg-transparent" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-8 bg-black text-white py-5 font-bold uppercase tracking-widest text-sm hover:bg-brand-primary hover:text-black transition-all flex justify-center items-center group disabled:opacity-50"
          >
            {loading ? "Initializing Secure Checkout..." : `Pay ₦${finalTotal.toLocaleString()}`}
            {!loading && <Lock className="w-4 h-4 ml-2" />}
          </button>
        </form>
      </div>

      {/* RIGHT: Order Summary */}
      <div className="bg-gray-50 p-8 border border-gray-100 h-fit">
        <h2 className="text-xl font-bold uppercase tracking-widest mb-6 border-b border-gray-200 pb-4">Order Summary</h2>
        <div className="space-y-6 mb-8">
          {items.map(item => (
            <div key={item.cartItemId} className="flex gap-4">
              <div className="relative w-16 aspect-[3/4] bg-gray-200">
                <Image src={item.image} alt={item.title} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold uppercase tracking-widest">{item.title}</h3>
                <p className="text-xs text-gray-500 uppercase">{item.variantLabel}</p>
                <div className="flex justify-between mt-2">
                  <span className="text-sm font-bold">Qty: {item.quantity}</span>
                  <span className="font-bold">₦{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3 border-t border-gray-200 pt-6 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span>
            <span>₦{subtotal.toLocaleString()}</span>
          </div>
          {discount && (
            <div className="flex justify-between text-brand-primary font-bold">
              <span>Discount ({discount.code})</span>
              <span>-₦{discountAmount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between items-center text-xl font-bold pt-4 border-t border-gray-200">
            <span>Total</span>
            <span>₦{finalTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
    </div>
  );
}