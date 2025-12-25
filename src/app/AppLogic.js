"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// 1. Lightbox está en components/resources/
import { useLightbox } from "../components/resources/lightbox"; 
import Lightbox from "../components/resources/lightbox"; 

// 2. Navbar está en components/Navbar/ (ojo a las mayúsculas/minúsculas)
import Navbar from "../components/Navbar/navbar"; 

// 3. Tus animaciones están dentro de la carpeta js que está en components
// Según tu estructura: src/components/js/animations.js
import { initAnimations } from "../components/animations/animations";

export default function AppLogic({ children }) {
  const pathname = usePathname();
  const { closeLightbox } = useLightbox(); 

  useEffect(() => {
    // Verificamos que initAnimations exista antes de llamarla
    if (typeof initAnimations === 'function') {
      initAnimations(); 
    }
    window.scrollTo(0, 0); 
    if (closeLightbox) closeLightbox();
  }, [pathname, closeLightbox]); 

  return (
    <div className="app-container">
      <Navbar />
      <Lightbox />
      <main>{children}</main>
    </div>
  );
}