import { Inter } from "next/font/google"; 
import "./globals.css";
import { prisma } from "@/lib/prisma"; 

import AnnouncementBar from "@/components/layout/AnnouncementBar";
import StickyNavbar from "@/components/layout/StickyNavbar";
import CartDrawer from "@/components/shop/CartDrawer";
import Footer from "@/components/layout/Footer";

// 1. Performance: Optimize Font Loading
const inter = Inter({ 
  subsets: ["latin"],
  display: "swap", // Ensures text remains visible while the custom font loads
  variable: "--font-inter", 
});

// 2. Mobile & Performance: Separate Viewport Export (Next.js Best Practice)
export const viewport = {
  themeColor: "#000000", // Colors the mobile browser address bar
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // Prevents annoying auto-zooming on mobile inputs
};

// 3. SEO & Open Graph: Comprehensive Metadata
export const metadata = {
  // Replace this URL with your actual production domain when you launch
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://recklessera.com"),
  
  title: {
    default: "Reckless Era | OFF COURSE. ON PURPOSE",
    template: "%s | Reckless Era", // Child pages will automatically format as "Shop | Reckless Era"
  },
  description: "Discover the Reckless Era. Premium quality, bold designs, and uncompromising craftsmanship for those who refuse to blend in. Worldwide shipping available.",
  keywords: ["streetwear", "premium fashion", "luxury clothing", "Reckless Era", "bold style", "exclusive apparel"],
  authors: [{ name: "Reckless Era" }],
  creator: "Reckless Era",
  
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Reckless Era | OFF COURSE. ON PURPOSE",
    description: "Premium quality pieces built for those who refuse to blend in. Join the Inner Circle.",
    siteName: "Reckless Era",
    images: [
      {
        url: "/og-image.png", // We will need to place an image named og-image.jpg in your /public folder!
        width: 1000,
        height: 700,
        alt: "Reckless Era Cover Image",
      },
    ],
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Reckless Era | OFF COURSE. ON PURPOSE",
    description: "Premium quality pieces built for those who refuse to blend in. Worldwide shipping.",
    images: ["/og-image.jpg"],
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({ children }) {
  // Fetch the dynamic settings from your database
  let storeSettings = null;
  try {
    storeSettings = await prisma.storeSettings.findFirst();
  } catch (error) {
    console.error("Failed to fetch store settings:", error);
  }

  // Set up the CSS variables, falling back to defaults if the DB is empty
  const primaryColor = storeSettings?.theme_primary_color || '#000000';
  const secondaryColor = storeSettings?.theme_secondary_color || '#ffffff';
  const accentColor = storeSettings?.theme_accent_color || '#ff0000';

  return (
    <html lang="en">
      <head>
        {/* Inject the dynamic CSS variables into the root */}
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --theme-primary: ${primaryColor};
              --theme-secondary: ${secondaryColor};
              --theme-accent: ${accentColor};
            }
          `
        }} />
      </head>
      <body className={`${inter.variable} font-sans antialiased flex flex-col min-h-screen bg-app-bg`}>
        
        <AnnouncementBar />
        <StickyNavbar />
        <CartDrawer />
        
        <main className="flex-grow">
          {children}
        </main>

        <Footer settings={storeSettings} />
        
      </body>
    </html>
  );
}