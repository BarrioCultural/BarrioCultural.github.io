"use client";

import React, { useState } from 'react';

const ShareButton = ({ url, titulo }) => {
  const [copiado, setCopiado] = useState(false);

  const handleShare = async () => {
    // Si el usuario está en un móvil, abre el menú nativo (WhatsApp, Instagram, etc.)
    if (navigator.share) {
      try {
        await navigator.share({
          title: titulo,
          text: `Mira este dibujo: ${titulo}`,
          url: window.location.origin + url, 
        });
      } catch (err) {
        console.log("Compartir cancelado");
      }
    } else {
      // Si está en PC, simplemente copia el link al portapapeles
      navigator.clipboard.writeText(window.location.origin + url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-5 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full transition-all group"
    >
      <span className="text-white text-sm font-bold uppercase tracking-widest">
        {copiado ? "¡Link Copiado!" : "Compartir"}
      </span>
      {!copiado && (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="white" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="group-hover:translate-x-1 transition-transform"
        >
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
      )}
    </button>
  );
};

export default ShareButton;