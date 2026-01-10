"use client";
import React, { createContext, useState, useContext, useCallback } from 'react';

// --- COMPONENTE: BOTÓN COMPARTIR ---
const ShareButton = ({ url, titulo }) => {
  const [copiado, setCopiado] = useState(false);

  const handleShare = async (e) => {
    e.stopPropagation(); 
    const fullUrl = window.location.origin + url;

    if (navigator.share) {
      try {
        await navigator.share({
          title: titulo || "Mi Dibujo",
          text: `Mira este dibujo: ${titulo}`,
          url: fullUrl,
        });
      } catch (err) { 
        console.log("Compartir cancelado"); 
      }
    } else {
      navigator.clipboard.writeText(fullUrl);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full transition-all active:scale-95"
    >
      <span className="text-white text-[10px] font-bold uppercase tracking-[0.2em]">
        {copiado ? "¡Copiado!" : "Compartir"}
      </span>
      {!copiado && (
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
      )}
    </button>
  );
};

// --- CONTEXTO ---
const LightboxContext = createContext();

export const LightboxProvider = ({ children }) => {
  const [gallery, setGallery] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

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

// --- VISUALIZADOR PRINCIPAL ---
const LightboxVisual = () => {
  const { selectedImg, gallery, currentIndex, setCurrentIndex, closeLightbox } = useLightbox();

  if (!selectedImg) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/95 p-4 backdrop-blur-md">
      
      {/* 🟢 BARRA SUPERIOR (Info a la izquierda, Botones a la derecha) */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex flex-col gap-1">
          <h2 className="text-white text-xs font-bold uppercase tracking-widest truncate max-w-[200px] md:max-w-none">
            {selectedImg.alt || "Sin título"}
          </h2>
          <span className="text-white/40 text-[10px] font-mono">
            {currentIndex + 1} / {gallery.length}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <ShareButton url={selectedImg.src} titulo={selectedImg.alt} />
          <button 
            onClick={closeLightbox} 
            className="text-white/40 hover:text-white text-4xl font-light leading-none transition-colors pb-1"
          >
            &times;
          </button>
        </div>
      </div>

      {/* ÁREA CENTRAL: Imagen y Flechas */}
      <div className="relative flex items-center justify-center w-full max-w-5xl h-full py-20">
        
        {/* Flecha Izquierda */}
        <button 
          className="absolute left-0 md:left-4 z-10 text-white/20 hover:text-white text-6xl p-4 transition-all"
          onClick={() => setCurrentIndex((currentIndex - 1 + gallery.length) % gallery.length)}
        >
          ‹
        </button>
        
        <img 
          src={selectedImg.src} 
          alt={selectedImg.alt} 
          className="max-h-[70vh] max-w-[85vw] object-contain shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-sm select-none"
        />

        {/* Flecha Derecha */}
        <button 
          className="absolute right-0 md:right-4 z-10 text-white/20 hover:text-white text-6xl p-4 transition-all"
          onClick={() => setCurrentIndex((currentIndex + 1) % gallery.length)}
        >
          ›
        </button>
      </div>

      {/* MINIATURAS (Abajo del todo, sin estorbos) */}
      <div className="absolute bottom-8 flex gap-3 overflow-x-auto p-2 max-w-[90vw] no-scrollbar">
        {gallery.map((img, idx) => (
          <div 
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-14 w-14 min-w-[56px] cursor-pointer rounded-md overflow-hidden transition-all duration-300 ${
              idx === currentIndex 
              ? 'ring-2 ring-white scale-110 opacity-100 shadow-xl' 
              : 'opacity-30 grayscale hover:opacity-100 hover:grayscale-0'
            }`}
          >
            <img src={img.src} className="h-full w-full object-cover" alt="thumbnail" />
          </div>
        ))}
      </div>
    </div>
  );
};

