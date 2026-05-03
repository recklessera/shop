import { prisma } from "@/lib/prisma"; 
import HeroBanner from "../components/home/HeroBanner"; 

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Direct database fetches
  const storeSettings = await prisma.storeSettings.findFirst();
  
  // Fetch the 4 newest published products for the "New Arrivals" section
  const newArrivals = await prisma.product.findMany({
    where: { is_published: true },
    orderBy: { id: 'desc' }, // Changed from created_at to id
    take: 4,
    include: {
      images: {
        where: { is_primary: true },
        take: 1
      }
    }
  });

  return (
    <div className="flex flex-col w-full">
      {/* Hero Banner Section */}
      <HeroBanner bannerUrl={storeSettings?.homepage_banner_url} />
      
      {/* New Arrivals Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <h2 className="text-3xl font-bold uppercase tracking-tighter mb-8 text-center text-brand-primary">
          New Arrivals
        </h2>
        {/* We will build the ProductGrid in the next step */}
        <p className="text-center text-gray-500">
          Successfully fetched {newArrivals.length} products from the database.
        </p>
      </section>
      
    </div>
  );
}