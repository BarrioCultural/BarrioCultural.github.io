"use client";
import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";

export const GalleryGrid = ({ children, isDetailOpen, headerContent, className }) => (
  <div className="w-full">
    <AnimatePresence>
      {!isDetailOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          {headerContent}
        </motion.div>
      )}
    </AnimatePresence>

    <section className={cn(
      "mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 p-4 md:p-8 max-w-[1600px]",
      className
    )}>
      {children}
    </section>
  </div>
);

export const GalleryItem = ({ src, alt, children, onClick, color, contain }) => {
  // Validación: verificamos si existe la URL de la imagen
  const tieneImagen = src && src.trim() !== "";

  return (
    <motion.div 
      layout
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative aspect-[3/4] overflow-hidden rounded-[2rem] cursor-pointer bg-neutral-900 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group"
    >
      {tieneImagen ? (
        <Image 
          src={src} 
          alt={alt || "Archivo Visual"} 
          fill 
          sizes="(max-width: 768px) 50vw, 20vw"
          className={cn(
            "transition-all duration-700 group-hover:scale-110",
            contain ? "object-contain p-8 mix-blend-multiply" : "object-cover grayscale-[0.3] group-hover:grayscale-0"
          )}
        />
      ) : (
        /* Estado vacío: Se muestra cuando la URL en Supabase es null o vacía */
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-800 border-2 border-dashed border-white/5 rounded-[2rem]">
          <div className="w-10 h-10 mb-3 rounded-full bg-white/5 flex items-center justify-center">
            <span className="text-white/20 text-lg font-black italic">?</span>
          </div>
          <p className="text-[7px] font-black text-white/20 uppercase tracking-[0.4em]">
            "Sin Previsualización"
          </p>
        </div>
      )}

      {/* Capa de diseño y texto (Se muestra siempre para mantener el título visible) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
      
      {color && (
        <div 
          className="absolute top-0 w-full h-1.5 opacity-50 group-hover:opacity-100 transition-opacity" 
          style={{ backgroundColor: color }} 
        />
      )}

      <div className="absolute bottom-6 left-6 right-6 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
        {children}
      </div>
    </motion.div>
  );
};