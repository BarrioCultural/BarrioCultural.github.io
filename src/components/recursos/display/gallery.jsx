"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import { Sparkles } from 'lucide-react'; 

export const GalleryGrid = ({ children, headerContent, className }) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

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
            key="header-section"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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

      {isDetailOpen && (
        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsDetailOpen(false)}
          className="fixed top-6 right-6 z-[60] bg-white/10 backdrop-blur-md text-white/70 px-5 py-2 rounded-full uppercase text-[9px] font-black tracking-widest border border-white/10 hover:bg-white hover:text-black transition-all"
        >
          "Mostrar Filtros"
        </motion.button>
      )}
    </div>
  );
};

export const GalleryItem = ({ src, alt, children, onClick, onExpand, color, contain }) => {
  const tieneImagen = src && src.trim() !== "";

  const handleInteraction = () => {
    if (onExpand) onExpand();
    if (onClick) onClick();
  };

  return (
    <motion.div 
      layout
      onClick={handleInteraction}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative aspect-[3/4] overflow-hidden rounded-[2rem] cursor-pointer bg-[#2a2438] shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group"
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
        /* FONDO MORADO PASTEL OSCURO (Muted Purple) */
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#352f44]">
          <div className="relative mb-4 flex items-center justify-center">
            {/* Brillo sutil lila suave */}
            <div className="absolute w-20 h-20 rounded-full bg-[#5c5470]/30 blur-2xl animate-pulse" />
            <div className="w-14 h-14 rounded-full bg-[#2a2438]/40 flex items-center justify-center border border-white/5 relative z-10 shadow-2xl">
              <Sparkles className="w-5 h-5 text-[#b2a4ff]/40 group-hover:text-[#b2a4ff] transition-colors duration-500" />
            </div>
          </div>
          <span className="text-[7px] font-black text-[#b2a4ff]/30 uppercase tracking-[0.5em] text-center">
            "Clasificado"
          </span>
        </div>
      )}

      {/* GRADIENTE NEGRO DE LEGIBILIDAD (Se mantiene siempre para el texto blanco) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500" />
      
      {/* Detalle de color superior opcional */}
      {color && <div className="absolute top-0 w-full h-1.5 opacity-40 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: color }} />}

      {/* TEXTOS (Categoría y Título) */}
      <div className="absolute bottom-6 left-6 right-6 translate-y-2 group-hover:translate-y-0 transition-all duration-500 z-30">
        {children}
      </div>
    </motion.div>
  );
};