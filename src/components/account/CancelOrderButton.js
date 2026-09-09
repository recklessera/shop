"use client";

import { useState } from "react";
import { cancelPendingOrder } from "@/app/account/actions";

export default function CancelOrderButton({ orderId }) {
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    
    setLoading(true);
    const result = await cancelPendingOrder(orderId);
    
    if (result.error) {
      alert(result.error);
      setLoading(false);
    }
    // If successful, Next.js revalidatePath will automatically refresh the page
  };

  return (
    <button 
      onClick={handleCancel}
      disabled={loading}
      className="mt-4 text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
    >
      {loading ? "Cancelling..." : "Cancel Order"}
    </button>
  );
}