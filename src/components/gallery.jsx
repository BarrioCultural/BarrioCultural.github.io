import React from 'react';
import { cn } from "@/lib/utils";

// Este componente envuelve la cuadrícula y las imágenes con tus estilos de Sass migrados
export const GalleryGrid = ({ children, className }) => {
  return (
    <section className={cn(
      "mx-auto grid max-w-container grid-cols-3 gap-2 p-4 md:gap-4 lg:grid-cols-5 lg:gap-6",
      className
    )}>
      {children}
    </section>
  );
};

// Este componente es la imagen individual con los efectos de hover y zoom
export const GalleryItem = ({ src, alt, onClick, className }) => {
  return (
    <article className="animate-in fade-in zoom-in duration-500">
      <img 
        src={src} 
        alt={alt}
        onClick={onClick}
        className={cn(
          "aspect-square w-full cursor-zoom-in rounded-sm bg-white object-cover shadow-sm",
          "transition-all duration-300 hover:z-10 hover:scale-105 hover:shadow-xl",
          className
        )}
      />
    </article>
  );
};