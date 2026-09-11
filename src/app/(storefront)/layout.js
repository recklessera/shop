import { prisma } from "@/lib/prisma";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import StickyNavbar from "@/components/layout/StickyNavbar";
import CartDrawer from "@/components/shop/CartDrawer";
import Footer from "@/components/layout/Footer";

export default async function StorefrontLayout({ children }) {
  // 1. Fetch the dynamic settings specifically for the Storefront UI (Footer)
  let storeSettings = null;
  try {
    storeSettings = await prisma.storeSettings.findFirst();
  } catch (error) {
    console.error("Failed to fetch store settings:", error);
  }

  return (
    <>
      {/* Top of the funnel UI */}
      <AnnouncementBar />
      <StickyNavbar />
      <CartDrawer />
      
      {/* 
        The flex-grow class here works perfectly with the flex-col 
        on the <body> tag in your root layout to push the footer down 
      */}
      <main className="flex-grow w-full">
        {children}
      </main>

      {/* 2. Pass the fetched settings back into the Footer */}
      <Footer settings={storeSettings} /> 
    </>
  );
}