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
          className="fixed top-6 right-6 z-[60] bg-[#2a1b3d] text-[#f3e8ff] px-5 py-2 rounded-full uppercase text-[9px] font-black tracking-widest border border-white/10 hover:bg-[#4b3061] transition-all shadow-xl"
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
      className={cn(
        "relative aspect-[3/4] overflow-hidden rounded-[2.5rem] cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group",
        tieneImagen ? "bg-neutral-900" : "bg-[#e9d5ff]" // Morado pastel claro si no hay imagen
      )}
    >
      {tieneImagen ? (
        <>
          <Image 
            src={src} 
            alt={alt || "Archivo Visual"} 
            fill 
            sizes="(max-width: 768px) 50vw, 20vw"
            className={cn(
              "transition-all duration-700 group-hover:scale-110",
              contain ? "object-contain p-8 mix-blend-multiply" : "object-cover grayscale-[0.2] group-hover:grayscale-0"
            )}
          />
          {/* Degradado oscuro solo para fotos, para que el texto blanco se lea */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
        </>
      ) : (
        /* ESTADO VACÍO: FONDO CLARO, ICONO Y TEXTO OSCURO */
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-[#2a1b3d]">
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full bg-[#c084fc]/20 animate-ping opacity-50" />
            <div className="w-16 h-16 rounded-full bg-white/40 backdrop-blur-sm flex items-center justify-center border-2 border-[#2a1b3d]/10 relative z-10 shadow-sm">
              <Sparkles className="w-7 h-7 text-[#2a1b3d]" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-1">
              "Inédito"
            </p>
            <div className="h-0.5 w-6 bg-[#2a1b3d]/20 mx-auto rounded-full" />
          </div>
        </div>
      )}

      {/* Contenedor de textos (hijos) */}
      <div className={cn(
        "absolute bottom-8 left-8 right-8 transition-all duration-500 z-30",
        tieneImagen ? "text-white" : "text-[#2a1b3d]" // Texto oscuro si el fondo es claro
      )}>
        {/* Aquí es donde el CSS de los 'children' en Drawings podría necesitar ajuste si es hardcoded blanco */}
        <div className="group-hover:translate-y-[-4px] transition-transform duration-500">
          {children}
        </div>
      </div>

      {color && (
        <div 
          className="absolute top-0 w-full h-2 opacity-60" 
          style={{ backgroundColor: color }} 
        />
      )}
    </motion.div>
  );
};