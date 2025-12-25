"use client"; // <--- ESTA ES LA LÍNEA QUE DEBES AGREGAR

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const LightboxContext = createContext();

export const LightboxProvider = ({ children }) => {
  const [selectedImg, setSelectedImg] = useState(null);
  
  const openLightbox = useCallback((img) => setSelectedImg(img), []);
  const closeLightbox = useCallback(() => setSelectedImg(null), []);

  return (
    <LightboxContext.Provider value={{ selectedImg, openLightbox, closeLightbox }}>
      {children}
    </LightboxContext.Provider>
  );
};

export const useLightbox = () => useContext(LightboxContext);

const Lightbox = () => {
  const { selectedImg, closeLightbox } = useLightbox();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (selectedImg) {
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
    }
  }, [selectedImg]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeLightbox();
    };
    if (selectedImg) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [selectedImg, closeLightbox]);

  if (!selectedImg) return null;

  return (
    <div 
      className={`lightbox ${isAnimating ? 'active' : ''}`} 
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeLightbox();
        }
      }}
    >
      {/* 1. Quitamos el div 'lightbox-content' para que el flexbox centre la imagen directo */}
      <img 
        id="lightbox-img" 
        src={selectedImg.src} 
        alt={selectedImg.alt} 
        onClick={(e) => e.stopPropagation()} 
      />
      
      {/* 2. La X ahora es hija directa del fondo para que no mueva la foto */}
      <span className="close-btn" onClick={closeLightbox}>&times;</span>
    </div>
  );
};

export default Lightbox;