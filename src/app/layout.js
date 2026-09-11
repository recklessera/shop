import { Inter } from "next/font/google"; 
import "./globals.css";
import { prisma } from "@/lib/prisma"; 

// 1. Performance: Optimize Font Loading
const inter = Inter({ 
  subsets: ["latin"],
  display: "swap", 
  variable: "--font-inter", 
});

// 2. Mobile & Performance: Separate Viewport Export
export const viewport = {
  themeColor: "#000000", 
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, 
};

// 3. SEO & Open Graph: Comprehensive Metadata
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://recklessera.com"),
  
  title: {
    default: "Reckless Era | OFF COURSE. ON PURPOSE",
    template: "%s | Reckless Era", 
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
        url: "/og-image.png", 
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
    images: ["/og-image.png"],
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
      {/* 
        This body applies to EVERYTHING (Store & Admin).
        The UI injected inside 'children' will depend on the Route Group!
      */}
      <body className={`${inter.variable} font-sans antialiased flex flex-col min-h-screen bg-app-bg`}>
        {children}
      </body>
    </html>
  );
}