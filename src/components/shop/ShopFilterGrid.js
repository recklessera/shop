"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SlidersHorizontal, ChevronDown } from "lucide-react";

export default function ShopFilterGrid({ products, collections }) {
  const [activeCollection, setActiveCollection] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Apply Filtering and Sorting
  let displayedProducts = [...products];

  if (activeCollection !== "All") {
    displayedProducts = displayedProducts.filter(
      (p) => p.collection?.title === activeCollection
    );
  }

  if (sortOrder === "price-low") displayedProducts.sort((a, b) => a.price - b.price);
  if (sortOrder === "price-high") displayedProducts.sort((a, b) => b.price - a.price);
  if (sortOrder === "newest") displayedProducts.sort((a, b) => b.id.localeCompare(a.id)); // Assuming UUIDs sort somewhat chronologically, or use created_at if added to schema

  return (
    <div className="w-full">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-200 pb-4 gap-4">
        
        {/* Collection Filters (Desktop) */}
        <div className="hidden md:flex gap-6">
          <button 
            onClick={() => setActiveCollection("All")}
            className={`text-sm font-bold uppercase tracking-widest ${activeCollection === "All" ? "text-brand-primary border-b-2 border-brand-primary" : "text-gray-500 hover:text-black"}`}
          >
            All Pieces
          </button>
          {collections.map(col => (
            <button 
              key={col.id}
              onClick={() => setActiveCollection(col.title)}
              className={`text-sm font-bold uppercase tracking-widest ${activeCollection === col.title ? "text-brand-primary border-b-2 border-brand-primary" : "text-gray-500 hover:text-black"}`}
            >
              {col.title}
            </button>
          ))}
        </div>

        {/* Mobile Filter Toggle */}
        <button 
          className="md:hidden flex items-center gap-2 text-sm font-bold uppercase tracking-widest border border-gray-200 px-4 py-2 w-full justify-center"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </button>

        {/* Sort Dropdown */}
        <div className="relative w-full md:w-auto">
          <select 
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full md:w-48 appearance-none bg-white border border-gray-200 text-sm font-bold uppercase tracking-widest px-4 py-3 focus:outline-none focus:border-brand-primary cursor-pointer"
          >
            <option value="newest">Latest Arrivals</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400" />
        </div>
      </div>

      {/* Mobile Filter Menu (Collapsible) */}
      {isFilterOpen && (
        <div className="md:hidden flex flex-col gap-4 mb-8 pb-4 border-b border-gray-200">
           <button onClick={() => {setActiveCollection("All"); setIsFilterOpen(false);}} className="text-left font-bold uppercase text-sm">All Pieces</button>
           {collections.map(col => (
             <button key={col.id} onClick={() => {setActiveCollection(col.title); setIsFilterOpen(false);}} className="text-left font-bold uppercase text-sm text-gray-500">
               {col.title}
             </button>
           ))}
        </div>
      )}

      {/* Product Grid */}
      {displayedProducts.length === 0 ? (
        <div className="text-center py-20 text-gray-500 italic">No products found for this filter.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {displayedProducts.map((product) => {
            const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];
            
            return (
              <Link key={product.id} href={`/shop/${product.slug}`} className="group cursor-pointer">
                <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden mb-4">
                  {primaryImage ? (
                    <Image
                      src={primaryImage.image_url}
                      alt={primaryImage.alt_text || product.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                  {/* Optional Hover Overlay for Quick Add */}
                  <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0 flex justify-center bg-gradient-to-t from-black/50 to-transparent">
                    <span className="bg-white text-black px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-brand-primary transition-colors">
                      View Details
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-start text-left mt-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-black mb-1">{product.title}</h3>
                  {/* Using toLocaleString() adds the proper commas for thousands */}
                  <p className="text-gray-500 text-sm font-medium">₦{product.price.toLocaleString()}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}