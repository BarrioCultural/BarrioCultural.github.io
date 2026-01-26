"use client";
import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import { Sparkles } from 'lucide-react'; // Icono que sugiere algo especial o mágico

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
  // Validación: si no hay URL, activamos el modo "Intriga"
  const tieneImagen = src && src.trim() !== "";

  return (
    <motion.div 
      layout
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative aspect-[3/4] overflow-hidden rounded-[2rem] cursor-pointer bg-neutral-950 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group"
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
        /* ESTADO INTRIGANTE: Se muestra cuando no hay imagen */
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505] border border-white/5 rounded-[2rem]">
          {/* Animación de destello sutil */}
          <div className="relative mb-4">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-30 scale-150" />
            <div className="w-16 h-16 rounded-full bg-gradient-to-t from-neutral-900 to-transparent flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-colors duration-500">
              <Sparkles className="w-6 h-6 text-white/20 group-hover:text-primary group-hover:scale-110 transition-all duration-500" />
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.5em] mb-1">
              "Expediente Oculto"
            </p>
            <div className="h-px w-8 bg-primary/30 mx-auto scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          </div>
        </div>
      )}

      {/* Degradado inferior para legibilidad de textos (Se mantiene siempre) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
      
      {/* Detalle de color superior */}
      {color && (
        <div 
          className="absolute top-0 w-full h-1.5 opacity-50 group-hover:opacity-100 transition-opacity" 
          style={{ backgroundColor: color }} 
        />
      )}

      {/* Título y Categoría (Los "children" que vienen de Drawings) */}
      <div className="absolute bottom-6 left-6 right-6 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
        {children}
      </div>
    </motion.div>
  );
};