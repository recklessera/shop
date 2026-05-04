import { prisma } from "@/lib/prisma";
import ShopFilterGrid from "@/components/shop/ShopFilterGrid";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Shop All | Reckless Era",
  description: "Browse our complete collection of premium streetwear.",
};

export default async function ShopPage() {
  // Fetch products with their primary image and collection data
  const products = await prisma.product.findMany({
    where: { is_published: true },
    include: { 
      images: true, // Bringing all images so client can pick primary
      collection: true 
    },
    orderBy: { id: 'desc' }
  });

  const collections = await prisma.collection.findMany({
    orderBy: { title: 'asc' }
  });

  return (
    <div className="w-full bg-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold uppercase tracking-tighter text-black mb-6">
          The Collection
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Uncompromising pieces designed for the era.
        </p>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <ShopFilterGrid products={products} collections={collections} />
      </div>
    </div>
  );
}