"use client";

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
      document.body.style.overflow = "hidden"; // Bloquea scroll
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = ""; // Libera scroll
      };
    } else {
      setIsAnimating(false);
      document.body.style.overflow = "";
    }
  }, [selectedImg]);

  useEffect(() => {
    // 🛡️ PROTECCIÓN DE WINDOW: Solo se ejecuta en el cliente
    if (typeof window === "undefined") return;

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
      id="lightbox" // Mantener el ID por si el CSS lo usa
      className={`lightbox ${isAnimating ? 'active' : ''}`} 
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeLightbox();
        }
      }}
    >
      <img 
        id="lightbox-img" 
        src={selectedImg.src} 
        alt={selectedImg.alt} 
        onClick={(e) => e.stopPropagation()} 
      />
      <span className="close-btn" onClick={closeLightbox}>&times;</span>
    </div>
  );
};

export default Lightbox;