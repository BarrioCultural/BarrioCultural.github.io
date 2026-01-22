"use client";

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLightbox } from "@/components/recursos/boxes/lightbox"; 
import Navbar from "@/components/recursos/navbar/navbar";

export default function AppLogic({ children }) {
  const pathname = usePathname();
  const { closeLightbox } = useLightbox(); 

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0); 
      if (closeLightbox) {
        closeLightbox();
      }
    }
  }, [pathname, closeLightbox]); 

  return (
    <div className="app-container bg-[#F0F0F0] min-h-screen w-full">
      <Navbar />
      <main className="bg-[#F0F0F0] min-h-screen">{children}</main>
    </div>
  );
}