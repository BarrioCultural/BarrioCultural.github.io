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
      {/* 🟢 IMPORTANTE: El componente visual DEBE estar aquí para que aparezca en toda la web */}
      <LightboxVisual />
    </LightboxContext.Provider>
  );
};

export const useLightbox = () => useContext(LightboxContext);

// Cambiamos el nombre a LightboxVisual para no confundir
const LightboxVisual = () => {
  const { selectedImg, closeLightbox } = useLightbox();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (selectedImg) {
      const timer = setTimeout(() => setIsAnimating(true), 10);
      document.body.style.overflow = "hidden";
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "";
      };
    } else {
      setIsAnimating(false);
      document.body.style.overflow = "";
    }
  }, [selectedImg]);

  if (!selectedImg) return null;

  return (
    <div 
      className={`lightbox ${isAnimating ? 'active' : ''}`} 
      onClick={closeLightbox}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.9)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'zoom-out',
        opacity: isAnimating ? 1 : 0,
        transition: 'opacity 0.3s ease'
      }}
    >
      <img 
        src={selectedImg.src} 
        alt={selectedImg.alt} 
        style={{ 
          maxHeight: '90vh', 
          maxWidth: '90vw', 
          objectFit: 'contain',
          transform: isAnimating ? 'scale(1)' : 'scale(0.9)',
          transition: 'transform 0.3s ease'
        }}
        onClick={(e) => e.stopPropagation()} 
      />
      <span 
        style={{ position: 'absolute', top: '20px', right: '30px', color: 'white', fontSize: '40px', cursor: 'pointer' }}
        onClick={closeLightbox}
      >
        &times;
      </span>
    </div>
  );
};