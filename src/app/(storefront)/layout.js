import AnnouncementBar from "@/components/layout/AnnouncementBar";
import StickyNavbar from "@/components/layout/StickyNavbar";
import CartDrawer from "@/components/shop/CartDrawer";
import Footer from "@/components/layout/Footer";

export default function StorefrontLayout({ children }) {
  return (
    <>
      <AnnouncementBar />
      <StickyNavbar />
      <CartDrawer />
      
      <main className="flex-grow">
        {children}
      </main>

      {/* We can pass settings to Footer if needed by fetching them here or in the component */}
      <Footer /> 
    </>
  );
}