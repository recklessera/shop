"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { applyDiscountAction } from "@/app/actions/cart"; // Our new bridge
import { createClient } from "@/utils/supabase/client"; 
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const { items, isOpen, toggleCart, updateQuantity, removeItem, discount, applyDiscount, removeDiscount } = useCartStore();
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  if (!isOpen) return null;

  // --- Calculations ---
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  
  // Use the deduction from your lib if a discount is applied, otherwise 0
  const discountAmount = discount ? discount.deduction : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  // --- Handlers ---
  const handleApplyDiscount = async () => {
    if (!promoInput.trim()) return;
    setIsProcessing(true);
    setPromoError("");

    // Extract collection IDs from cart items (for your collection lock feature!)
    const cartItemCollectionIds = items.map(item => item.collectionId).filter(Boolean);

    // Call the Server Action
    const result = await applyDiscountAction(promoInput, subtotal, cartItemCollectionIds);
    
    if (!result.isValid) {
      setPromoError(result.error);
    } else {
      applyDiscount({
        id: result.discountId,
        code: result.code,
        deduction: result.deduction,
        type: result.type,
        value: result.value
      });
      setPromoInput("");
    }
    setIsProcessing(false);
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toggleCart();
      router.push("/account"); 
      setIsProcessing(false);
      return;
    }

    toggleCart();
    router.push("/checkout");
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={toggleCart} />

      <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold uppercase tracking-widest flex items-center">
            <ShoppingBag className="w-5 h-5 mr-3" /> Your Cart
          </h2>
          <button onClick={toggleCart} className="p-2 text-gray-400 hover:text-black transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <ShoppingBag className="w-12 h-12 text-gray-200" />
              <p className="text-gray-500 uppercase tracking-widest text-sm font-bold">Your cart is empty</p>
              <button onClick={toggleCart} className="text-black underline underline-offset-4 text-xs font-bold uppercase">Continue Shopping</button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.cartItemId} className="flex gap-4">
                <div className="relative w-24 aspect-[3/4] bg-gray-100">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-bold uppercase tracking-widest">{item.title}</h3>
                      <button onClick={() => removeItem(item.cartItemId)} className="text-gray-400 hover:text-red-500">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {item.variantLabel && <p className="text-xs text-gray-500 mt-1 uppercase">{item.variantLabel}</p>}
                    <p className="font-bold mt-2">₦{item.price.toLocaleString()}</p>
                  </div>
                  
                  <div className="flex items-center border border-gray-200 w-fit">
                    <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} className="p-2 hover:bg-gray-50"><Minus className="w-3 h-3" /></button>
                    <span className="px-4 text-sm font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="p-2 hover:bg-gray-50"><Plus className="w-3 h-3" /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-6 bg-gray-50">
            
            {/* Promo Code Section */}
            <div className="mb-6">
              {!discount ? (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Promo Code" 
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 border border-gray-300 px-4 py-2 text-sm uppercase focus:outline-none focus:border-black"
                    />
                    <button 
                      onClick={handleApplyDiscount}
                      disabled={isProcessing || !promoInput}
                      className="bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && <p className="text-xs text-red-500 font-bold">{promoError}</p>}
                </div>
              ) : (
                <div className="flex justify-between items-center bg-green-50 border border-green-200 px-4 py-2">
                  <div>
                    <p className="text-xs font-bold text-green-800 uppercase tracking-widest">Code Applied: {discount.code}</p>
                  </div>
                  <button onClick={removeDiscount} className="text-xs font-bold text-red-500 hover:text-red-700 underline">Remove</button>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6 border-b border-gray-200 pb-4 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              {discount && (
                <div className="flex justify-between text-brand-primary font-bold">
                  <span>Discount ({discount.type === "PERCENT" ? `${discount.value}%` : `₦${discount.value}`})</span>
                  <span>-₦{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-lg font-bold pt-2">
                <span>Total</span>
                <span>₦{finalTotal.toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest text-sm hover:bg-brand-primary hover:text-black transition-all flex justify-center items-center group disabled:bg-gray-400"
            >
              {isProcessing ? "Processing..." : "Secure Checkout"}
              {!isProcessing && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}