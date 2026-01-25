"use client";
import React from "react";
import { GalleryItem } from "@/components/recursos/display/gallery";

export const ArtCard = ({ src, title, subtitle, color, onClick }) => {
  return (
    <GalleryItem 
      src={src} 
      alt={title} 
      color={color} 
      onClick={onClick}
    >
      <div className="p-4 bg-gradient-to-t from-black/80 to-transparent w-full">
        <p className="text-[8px] font-black text-white/50 uppercase tracking-widest mb-1">
          {subtitle}
        </p>
        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">
          {title}
        </h3>
      </div>
    </GalleryItem>
  );
};