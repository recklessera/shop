import { prisma } from "@/lib/prisma";
import GalleryClient from "@/components/gallery/GalleryClient";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "The Lookbook",
  description: "Explore the Reckless Era visual portfolio and latest campaigns.",
};

export default async function LookbookPage() {
  // 1. Fetch all gallery items from the database
  const galleryItems = await prisma.gallery.findMany({
    orderBy: { sort_order: 'asc' },
  });

  // 2. Extract a list of unique, non-null categories for the filter buttons
  const uniqueCategories = [...new Set(
    galleryItems
      .map(item => item.category)
      .filter(category => category !== null && category !== "")
  )];

  return (
    <div className="w-full bg-app-bg min-h-screen pt-20 pb-24">
      
      {/* Page Header - Adjusted for sharp left-alignment on desktop */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-2xl text-left">
          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter text-black mb-4">
            The Lookbook
          </h1>
          <p className="text-sm md:text-base text-gray-500 uppercase tracking-widest font-bold">
            A visual archive of our campaigns and the people who define the Reckless Era.
          </p>
        </div>
      </div>

      {/* Render the Client Component with the fetched data */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GalleryClient items={galleryItems} categories={uniqueCategories} />
      </div>

    </div>
  );
}