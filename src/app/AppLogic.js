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
      // 1. Resetear el scroll al cambiar de página
      window.scrollTo(0, 0); 
      
      // 2. Cerrar el lightbox al cambiar de ruta
      if (closeLightbox && typeof closeLightbox === 'function') {
        closeLightbox();
      }

      // 3. BLOQUEO DE CLIC DERECHO Y ARRASTRE (Protección de dibujos)
      const bloquearAccion = (e) => e.preventDefault();
      
      document.addEventListener("contextmenu", bloquearAccion);
      document.addEventListener("dragstart", bloquearAccion);

      // Limpieza al desmontar el componente
      return () => {
        document.removeEventListener("contextmenu", bloquearAccion);
        document.removeEventListener("dragstart", bloquearAccion);
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