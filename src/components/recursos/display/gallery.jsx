"use client";
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

/**
 * GalleryGrid: El contenedor responsivo para cualquier sección de rejilla.
 */
export const GalleryGrid = ({ children, className }) => (
  <section className={cn(
    "mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 p-4 md:p-8 max-w-[1600px]",
    className
  )}>
    {children}
  </section>
);

/**
 * GalleryItem: La tarjeta maestra con el estilo Garden of Sins.
 */
export const GalleryItem = ({ src, alt, children, onClick, color }) => {
  return (
    <motion.div 
      layout
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="relative aspect-[3/4] overflow-hidden rounded-[2rem] cursor-pointer bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group"
    >
      <Image 
        src={src} 
        alt={alt || "Archivo Visual"} 
        fill 
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 15vw"
        className="object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
      />
      
      {/* Overlay de degradado */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
      
      {/* Línea de color dinámica (útil para personajes) */}
      {color && (
        <div 
          className="absolute top-0 w-full h-1.5 opacity-50 group-hover:opacity-100 transition-opacity" 
          style={{ backgroundColor: color }} 
        />
      )}

      {/* Contenido inyectado (Textos) */}
      <div className="absolute bottom-6 left-6 right-6 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
        {children}
      </div>
    </motion.div>
  );
};