"use client";

import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function PolicyDrawer({ isOpen, onClose, policyType }) {
  // Lock background scrolling when the drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const policies = {
    shipping: {
      title: "Shipping Info",
      content: (
        <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
          <div>
            <h4 className="font-bold uppercase tracking-widest text-black text-xs mb-2">Processing Time</h4>
            <p>All orders are processed within 1 to 3 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.</p>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-widest text-black text-xs mb-2">Domestic Delivery (Nigeria)</h4>
            <p>Standard delivery within Lagos takes 5-10 business days. Deliveries outside Lagos take 7-14 business days. Shipping charges for your order will be calculated and displayed at checkout.</p>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-widest text-black text-xs mb-2">International Shipping</h4>
            <p>For all international orders, please contact us directly to arrange shipping and handling. You can message us on WhatsApp or send an email to <a href="mailto:internationalorders@recklessera.com" className="font-bold text-black hover:underline">internationalorders@recklessera.com</a>.</p>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-widest text-black text-xs mb-2">How do I check the status of my order?</h4>
            <p>When your order has shipped, you will receive an email notification from us which will include a tracking number you can use to check its status. Please allow 24 hours for the tracking information to become available.</p>
          </div>
        </div>
      )
    },
    returns: {
      title: "Returns & Refunds",
      content: (
        <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
          <div>
            <h4 className="font-bold uppercase tracking-widest text-black text-xs mb-2">Our Return Policy</h4>
            <p>All sales are final. We strictly accept returns only for items that arrive damaged or defective. Claims for damaged goods <strong className="text-black">must be reported on the exact day of delivery</strong>.</p>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-widest text-black text-xs mb-2">How to Report a Damaged Item</h4>
            <p>To initiate a return for a damaged item, you must email <a href="mailto:customercare@recklessera.com" className="font-bold text-black hover:underline">customercare@recklessera.com</a> on the day your package is delivered. Please include your order number, a description of the defect, and clear photos of the damaged item. Once reviewed, we will provide instructions on how to return the package.</p>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-widest text-black text-xs mb-2">Refunds & Replacements</h4>
            <p>Once your damaged item is received and inspected, we will notify you of the approval or rejection of your claim. If approved, we will either send a replacement or process a refund back to your original payment method via Squadco within 5-7 business days.</p>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-widest text-black text-xs mb-2">Exceptions / Non-returnable items</h4>
            <p>We do not accept returns for buyer's remorse, incorrect sizing, sale items, limited edition drops, or gift cards.</p>
          </div>
        </div>
      )
    }
  };

  // Default to shipping to prevent errors during transition when policyType is null
  const currentPolicy = policies[policyType] || policies.shipping;

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-[210] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100">
          <h2 className="text-xl font-bold uppercase tracking-tighter text-black">
            {currentPolicy.title}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-gray-400 hover:text-black transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          {currentPolicy.content}
        </div>
      </div>
    </>
  );
}