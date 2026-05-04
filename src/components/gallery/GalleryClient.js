"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function GalleryClient({ items, categories }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState(null);

  // Lock body scroll when Lightbox is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [selectedImage]);

  // Filter items based on active category
  const filteredItems = activeCategory === "All" 
    ? items 
    : items.filter(item => item.category === activeCategory);

  // Lightbox Navigation
  const handlePrev = (e) => {
    e.stopPropagation();
    const currentIndex = filteredItems.findIndex(i => i.id === selectedImage.id);
    const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setSelectedImage(filteredItems[prevIndex]);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    const currentIndex = filteredItems.findIndex(i => i.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    setSelectedImage(filteredItems[nextIndex]);
  };

  return (
    <div className="w-full">
      
      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        <button
          onClick={() => setActiveCategory("All")}
          className={`px-6 py-2 text-sm font-bold uppercase tracking-widest transition-all duration-300 border-2 ${
            activeCategory === "All" 
              ? "border-brand-primary bg-brand-primary text-black" 
              : "border-gray-200 text-gray-500 hover:border-brand-primary hover:text-black"
          }`}
        >
          All
        </button>
        {categories.map(category => (
          category && (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 text-sm font-bold uppercase tracking-widest transition-all duration-300 border-2 ${
                activeCategory === category 
                  ? "border-brand-primary bg-brand-primary text-black" 
                  : "border-gray-200 text-gray-500 hover:border-brand-primary hover:text-black"
              }`}
            >
              {category}
            </button>
          )
        ))}
      </div>

      {/* Masonry Grid (CSS-only via Tailwind Columns) */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 text-gray-500 italic">No images found for this category.</div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 max-w-7xl mx-auto">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-xl bg-gray-100"
              onClick={() => setSelectedImage(item)}
            >
              {/* Note: We don't use 'fill' here so the images dictate their own natural height for the masonry effect */}
              <Image
                src={item.image_url}
                alt={item.caption || "Gallery Image"}
                width={800}
                height={1000}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                {item.category && <span className="text-brand-primary text-xs font-bold uppercase tracking-widest mb-1">{item.category}</span>}
                {item.caption && <p className="text-white font-medium">{item.caption}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full-Screen Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close Button */}
          <button 
            className="absolute top-6 right-6 text-white hover:text-brand-primary transition-colors z-50"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation Arrows */}
          <button 
            className="absolute left-4 md:left-12 text-white hover:text-brand-primary p-4 transition-colors z-50"
            onClick={handlePrev}
          >
            <ChevronLeft className="w-10 h-10 md:w-12 md:h-12" />
          </button>
          
          <button 
            className="absolute right-4 md:right-12 text-white hover:text-brand-primary p-4 transition-colors z-50"
            onClick={handleNext}
          >
            <ChevronRight className="w-10 h-10 md:w-12 md:h-12" />
          </button>

          {/* Main Image */}
          <div className="relative w-full max-w-5xl max-h-[85vh] px-12 md:px-24 flex flex-col items-center justify-center">
            <Image
              src={selectedImage.image_url}
              alt={selectedImage.caption || "Full screen image"}
              width={1200}
              height={1200}
              className="w-auto h-auto max-w-full max-h-[75vh] object-contain shadow-2xl rounded-md"
              priority
            />
            {/* Caption in Lightbox */}
            {(selectedImage.caption || selectedImage.category) && (
              <div className="text-center mt-6">
                {selectedImage.category && <p className="text-brand-primary text-sm font-bold uppercase tracking-widest mb-2">{selectedImage.category}</p>}
                {selectedImage.caption && <p className="text-gray-300 text-lg">{selectedImage.caption}</p>}
              </div>
            )}
          </div>
        </div>
      )}
      
    </div>
  );
}