import { Inter } from "next/font/google"; 
import "./globals.css";

import AnnouncementBar from "@/components/layout/AnnouncementBar";
import StickyNavbar from "@/components/layout/StickyNavbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Reckless Era | Shop",
  description: "Custom E-Commerce Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased flex flex-col min-h-screen bg-app-bg`}>
        
        <AnnouncementBar />
        <StickyNavbar />
        
        {/* Main page content (page.js) will render inside here */}
        <main className="flex-grow">
          {children}
        </main>

        <Footer />
        
      </body>
    </html>
  );
}