"use client";
import React, { createContext, useState, useContext, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

// --- 1. CONTEXTO DEL LIGHTBOX ---
const LightboxContext = createContext();

export const useLightbox = () => {
  const context = useContext(LightboxContext);
  if (!context) throw new Error("useLightbox debe usarse dentro de LightboxProvider");
  return context;
};

// --- 2. COMPONENTE: BOTÓN COMPARTIR ---
const ShareButton = ({ url, titulo }) => {
  const [copiado, setCopiado] = useState(false);
  
  const handleShare = async (e) => {
    e.stopPropagation(); 
    const fullUrl = window.location.origin + url;
    if (navigator.share) {
      try { await navigator.share({ title: titulo || "Mi Dibujo", url: fullUrl }); } catch (err) {}
    } else {
      navigator.clipboard.writeText(fullUrl);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  return (
    <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full transition-all active:scale-95">
      <span className="text-white text-[10px] font-bold uppercase tracking-[0.2em]">
        {copiado ? "¡Copiado!" : "Compartir"}
      </span>
    </button>
  );
};

// --- 3. VISUALIZADOR PRINCIPAL (LAYOUT MEJORADO SIN COMENTARIOS) ---
const LightboxVisual = () => {
  const { selectedImg, gallery, currentIndex, setCurrentIndex, closeLightbox } = useLightbox();

  if (!selectedImg) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-black selection:bg-white selection:text-black overflow-y-auto no-scrollbar">
      
      <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl -z-10" />

      {/* Header */}
      <div className="sticky top-0 w-full p-5 md:p-8 flex justify-between items-center z-[110] bg-black/60 backdrop-blur-xl border-b border-white/5">
        <div className="flex flex-col">
          <h2 className="text-white text-[10px] font-black uppercase tracking-[0.4em] truncate max-w-[140px] md:max-w-md">
            {selectedImg.alt || "Galería"}
          </h2>
          <span className="text-white/20 text-[9px] font-mono mt-1 uppercase tracking-widest">
            {currentIndex + 1} de {gallery.length}
          </span>
        </div>
        <div className="flex items-center gap-4 md:gap-8">
          <ShareButton url={selectedImg.src} titulo={selectedImg.alt} />
          <button onClick={closeLightbox} className="text-white/30 hover:text-white text-5xl font-thin transition-all">&times;</button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row w-full max-w-[2000px] mx-auto flex-1">
        
        {/* LADO IZQUIERDO: Arte + Miniaturas Móvil */}
        <div className="flex-1 flex flex-col items-center w-full lg:border-r lg:border-white/5">
          
          <div className="relative flex items-center justify-center w-full min-h-[50vh] md:min-h-[85vh] px-4 md:px-14 py-6 md:py-10">
            <button 
              className="absolute left-2 md:left-6 z-[105] text-white/10 hover:text-white text-6xl md:text-9xl p-2 transition-all active:scale-90"
              onClick={() => setCurrentIndex((currentIndex - 1 + gallery.length) % gallery.length)}
            >‹</button>

            <img 
              key={selectedImg.src}
              src={selectedImg.src} 
              alt={selectedImg.alt} 
              className="relative max-h-[70vh] md:max-h-[80vh] max-w-full object-contain shadow-2xl rounded-sm animate-in zoom-in-95 duration-700"
            />

            <button 
              className="absolute right-2 md:right-6 z-[105] text-white/10 hover:text-white text-6xl md:text-9xl p-2 transition-all active:scale-90"
              onClick={() => setCurrentIndex((currentIndex + 1) % gallery.length)}
            >›</button>
          </div>

          {/* Miniaturas Móvil */}
          <div className="lg:hidden w-full px-6 mb-12">
            <div className="flex gap-4 overflow-x-auto no-scrollbar py-6 border-y border-white/5 bg-white/[0.01] rounded-2xl px-5">
              {gallery.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative h-24 w-24 min-w-[96px] rounded-xl overflow-hidden transition-all duration-500 ${
                    idx === currentIndex ? 'ring-2 ring-white scale-105 opacity-100 shadow-2xl' : 'opacity-20 grayscale'
                  }`}
                >
                  <img src={img.src} className="h-full w-full object-cover" alt="thumb" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* LADO DERECHO (Desktop) */}
        <div className="hidden lg:flex flex-col items-center gap-5 p-6 bg-white/[0.01] sticky top-[96px] h-[calc(100vh-96px)] overflow-y-auto no-scrollbar w-[120px]">
          {gallery.map((img, idx) => (
            <button 
              key={idx} 
              onClick={() => setCurrentIndex(idx)}
              className={`relative h-24 w-24 min-h-[96px] rounded-2xl overflow-hidden transition-all duration-500 ${
                idx === currentIndex ? 'ring-2 ring-white scale-110 opacity-100 shadow-2xl z-10' : 'opacity-10 grayscale hover:opacity-100'
              }`}
            >
              <img src={img.src} className="h-full w-full object-cover" alt="thumb" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- 4. PROVIDER ---
export const LightboxProvider = ({ children }) => {
  const [gallery, setGallery] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const openLightbox = useCallback((index, images) => {
    setGallery(images);
    setCurrentIndex(index);
    if (typeof window !== 'undefined') document.body.style.overflow = 'hidden';
  }, []);

  const closeLightbox = useCallback(() => {
    setCurrentIndex(-1);
    setGallery([]);
    if (typeof window !== 'undefined') document.body.style.overflow = 'auto';
  }, []);

  return (
    <LightboxContext.Provider value={{ selectedImg: gallery[currentIndex], gallery, currentIndex, setCurrentIndex, openLightbox, closeLightbox }}>
      {children}
      <LightboxVisual />
    </LightboxContext.Provider>
  );
};