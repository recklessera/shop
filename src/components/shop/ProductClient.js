"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingBag, ChevronRight, ChevronLeft } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function ProductClient({ product }) {
  // Image Gallery State
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Extract unique sizes and colors from variants
  const uniqueSizes = [...new Set(product.variants.map(v => v.size).filter(Boolean))];
  const uniqueColors = [...new Set(product.variants.map(v => v.color).filter(Boolean))];

  // Variant Selection State
  const [selectedSize, setSelectedSize] = useState(uniqueSizes[0] || null);
  const [selectedColor, setSelectedColor] = useState(uniqueColors[0] || null);

  // Find the currently active variant based on selection
  const activeVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  ) || product.variants[0]; // Fallback to first if mismatch

  // Determine Price and Stock
  const displayPrice = activeVariant?.price || product.price;
  const isOutOfStock = activeVariant ? activeVariant.stock_count <= 0 : true;

  const addItem = useCartStore((state) => state.addItem);

const handleAddToCart = () => {
  addItem({
    productId: product.id,
    variantId: activeVariant?.id,
    title: product.title,
    price: displayPrice,
    image: product.images[0]?.image_url,
    variantLabel: activeVariant ? `${selectedColor} / ${selectedSize}` : '',
    quantity: 1
  });
};

  return (
    <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
      
      {/* LEFT: Image Gallery */}
      <div className="w-full lg:w-3/5 flex flex-col-reverse md:flex-row gap-4">
        {/* Thumbnails (Vertical on desktop, horizontal on mobile) */}
        <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:w-24 shrink-0 no-scrollbar">
          {product.images.map((img, idx) => (
            <button 
              key={img.id} 
              onClick={() => setActiveImageIndex(idx)}
              className={`relative aspect-[3/4] w-20 md:w-full shrink-0 overflow-hidden border-2 transition-all ${activeImageIndex === idx ? 'border-brand-primary' : 'border-transparent hover:border-gray-300'}`}
            >
              <Image src={img.image_url} alt="Thumbnail" fill className="object-cover" />
            </button>
          ))}
        </div>

        {/* Main Image */}
        <div className="relative aspect-[3/4] w-full bg-gray-100 overflow-hidden group">
          {product.images[activeImageIndex] ? (
            <Image 
              src={product.images[activeImageIndex].image_url} 
              alt={product.title} 
              fill 
              className="object-cover object-center"
              priority
            />
          ) : (
             <div className="w-full h-full flex items-center justify-center text-gray-400">No Image Available</div>
          )}
        </div>
      </div>

      {/* RIGHT: Product Info & Form */}
      <div className="w-full lg:w-2/5 flex flex-col pt-4 md:pt-10">
        
        {/* Breadcrumbs / Collection Tag */}
        {product.collection && (
          <span className="text-brand-primary text-xs font-bold uppercase tracking-widest mb-4">
            {product.collection.title}
          </span>
        )}

        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter text-black mb-4">
          {product.title}
        </h1>
        
      <p className="text-2xl text-gray-600 mb-8">₦{displayPrice.toLocaleString()}</p>

        {/* Variant Selectors */}
        <div className="flex flex-col gap-8 mb-10 border-t border-b border-gray-200 py-8">
          
          {/* Colors */}
          {uniqueColors.length > 0 && (
            <div>
              <div className="flex justify-between mb-3">
                <span className="text-sm font-bold uppercase tracking-widest">Color</span>
                <span className="text-sm text-gray-500">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {uniqueColors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-6 py-3 border text-sm font-bold uppercase tracking-widest transition-colors ${selectedColor === color ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-600 hover:border-black'}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {uniqueSizes.length > 0 && (
            <div>
              <div className="flex justify-between mb-3">
                <span className="text-sm font-bold uppercase tracking-widest">Size</span>
                <button className="text-xs text-gray-400 hover:text-brand-primary underline underline-offset-4 uppercase tracking-wider">Size Guide</button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {uniqueSizes.map(size => {
                  // Optional: Check if this specific size+color combo is out of stock to grey it out
                  const variantForSize = product.variants.find(v => v.size === size && v.color === selectedColor);
                  const isSizeOutOfStock = variantForSize ? variantForSize.stock_count <= 0 : true;

                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      disabled={isSizeOutOfStock}
                      className={`py-3 border text-sm font-bold uppercase tracking-widest transition-colors ${
                        selectedSize === size 
                          ? 'border-brand-primary bg-brand-primary text-black' 
                          : isSizeOutOfStock 
                            ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                            : 'border-gray-200 text-gray-600 hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Add to Cart Action */}
        <button 
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full py-5 flex items-center justify-center text-sm font-bold uppercase tracking-widest transition-colors ${
            isOutOfStock 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-black text-white hover:bg-brand-primary hover:text-black shadow-xl hover:shadow-2xl'
          }`}
        >
          {isOutOfStock ? (
             "Out of Stock"
          ) : (
            <>
              <ShoppingBag className="w-5 h-5 mr-3" /> Add To Cart
            </>
          )}
        </button>

        {/* Description */}
        <div className="mt-12">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-4 border-b border-gray-200 pb-2">Description</h3>
          <div 
            className="text-gray-600 leading-relaxed text-sm prose prose-sm prose-gray"
            dangerouslySetInnerHTML={{ __html: product.description }} 
          />
        </div>

      </div>
    </div>
  );
}