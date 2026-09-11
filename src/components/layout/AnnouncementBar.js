"use client";

export default function AnnouncementBar() {
  return (
    <div className="bg-brand-primary text-brand-secondary py-2.5 text-xs md:text-sm font-bold uppercase tracking-widest overflow-hidden relative flex w-full">
      
      {/* 1. We inject a custom CSS animation just for this component */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }
        /* Pauses the scrolling if a user hovers over it to read */
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      {/* 2. The scrolling container */}
      <div className="animate-marquee flex whitespace-nowrap w-max">
        {/* We repeat the text to create a seamless infinite loop */}
        <span className="px-8 md:px-16">Free Shipping in Lagos on all Pre-orders</span>
        <span className="px-8 md:px-16">Free Shipping in Lagos on all Pre-orders</span>
        <span className="px-8 md:px-16">Free Shipping in Lagos on all Pre-orders</span>
        <span className="px-8 md:px-16">Free Shipping in Lagos on all Pre-orders</span>
      </div>
      
    </div>
  );
}