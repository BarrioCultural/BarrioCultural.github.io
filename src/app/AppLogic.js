"use client";

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLightbox } from "@/components/recursos/boxes/lightbox"; 
import Navbar from "@/components/recursos/navbar/navbar";

export default function AppLogic({ children }) {
  const pathname = usePathname();
  // "Añadimos un valor por defecto para evitar errores si el context es nulo"
  const { closeLightbox } = useLightbox() || {}; 

  useEffect(() => {
    // "Solo ejecutamos si estamos en el navegador y useEffect existe"
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0); 
      
      if (closeLightbox && typeof closeLightbox === 'function') {
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