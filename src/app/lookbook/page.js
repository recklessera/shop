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
    <div className="w-full bg-app-bg min-h-screen py-16">
      
      {/* Page Header */}
      <div className="max-w-4xl mx-auto text-center px-4 mb-16">
        <h1 className="text-5xl md:text-6xl font-bold uppercase tracking-tighter text-black mb-6">
          The Lookbook
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          A visual archive of our campaigns, street style, and the people who define the Reckless Era.
        </p>
      </div>

      {/* Render the Client Component with the fetched data */}
      <div className="px-4 sm:px-6 lg:px-8">
        <GalleryClient items={galleryItems} categories={uniqueCategories} />
      </div>

    </div>
  );
}