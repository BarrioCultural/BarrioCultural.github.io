"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import { Sparkles } from 'lucide-react'; 

/* ─────────────────────────────
   GALLERY GRID
───────────────────────────── */

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
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.4, ease: "circOut" }}
            className="overflow-hidden"
          >
            {headerContent}
          </motion.div>
        )}
      </AnimatePresence>

      <section
        className={cn(
          "mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 p-4 md:p-8 max-w-[1600px]",
          className
        )}
      >
        {childrenWithProps}
      </section>

      {isDetailOpen && (
        <motion.button 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setIsDetailOpen(false)}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] bg-primary text-bg-main px-8 py-3 rounded-full uppercase text-[10px] font-black tracking-widest shadow-2xl hover:scale-105 transition-transform"
        >
          Mostrar Filtros
        </motion.button>
      )}
    </div>
  );
};

/* ─────────────────────────────
   GALLERY ITEM (FIX REAL)
───────────────────────────── */

export const GalleryItem = ({
  src,
  alt,
  children,
  onClick,
  onExpand,
  color,
  contain
}) => {

  const esUrlValida =
    src &&
    typeof src === 'string' &&
    src.trim() !== "" &&
    !src.includes('undefined') &&
    (src.startsWith('http') || src.startsWith('/'));

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
        "relative aspect-[3/4] overflow-hidden rounded-[2.2rem] cursor-pointer transition-all duration-700 hover:-translate-y-2 hover:shadow-xl group will-change-transform",
        esUrlValida ? "bg-black" : "bg-[#f0edf5]"
      )}
    >
      {esUrlValida ? (
        <>
          <Image
            src={src}
            alt={alt || "Evento"}
            fill
            unoptimized={true}
            sizes="(max-width: 768px) 50vw, 20vw"
            className={cn(
              "transition-all duration-700 group-hover:scale-110 will-change-transform",
              contain
                ? "object-contain p-8"
                : "object-cover opacity-80 group-hover:opacity-100"
            )}
          />

          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <Sparkles className="w-8 h-8 text-primary/30 mb-2 animate-pulse" />
          <p className="text-[7px] font-black text-primary/40 uppercase tracking-[0.4em]">
            Sin Imagen
          </p>
        </div>
      )}

      <div
        className={cn(
          "absolute bottom-6 left-6 right-6 z-30 transition-transform duration-500 group-hover:-translate-y-1",
          esUrlValida ? "text-white" : "text-bg-main"
        )}
      >
        {children}
      </div>

      {color && (
        <div
          className="absolute top-0 w-full h-1.5"
          style={{ backgroundColor: color }}
        />
      )}
    </motion.div>
  );
};
