"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

export const GalleryGrid = ({ children, className }) => {
  return (
    <section className={cn(
      "mx-auto grid max-w-7xl grid-cols-3 gap-2 p-4 md:gap-4 lg:grid-cols-5 lg:gap-6",
      "will-change-transform", // Prepara al navegador para cambios en la cuadrícula
      className
    )}>
      {children}
    </section>
  );
};

export const GalleryItem = ({ src, alt, onClick, className }) => {
  return (
    <motion.article 
      // OPTIMIZACIÓN: Framer Motion maneja la entrada de forma más eficiente que las clases de CSS puras
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative overflow-hidden rounded-sm bg-[#6B5E70]/5"
    >
      <div 
        onClick={onClick}
        className="relative aspect-square w-full cursor-zoom-in group"
      >
        <Image 
          src={src} 
          alt={alt || "Galería"}
          fill // Ocupa todo el contenedor article
          sizes="(max-width: 768px) 33vw, (max-width: 1200px) 20vw, 15vw"
          loading="lazy"
          className={cn(
            "object-cover transition-transform duration-500 group-hover:scale-110",
            "antialiased transform-gpu", // Usa la tarjeta de video
            className
          )}
        />
        
        {/* Overlay sutil para mejorar el contraste sin usar blur pesado */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>
    </motion.article>
  );
};