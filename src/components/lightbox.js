"use client";
import React, { createContext, useState, useContext, useCallback } from 'react';

const LightboxContext = createContext();

export const LightboxProvider = ({ children }) => {
  const [gallery, setGallery] = useState([]); // Guardamos todas las fotos
  const [currentIndex, setCurrentIndex] = useState(-1); // Índice de la foto abierta

  // Función para abrir una foto específica dentro de una lista
  const openLightbox = useCallback((index, images) => {
    setGallery(images);
    setCurrentIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setCurrentIndex(-1);
    setGallery([]);
  }, []);

  return (
    <LightboxContext.Provider value={{ 
      selectedImg: gallery[currentIndex], 
      gallery, 
      currentIndex,
      setCurrentIndex, 
      openLightbox, 
      closeLightbox 
    }}>
      {children}
      <LightboxVisual />
    </LightboxContext.Provider>
  );
};

export const useLightbox = () => useContext(LightboxContext);

const LightboxVisual = () => {
  const { selectedImg, gallery, currentIndex, setCurrentIndex, closeLightbox } = useLightbox();

  if (!selectedImg) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/95 p-4">
      {/* Botón Cerrar */}
      <button onClick={closeLightbox} className="absolute top-5 right-5 text-white text-4xl">&times;</button>

      {/* Imagen Principal */}
      <div className="relative flex items-center justify-center w-full max-h-[70vh]">
        <button 
          className="absolute left-4 text-white text-5xl p-4 hover:bg-white/10 rounded-full"
          onClick={() => setCurrentIndex((currentIndex - 1 + gallery.length) % gallery.length)}
        >
          ‹
        </button>
        
        <img 
          src={selectedImg.src} 
          alt={selectedImg.alt} 
          className="max-h-[70vh] max-w-[85vw] object-contain shadow-2xl"
        />

        <button 
          className="absolute right-4 text-white text-5xl p-4 hover:bg-white/10 rounded-full"
          onClick={() => setCurrentIndex((currentIndex + 1) % gallery.length)}
        >
          ›
        </button>
      </div>

      {/* 🖼️ LA BARRA DE MINIATURAS (Lo que buscabas) */}
      <div className="mt-8 flex gap-2 overflow-x-auto p-2 max-w-full no-scrollbar">
        {gallery.map((img, idx) => (
          <img
            key={idx}
            src={img.src}
            className={`h-16 w-16 min-w-[64px] object-cover cursor-pointer rounded transition-all ${
              idx === currentIndex ? 'border-2 border-accent scale-110 opacity-100' : 'opacity-40 grayscale hover:grayscale-0'
            }`}
            onClick={() => setCurrentIndex(idx)}
          />
        ))}
      </div>
    </div>
  );
};