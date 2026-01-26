"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import { Sparkles } from 'lucide-react'; 

export const GalleryGrid = ({ children, headerContent, className }) => {
  // Estado para controlar si el menú/cabecera debe desaparecer
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Clonamos los hijos para pasarles la función que cierra la cabecera
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { 
        onExpand: () => setIsDetailOpen(true) 
      });
    }
    return child;
  });

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!isDetailOpen && (
          <motion.div 
            key="header-gallery"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
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
        {childrenWithProps}
      </section>

      {/* Botón opcional para restaurar el menú si fuera necesario */}
      {isDetailOpen && (
        <button 
          onClick={() => setIsDetailOpen(false)}
          className="fixed top-8 right-8 z-50 bg-primary text-white p-2 rounded-full uppercase text-[10px] font-black tracking-widest"
        >
          "Volver"
        </button>
      )}
    </div>
  );
};

export const GalleryItem = ({ src, alt, children, onClick, onExpand, color, contain }) => {
  const tieneImagen = src && src.trim() !== "";

  const handleInteraction = () => {
    if (onExpand) onExpand(); // Oculta el menú superior
    if (onClick) onClick();   // Abre el Lightbox o canción
  };

  return (
    <motion.div 
      layout
      onClick={handleInteraction}
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
        /* FONDO MORADO OSCURO DE TU PÁGINA */
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1a0b2e] border border-primary/10 rounded-[2rem]">
          <div className="relative mb-4">
            <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping opacity-40 scale-150" />
            <div className="w-16 h-16 rounded-full bg-gradient-to-t from-[#2d1b4d] to-transparent flex items-center justify-center border border-primary/20 group-hover:border-primary transition-colors duration-500">
              <Sparkles className="w-6 h-6 text-primary/40 group-hover:text-primary transition-all duration-500" />
            </div>
          </div>
          <p className="text-[8px] font-black text-primary/40 uppercase tracking-[0.5em]">"Archivo Reservado"</p>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#0d041a] via-transparent to-transparent opacity-80" />
      
      <div className="absolute bottom-6 left-6 right-6 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
        {children}
      </div>
    </motion.div>
  );
};