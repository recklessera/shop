import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductClient from "@/components/shop/ProductClient";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ 
    where: { slug },
    include: { images: { where: { is_primary: true } } }
  });
  
  if (!product) return { title: "Product Not Found" };
  
  return {
    title: `${product.title} | Reckless Era`,
    description: `Shop the ${product.title} at Reckless Era.`,
    openGraph: {
      images: product.images[0] ? [product.images[0].image_url] : [],
    }
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;

  // Deep fetch: Product -> Images, Collection, and all specific Variants
  const product = await prisma.product.findUnique({
    where: { 
      slug: slug,
      is_published: true 
    },
    include: { 
      images: { orderBy: { is_primary: 'desc' } }, // Primary image first
      variants: true,
      collection: true
    }
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="w-full bg-white min-h-screen py-10 md:py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <ProductClient product={product} />
      </div>
    </div>
  );
}