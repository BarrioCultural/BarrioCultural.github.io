"use client";

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLightbox } from "@/components/recursos/lightbox"; 
import Navbar from "@/components/recursos/navbar/navbar";

export default function AppLogic({ children }) {
  const pathname = usePathname();
  const { closeLightbox } = useLightbox(); 

  useEffect(() => {
    if (typeof window !== "undefined") {
      // 1. Resetear el scroll al cambiar de página
      window.scrollTo(0, 0); 
      
      // 2. Cerramos el lightbox si estaba abierto
      if (closeLightbox) {
        closeLightbox();
      }
    }
  }, [pathname, closeLightbox]); 

  return (
    <div className="app-container">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}