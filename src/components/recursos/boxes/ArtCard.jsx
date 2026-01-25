"use client";
import React from "react";
import { GalleryItem } from "@/components/recursos/display/gallery";

export const ArtCard = ({ src, title, subtitle, color, onClick }) => {
  return (
    <GalleryItem 
      src={src} 
      alt={title} 
      color={color} // Mantiene el soporte para el color personalizado de personajes
      onClick={onClick}
    >
      {/* Contenedor con el degradado y estilo de Personajes */}
      <div className="p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent w-full h-full flex flex-col justify-end group transition-all duration-500">
        {subtitle && (
          <p className="text-[8px] font-black text-white/50 uppercase tracking-widest mb-1 group-hover:text-primary transition-colors duration-300">
            {subtitle}
          </p>
        )}
        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none group-hover:scale-[1.02] origin-left transition-transform duration-300">
          {title}
        </h3>
      </div>
    </GalleryItem>
  );
};