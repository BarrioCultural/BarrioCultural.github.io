"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import { Sparkles } from 'lucide-react'; 

export const GalleryGrid = ({ children, headerContent, className }) => {
  // Este estado controla si la cabecera (filtros/título) es visible
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Función para cerrar el detalle y volver a mostrar la cabecera
  const closeDetail = () => setIsDetailOpen(false);

  // Pasamos la función de abrir a los hijos (GalleryItem) automáticamente
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
      {/* CABECERA: Desaparece cuando isDetailOpen es true */}
      <AnimatePresence mode="wait">
        {!isDetailOpen && (
          <motion.div 
            key="header-section"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50, height: 0 }}
            transition={{ duration: 0.4, ease: "circOut" }}
            className="overflow-hidden"
          >
            {headerContent}
          </motion.div>
        )}
      </AnimatePresence>

      {/* GRILLA DE ITEMS */}
      <section className={cn(
        "mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 p-4 md:p-8 max-w-[1600px]",
        className
      )}>
        {childrenWithProps}
      </section>

      {/* BOTÓN DE RETORNO: Aparece solo cuando la cabecera está oculta */}
      <AnimatePresence>
        {isDetailOpen && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={closeDetail}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-[#d8b4fe] text-[#581c87] px-8 py-3 rounded-full uppercase text-[10px] font-black tracking-[0.3em] shadow-2xl hover:bg-white transition-all active:scale-95"
          >
            "Restablecer Menú"
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export const GalleryItem = ({ src, alt, children, onClick, onExpand, color, contain }) => {
  const tieneImagen = src && src.trim() !== "";

  // Al hacer clic, ejecutamos la función del Lightbox y ocultamos la cabecera
  const handleAction = () => {
    if (onExpand) onExpand(); // Lógica de GalleryGrid para ocultar menú
    if (onClick) onClick();   // Lógica de Drawings para abrir imagen/canción
  };

  return (
    <motion.div 
      layout
      onClick={handleAction}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative aspect-[3/4] overflow-hidden rounded-[2rem] cursor-pointer bg-[#f3e8ff] shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl group"
    >
      {tieneImagen ? (
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
      ) : (
        /* DISEÑO MORADO PASTEL (LILA) */
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#f3e8ff]">
          <div className="relative mb-4 flex items-center justify-center">
            {/* Animación lila suave de fondo */}
            <div className="absolute w-20 h-20 rounded-full bg-[#d8b4fe] animate-pulse opacity-30" />
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center border border-[#d8b4fe] shadow-inner relative z-10">
              <Sparkles className="w-6 h-6 text-[#a855f7]" />
            </div>
          </div>
          <span className="text-[8px] font-black text-[#a855f7]/50 uppercase tracking-[0.4em]">
            "Pendiente"
          </span>
        </div>
      )}

      {/* Capa de degradado para legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#581c87]/50 via-transparent to-transparent opacity-40 group-hover:opacity-70 transition-opacity" />
      
      {/* Indicador de color opcional */}
      {color && <div className="absolute top-0 w-full h-1.5 opacity-50" style={{ backgroundColor: color }} />}

      {/* Contenido (Textos que vienen de Drawings) */}
      <div className="absolute bottom-6 left-6 right-6 translate-y-2 group-hover:translate-y-0 transition-all duration-500 z-20">
        {children}
      </div>
    </motion.div>
  );
};