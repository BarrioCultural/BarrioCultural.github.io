"use client";
import React from "react";
import { GalleryItem } from "@/components/recursos/display/gallery";

export const ArtCard = ({ src, title, subtitle, onClick }) => {
  return (
    <GalleryItem src={src} alt={title} onClick={onClick}>
      {/* Contenedor de información con degradado */}
      <div className="p-4 bg-gradient-to-t from-black/90 via-black/20 to-transparent w-full h-full flex flex-col justify-end group transition-all duration-500">
        {subtitle && (
          <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-1 group-hover:text-primary transition-colors duration-300">
            {subtitle}
          </p>
        )}
        <h3 className="text-xl font-black text-white uppercase italic leading-none tracking-tighter group-hover:translate-x-1 transition-transform duration-300">
          {title}
        </h3>
      </div>
    </GalleryItem>
  );
};