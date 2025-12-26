"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Importaciones (Rutas corregidas)
import { useLightbox } from "../components/lightbox/lightbox"; 
import Lightbox from "../components/lightbox/lightbox"; 
import Navbar from "../components/navbar/navbar"; 
import { initAnimations } from "../components/animations/animations";

export default function AppLogic({ children }) {
  const pathname = usePathname();
  const { closeLightbox } = useLightbox(); 

  useEffect(() => {
    // 🛡️ ESTA ES LA CLAVE:
    // Solo entramos aquí si 'window' existe (o sea, estamos en el navegador)
    if (typeof window !== "undefined") {
      
      // 1. Ejecutamos el scroll de forma segura
      window.scrollTo(0, 0); 
      
      // 2. Ejecutamos animaciones solo si la función existe
      if (typeof initAnimations === 'function') {
        try {
          initAnimations(); 
        } catch (error) {
          console.error("Error en animaciones:", error);
        }
      }
      
      // 3. Cerramos el lightbox
      if (closeLightbox) closeLightbox();
    }
  }, [pathname, closeLightbox]); 

  return (
    <div className="app-container">
      <Navbar />
      <Lightbox />
      <main>{children}</main>
    </div>
  );
}