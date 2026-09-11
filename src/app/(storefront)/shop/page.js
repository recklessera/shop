import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import ShopFilterGrid from "@/components/shop/ShopFilterGrid";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Shop All | Reckless Era",
  description: "Browse our complete catalogue of premium streetwear.",
};

export default async function ShopPage() {
  // Fetch products with images, collections, AND variants (for stock math)
  const products = await prisma.product.findMany({
    where: { is_published: true },
    include: { 
      images: true, 
      collection: true,
      variants: true // CRITICAL: Required for ShopFilterGrid's sold-out calculation
    },
    orderBy: { created_at: 'desc' } // Sorted by actual creation date
  });

  const collections = await prisma.collection.findMany({
    orderBy: { title: 'asc' }
  });

  return (
    <div className="w-full bg-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold uppercase tracking-tighter text-black mb-6">
          The Catalogue
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Uncompromising pieces designed for the era.
        </p>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="text-center py-20 text-gray-500 font-bold uppercase tracking-widest">Loading catalogue...</div>}>
          <ShopFilterGrid products={products} collections={collections} />
        </Suspense>
      </div>
    </div>
  );
}