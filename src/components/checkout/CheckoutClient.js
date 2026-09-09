"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { createPendingOrder } from "@/app/actions/checkout";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Script from 'next/script';
import { Lock, Truck } from "lucide-react";

// --- Location-Based Shipping Logic ---
const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River",
  "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe", "Imo", "Jigawa", "Kaduna",
  "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

function getShippingRate(state) {
  if (!state) return 0;
  
  if (state === "Lagos") {
    return 3500;
  }
  if (["Ogun", "Oyo", "Osun", "Ondo", "Ekiti"].includes(state)) {
    return 5500; // South West
  }
  if (["FCT - Abuja", "Rivers"].includes(state)) {
    return 7000; // Major Hubs outside SW
  }
  return 10000; // Nationwide
}

export default function CheckoutClient({ initialUserData }) {
  const { items, discount, clearCart } = useCartStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form State
  const [shipping, setShipping] = useState({
    firstName: initialUserData?.name?.split(" ")[0] || "",
    lastName: initialUserData?.name?.split(" ")[1] || "",
    phone: initialUserData?.phone_number || "",
    street: initialUserData?.saved_addresses?.street || "",
    city: initialUserData?.saved_addresses?.city || "",
    state: initialUserData?.saved_addresses?.state || "", 
  });

  const handleInputChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  // --- Dynamic Calculations ---
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const discountAmount = discount ? discount.deduction : 0;
  
  // Get the flat standard rate for the currently selected state
  const shippingCost = getShippingRate(shipping.state);
  const finalTotal = Math.max(0, subtotal - discountAmount) + shippingCost;

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!shipping.state) {
      setError("Please select a state to calculate shipping.");
      return;
    }

    // SAFETY CHECK: Ensure the script has loaded
    if (typeof window === 'undefined' || !window.SquadPay) {
      setError("Payment system is still loading. Please wait a second and try again.");
      return;
    }
    
    setLoading(true);
    setError(null);

    // Pass "standard" hardcoded since express is removed
    const result = await createPendingOrder(items, shipping, discount?.code, "standard");

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    const squadInstance = new window.SquadPay({
      onClose: () => {
        setLoading(false);
      },
      onLoad: () => {
        console.log("Widget loaded successfully");
      },
      onSuccess: () => {
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

  if (items.length === 0) {
    return <div className="text-center py-20 font-bold uppercase tracking-widest text-gray-500">Your cart is empty.</div>;
  }

  return (
    <>
      {/* Load the Squad script perfectly */}
      <Script src="https://checkout.squadco.com/widget/squad.min.js" strategy="afterInteractive" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* LEFT: Shipping Form */}
        <div>
          <h2 className="text-xl font-bold uppercase tracking-widest mb-6 border-b border-gray-200 pb-4">Shipping Details</h2>
          
          {error && <div className="bg-red-50 text-red-600 p-4 text-sm font-bold mb-6 border border-red-200">{error}</div>}

          <form onSubmit={handlePayment} className="space-y-8">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">First Name</label>
                  <input required name="firstName" value={shipping.firstName} onChange={handleInputChange} className="border-b-2 border-gray-200 py-2 focus:outline-none focus:border-black bg-transparent transition-colors" />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Last Name</label>
                  <input required name="lastName" value={shipping.lastName} onChange={handleInputChange} className="border-b-2 border-gray-200 py-2 focus:outline-none focus:border-black bg-transparent transition-colors" />
                </div>
              </div>
              
              <div className="flex flex-col space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Phone Number</label>
                <input required type="tel" name="phone" value={shipping.phone} onChange={handleInputChange} className="border-b-2 border-gray-200 py-2 focus:outline-none focus:border-black bg-transparent transition-colors" />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Street Address</label>
                <input required name="street" value={shipping.street} onChange={handleInputChange} className="border-b-2 border-gray-200 py-2 focus:outline-none focus:border-black bg-transparent transition-colors" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">City</label>
                  <input required name="city" value={shipping.city} onChange={handleInputChange} className="border-b-2 border-gray-200 py-2 focus:outline-none focus:border-black bg-transparent transition-colors" />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">State</label>
                  <select 
                    required 
                    name="state" 
                    value={shipping.state} 
                    onChange={handleInputChange} 
                    className="border-b-2 border-gray-200 py-2 focus:outline-none focus:border-black bg-transparent transition-colors cursor-pointer"
                  >
                    <option value="" disabled>Select a state</option>
                    {NIGERIAN_STATES.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Locked Standard Shipping Display */}
            <div className={!shipping.state ? "opacity-50 pointer-events-none" : ""}>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4 border-b border-gray-200 pb-2">Delivery Method</h3>
              {!shipping.state && <p className="text-xs text-red-500 mb-4 font-bold">Select a state to see shipping rates.</p>}
              
              <div className="space-y-3">
                <div className="flex items-center p-4 border-2 border-black bg-gray-50 transition-all">
                  <Truck className="w-5 h-5 mr-4 text-black" />
                  <div className="flex-1">
                    <span className="block text-sm font-bold uppercase tracking-widest">Standard Delivery</span>
                    <span className="block text-xs text-gray-500 mt-1">5-10 Business Days</span>
                  </div>
                  <span className="font-bold">₦{shippingCost.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || !shipping.state}
              className="w-full mt-8 bg-black text-white py-5 font-bold uppercase tracking-widest text-sm hover:bg-brand-primary hover:text-black transition-all flex justify-center items-center group disabled:bg-gray-300 disabled:text-gray-500 shadow-xl"
            >
              {loading ? "Initializing Secure Checkout..." : `Pay ₦${finalTotal.toLocaleString()}`}
              {!loading && <Lock className="w-4 h-4 ml-2" />}
            </button>
          </form>
        </div>

        {/* RIGHT: Order Summary */}
        <div className="bg-gray-50 p-8 border border-gray-100 h-fit sticky top-24">
          <h2 className="text-xl font-bold uppercase tracking-widest mb-6 border-b border-gray-200 pb-4">Order Summary</h2>
          
          <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2">
            {items.map(item => (
              <div key={item.cartItemId} className="flex gap-4">
                <div className="relative w-20 aspect-[3/4] bg-gray-200">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-sm font-bold uppercase tracking-widest">{item.title}</h3>
                  <p className="text-xs text-gray-500 uppercase mt-1">{item.variantLabel}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs font-bold bg-white px-2 py-1 border border-gray-200">Qty: {item.quantity}</span>
                    <span className="font-bold text-sm">₦{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 border-t border-gray-200 pt-6 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>
            
            {discount && (
              <div className="flex justify-between text-brand-primary font-bold">
                <span>Discount ({discount.code})</span>
                <span>- ₦{discountAmount.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between text-gray-500">
              <span>Shipping</span>
              <span>{shipping.state ? `₦${shippingCost.toLocaleString()}` : 'Pending Location'}</span>
            </div>

            <div className="flex justify-between items-center text-2xl font-bold pt-4 border-t border-gray-200 text-black">
              <span>Total</span>
              <span>₦{finalTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
      </div>
    </> // Added the missing closing tag here
  );
}