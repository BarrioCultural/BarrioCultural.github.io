// app/AppLogic.js
"use client";

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLightbox } from "@/components/recursos/boxes/lightbox"; 
import Navbar from "@/components/recursos/navbar/navbar";

export default function AppLogic({ children }) {
  const pathname = usePathname();
  const { closeLightbox } = useLightbox() || {}; 

  useEffect(() => {
    if (typeof window !== "undefined") {
      // 1. Resetear scroll
      window.scrollTo(0, 0); 
      
      // 2. Cerrar lightbox
      if (closeLightbox) closeLightbox();

      // 3. PROTECCIÓN DE DIBUJOS (Clic derecho y Arrastre)
      const bloquear = (e) => e.preventDefault();
      document.addEventListener("contextmenu", bloquear);
      document.addEventListener("dragstart", bloquear);

      return () => {
        document.removeEventListener("contextmenu", bloquear);
        document.removeEventListener("dragstart", bloquear);
      };
    }
  }, [pathname, closeLightbox]); 

  return (
    <div className="app-container">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}