"use client";
import React, { createContext, useState, useContext, useCallback } from 'react';
import { Share2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from "@/lib/utils";

// --- 1. CONTEXTO DEL LIGHTBOX ---
const LightboxContext = createContext();

export const useLightbox = () => {
  const context = useContext(LightboxContext);
  if (!context) throw new Error("useLightbox debe usarse dentro de LightboxProvider");
  return context;
};

// --- 2. COMPONENTE: BOTÓN COMPARTIR (Optimizado) ---
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
    <button 
      onClick={handleShare} 
      className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full transition-all active:scale-95 group"
    >
      <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">
        {copiado ? "¡Enlace Copiado!" : "Compartir"}
      </span>
      <Share2 size={12} className="text-white opacity-50 group-hover:opacity-100" />
    </button>
  );
};

// --- 3. VISUALIZADOR PRINCIPAL ---
const LightboxVisual = () => {
  const { selectedImg, gallery, currentIndex, setCurrentIndex, closeLightbox } = useLightbox();

  if (!selectedImg) return null;

  // Clase común para las miniaturas
  const thumbClass = (idx) => cn(
    "relative rounded-xl overflow-hidden transition-all duration-500",
    idx === currentIndex 
      ? 'ring-2 ring-white scale-105 opacity-100 shadow-2xl z-10' 
      : 'opacity-20 grayscale hover:opacity-80 hover:grayscale-0'
  );

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-black selection:bg-white selection:text-black overflow-y-auto no-scrollbar">
      
      {/* Fondo con desenfoque extremo */}
      <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl -z-10" />

      {/* HEADER UNIFICADO */}
      <header className="sticky top-0 w-full p-6 md:px-10 flex justify-between items-center z-[110] bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="flex flex-col">
          <h2 className="text-white text-[10px] font-black uppercase tracking-[0.4em] truncate max-w-[140px] md:max-w-md">
            {selectedImg.alt || "Archivo Visual"}
          </h2>
          <span className="text-white/30 text-[9px] font-mono mt-1 uppercase tracking-widest">
            Expediente {currentIndex + 1} de {gallery.length}
          </span>
        </div>
        
        <div className="flex items-center gap-4 md:gap-8">
          <ShareButton url={selectedImg.src} titulo={selectedImg.alt} />
          <button 
            onClick={closeLightbox} 
            className="text-white/40 hover:text-white transition-all hover:rotate-90 duration-300"
          >
            <X size={32} strokeWidth={1} />
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row w-full max-w-[2000px] mx-auto flex-1">
        
        {/* ÁREA DE VISUALIZACIÓN */}
        <div className="flex-1 flex flex-col items-center w-full lg:border-r lg:border-white/5">
          
          <div className="relative flex items-center justify-center w-full min-h-[55vh] md:min-h-[85vh] px-4 md:px-16 py-6">
            
            {/* Navegación Izquierda */}
            <button 
              className="absolute left-4 md:left-8 z-[105] text-white/20 hover:text-white transition-all active:scale-75 hidden md:block"
              onClick={() => setCurrentIndex((currentIndex - 1 + gallery.length) % gallery.length)}
            >
              <ChevronLeft size={80} strokeWidth={1} />
            </button>

            <img 
              key={selectedImg.src}
              src={selectedImg.src} 
              alt={selectedImg.alt} 
              className="relative max-h-[75vh] md:max-h-[80vh] max-w-full object-contain shadow-[0_0_100px_rgba(0,0,0,0.5)] rounded-sm animate-in zoom-in-95 duration-500 ease-out"
            />

            {/* Navegación Derecha */}
            <button 
              className="absolute right-4 md:right-8 z-[105] text-white/20 hover:text-white transition-all active:scale-75 hidden md:block"
              onClick={() => setCurrentIndex((currentIndex + 1) % gallery.length)}
            >
              <ChevronRight size={80} strokeWidth={1} />
            </button>
          </div>

          {/* Miniaturas Móvil (Scroll Horizontal) */}
          <div className="lg:hidden w-full px-6 mb-12">
            <div className="flex gap-4 overflow-x-auto no-scrollbar py-6 border-t border-white/5">
              {gallery.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setCurrentIndex(idx)}
                  className={cn("h-20 w-20 min-w-[80px]", thumbClass(idx))}
                >
                  <img src={img.src} className="h-full w-full object-cover" alt="thumb" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* BARRA LATERAL MINIATURAS (Desktop) */}
        <aside className="hidden lg:flex flex-col items-center gap-5 p-6 bg-white/[0.02] sticky top-[96px] h-[calc(100vh-96px)] overflow-y-auto no-scrollbar w-[140px]">
          {gallery.map((img, idx) => (
            <button 
              key={idx} 
              onClick={() => setCurrentIndex(idx)}
              className={cn("h-24 w-24 min-h-[96px]", thumbClass(idx))}
            >
              <img src={img.src} className="h-full w-full object-cover" alt="thumb" />
            </button>
          ))}
        </aside>
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