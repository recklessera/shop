import { prisma } from "@/lib/prisma"; 
import HeroBanner from "../components/home/HeroBanner"; 
import ProductGrid from "../components/home/ProductGrid"; 
import LookbookCarousel from "../components/home/LookbookCarousel";
import CollectionGrid from "../components/home/CollectionGrid"; 
import BrandValueProps from "../components/home/BrandValueProps"; 
import BlogPreview from "../components/home/BlogPreview"; 
import JoinTheInnerCircle from "../components/home/JoinTheInnerCircle"; // Updated Import

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const storeSettings = await prisma.storeSettings.findFirst();
  
  const newArrivals = await prisma.product.findMany({
    where: { is_published: true },
    orderBy: { id: 'desc' }, 
    take: 4,
    include: { images: { where: { is_primary: true }, take: 1 } }
  });

  const lookbookItems = await prisma.gallery.findMany({
    orderBy: { sort_order: 'asc' }, 
    take: 7,
  });

  const collections = await prisma.collection.findMany({
    take: 6,
    orderBy: { id: 'asc' } 
  });

  const blogPosts = await prisma.blog.findMany({
    where: { status: 'published' },
    orderBy: { published_at: 'desc' },
    take: 3
  });

  return (
    <div className="flex flex-col w-full overflow-hidden">
      <HeroBanner bannerUrl={storeSettings?.homepage_banner_url} />
      
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <h2 className="text-3xl font-bold uppercase tracking-tighter mb-12 text-center text-brand-primary">
          New Arrivals
        </h2>
        <ProductGrid products={newArrivals} />
        <div className="mt-12 flex justify-center">
          <a href="/shop" className="border-b-2 border-brand-primary pb-1 text-sm font-bold uppercase tracking-widest hover:text-brand-accent hover:border-brand-accent transition-colors">
            Shop All Products
          </a>
        </div>
      </section>

      <section className="w-full bg-app-bg py-8">
        <LookbookCarousel items={lookbookItems} />
      </section>
      
      <section className="w-full bg-white">
        <CollectionGrid collections={collections} />
      </section>
      
      <BrandValueProps />
      
      <BlogPreview posts={blogPosts} />
      
      {/* Final Section: Join The Inner Circle */}
      <JoinTheInnerCircle />
      
    </div>
  );
}