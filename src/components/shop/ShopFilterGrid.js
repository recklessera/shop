"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation"; // 1. Import this
import { SlidersHorizontal, ChevronDown, Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function ShopFilterGrid({ products, collections }) {
  const searchParams = useSearchParams();
  
  // 2. Initialize state from the URL parameter if it exists
  const [activeCollection, setActiveCollection] = useState(searchParams.get("collection") || "All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; 

  // 3. Keep state synced if the URL changes while already on the page
  useEffect(() => {
    const col = searchParams.get("collection");
    if (col) setActiveCollection(col);
  }, [searchParams]);

  let displayedProducts = products.filter((p) => {
    const matchesCollection = activeCollection === "All" || p.collection?.title === activeCollection;
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCollection && matchesSearch;
  });

  // 4. Sort using the new created_at field instead of random UUIDs
  if (sortOrder === "price-low") displayedProducts.sort((a, b) => a.price - b.price);
  if (sortOrder === "price-high") displayedProducts.sort((a, b) => b.price - a.price);
  if (sortOrder === "newest") displayedProducts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // 5. Apply Pagination Math
  const totalPages = Math.ceil(displayedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = displayedProducts.slice(startIndex, startIndex + itemsPerPage);

  // Helper to reset to page 1 when filters change
  const handleFilterChange = (type, value) => {
    if (type === 'collection') setActiveCollection(value);
    if (type === 'search') setSearchTerm(value);
    setCurrentPage(1); 
  };

  return (
    <div className="w-full">
      {/* Search Bar & Controls Bar */}
      <div className="flex flex-col space-y-6 mb-12">
        
        {/* NEW: Search Input */}
        <div className="relative max-w-md w-full mx-auto md:mx-0">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search the collection..."
            value={searchTerm}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-sm text-sm font-medium focus:border-black outline-none transition-all"
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-200 pb-4 gap-4">
          {/* Collection Filters (Desktop) */}
          <div className="hidden md:flex gap-6">
            <button 
              onClick={() => handleFilterChange('collection', "All")}
              className={`text-sm font-bold uppercase tracking-widest transition-all ${activeCollection === "All" ? "text-brand-primary border-b-2 border-brand-primary" : "text-gray-500 hover:text-black"}`}
            >
              All Pieces
            </button>
            {collections.map(col => (
              <button 
                key={col.id}
                onClick={() => handleFilterChange('collection', col.title)}
                className={`text-sm font-bold uppercase tracking-widest transition-all ${activeCollection === col.title ? "text-brand-primary border-b-2 border-brand-primary" : "text-gray-500 hover:text-black"}`}
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
      </div>

      {/* Mobile Filter Menu (Collapsible) */}
      {isFilterOpen && (
        <div className="md:hidden flex flex-col gap-4 mb-8 pb-4 border-b border-gray-200">
           <button onClick={() => {handleFilterChange('collection', "All"); setIsFilterOpen(false);}} className="text-left font-bold uppercase text-sm">All Pieces</button>
           {collections.map(col => (
             <button key={col.id} onClick={() => {handleFilterChange('collection', col.title); setIsFilterOpen(false);}} className="text-left font-bold uppercase text-sm text-gray-500">
               {col.title}
             </button>
           ))}
        </div>
      )}

      {/* Product Grid */}
      {paginatedProducts.length === 0 ? (
        <div className="text-center py-20 text-gray-500 italic">No products found.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {paginatedProducts.map((product) => {
              const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];
              const totalStock = product.variants?.reduce((acc, v) => acc + v.stock_count, 0) || 0;
              const isSoldOut = totalStock === 0;
              
              return (
                <Link key={product.id} href={`/shop/${product.slug}`} className="group cursor-pointer relative">
                  <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden mb-4">
                    {primaryImage ? (
                      <Image
                        src={primaryImage.image_url}
                        alt={primaryImage.alt_text || product.title}
                        fill
                        className={`object-cover transition-transform duration-700 group-hover:scale-105 ${isSoldOut ? 'opacity-50' : ''}`}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                    )}

                    {isSoldOut && (
                      <div className="absolute top-2 left-2 bg-black text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest z-10">
                        Sold Out
                      </div>
                    )}

                    {!isSoldOut && (
                      <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0 flex justify-center bg-gradient-to-t from-black/50 to-transparent">
                        <span className="bg-white text-black px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-brand-primary transition-colors">
                          View Details
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-start text-left mt-4">
                    <h3 className={`text-sm font-bold uppercase tracking-widest mb-1 ${isSoldOut ? 'text-gray-400' : 'text-black'}`}>{product.title}</h3>
                    <p className={`text-sm font-medium ${isSoldOut ? 'text-gray-400' : 'text-gray-500'}`}>₦{product.price.toLocaleString()}</p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* NEW: Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-16 flex justify-center items-center gap-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-200 rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 text-xs font-bold rounded-full transition-all ${currentPage === i + 1 ? 'bg-black text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-black'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-200 rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}