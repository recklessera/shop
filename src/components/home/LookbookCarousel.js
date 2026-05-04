"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react"; 

export default function LookbookCarousel({ items }) {
  const [activeIndex, setActiveIndex] = useState(Math.floor(items.length / 2));

  if (!items || items.length === 0) return null;

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % items.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + items.length) % items.length);

  return (
    <div className="relative w-full overflow-hidden py-16 flex flex-col items-center">
      {/* 3. Typography matched to the rest of the site */}
      <h2 className="text-3xl font-bold uppercase tracking-tighter mb-12 text-center text-brand-primary">
        The Lookbook
      </h2>

      {/* Carousel Container */}
      <div className="relative w-full max-w-6xl h-[450px] md:h-[550px] flex justify-center items-center">
        {items.map((item, index) => {
          const offset = index - activeIndex;
          const absOffset = Math.abs(offset);

          // 1. Lowered Z-index base (30) so it won't overlap the z-50 Navbar
          let zIndex = 30 - absOffset;
          // 6. Smoother, more subtle scaling
          let scale = 1 - absOffset * 0.12; 
          let opacity = absOffset === 0 ? 1 : 1 - absOffset * 0.15;
          
          // 5. Pulled images closer together (changed 50% to 35%)
          let translateX = offset === 0 ? 0 : offset > 0 ? `${35 * absOffset}%` : `-${35 * absOffset}%`;

          if (absOffset > 3) return null;

          return (
            <div
              key={item.id}
              onClick={() => setActiveIndex(index)}
              className="absolute w-[260px] h-[380px] md:w-[320px] md:h-[480px] transition-all duration-700 ease-out cursor-pointer rounded-xl bg-white"
              style={{
                zIndex,
                opacity,
                transform: `translateX(${translateX}) scale(${scale})`,
                // 6. Added a sharper shadow for the active center card
                boxShadow: absOffset === 0 ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
              }}
            >
              {/* 5. Added a thick white border to create the dividing line effect */}
              <div className="relative w-full h-full border-4 border-white rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src={item.image_url}
                  alt={item.caption || "Lookbook image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                
                {/* Overlay for the active center item */}
                {absOffset === 0 && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white font-bold tracking-wide uppercase">{item.category}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls & Navigation */}
      <div className="mt-12 flex flex-col items-center gap-8">
        
        {/* 2. Left and Right Arrow Buttons */}
        <div className="flex gap-4">
          <button 
            onClick={handlePrev}
            className="bg-black text-white p-4 rounded-full hover:bg-brand-primary hover:scale-110 transition-all duration-300 shadow-xl flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={handleNext}
            className="bg-black text-white p-4 rounded-full hover:bg-brand-primary hover:scale-110 transition-all duration-300 shadow-xl flex items-center justify-center"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>

        {/* 4. View Full Gallery Button */}
        <Link 
          href="/lookbook" 
          className="border-b-2 border-brand-primary pb-1 text-sm font-bold uppercase tracking-widest hover:text-brand-accent hover:border-brand-accent transition-colors"
        >
          View Full Gallery
        </Link>
        
      </div>
    </div>
  );
}