"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useEffect, useState } from "react";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem } = useCartStore();
  
  // Prevent hydration errors by only rendering cart contents after mount
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  if (!isOpen) return null;

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <>
      {/* Dark Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 z-[200] backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-white z-[250] shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold uppercase tracking-widest text-black">Your Cart ({isMounted ? items.length : 0})</h2>
          <button onClick={closeCart} className="p-2 hover:text-brand-primary transition-colors">
            <X className="w-6 h-6 text-black" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {!isMounted || items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-gray-500 uppercase tracking-widest text-sm mb-6">Your cart is empty.</p>
              <button onClick={closeCart} className="bg-black text-white px-8 py-4 font-bold uppercase tracking-widest text-xs hover:bg-brand-primary hover:text-black transition-colors">
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.cartItemId} className="flex gap-4">
                <div className="relative w-24 h-32 bg-gray-100 shrink-0">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold uppercase tracking-wider text-sm">{item.title}</h3>
                      <button onClick={() => removeItem(item.cartItemId)} className="text-gray-400 hover:text-brand-accent transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {item.variantLabel && <p className="text-xs text-gray-500">{item.variantLabel}</p>}
                    <p className="font-bold mt-2">₦{item.price.toLocaleString()}</p>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center border border-gray-200 w-max">
                    <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} className="p-2 hover:bg-gray-50 transition-colors">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="p-2 hover:bg-gray-50 transition-colors">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {isMounted && items.length > 0 && (
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold uppercase tracking-widest text-sm">Subtotal</span>
              <span className="text-xl font-bold">₦{subtotal.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 mb-6 text-center uppercase tracking-widest">Shipping & taxes calculated at checkout.</p>
            <Link 
              href="/checkout" 
              onClick={closeCart}
              className="w-full flex items-center justify-center bg-brand-primary text-black py-4 font-bold uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-all shadow-lg"
            >
              Secure Checkout
            </Link>
          </div>
        )}
        
      </div>
    </>
  );
}