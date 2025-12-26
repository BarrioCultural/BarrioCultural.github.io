"use client";
import React from 'react';

const ArchivoDisplay = ({ file, onClose }) => {
  if (!file) return null;

  const isError = file.isError;
  const colorClass = isError ? "text-terminal-red" : "text-terminal-green";
  
  // 🟢 AJUSTE: Añadida la clase 'animate-shake' si es error
  const borderClass = isError 
    ? "border-terminal-red shadow-[0_0_30px_rgba(255,0,0,0.4)] animate-shake" 
    : "border-terminal-green shadow-terminal";

  return (
    <div className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center p-4 md:p-8 font-mono z-[10000] animate-in fade-in duration-200">
      
      <div className={`bg-terminal-dark border-2 w-full max-w-2xl h-full max-h-[75vh] flex flex-col p-6 rounded-lg overflow-hidden transition-all duration-300 ${borderClass}`}>
        
        {/* Cabecera del visor */}
        <div className={`flex justify-between items-center mb-4 border-b pb-2 ${isError ? 'border-terminal-red/40' : 'border-terminal-green/40'}`}>
          <h2 className={`text-lg md:text-xl font-bold uppercase tracking-tighter ${colorClass}`}>
            {isError ? "!! ACCESO RESTRINGIDO !!" : `> ${file.nombre}`}
          </h2>
          <button 
            onClick={onClose} 
            className={`${colorClass} hover:scale-125 transition-transform cursor-pointer font-bold text-xl px-2`}
          >
            [X]
          </button>
        </div>

        {/* Banner de error dinámico */}
        {isError && (
          <div className="bg-terminal-red text-black p-1 mb-4 text-[10px] md:text-xs text-center font-bold uppercase tracking-[0.2em] animate-pulse">
            SISTEMA COMPROMETIDO - RASTREO EN CURSO
          </div>
        )}

        {/* Contenido del archivo */}
        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
          {/* 🟢 AJUSTE: 'px-1' para que el italic no se corte */}
          <pre className={`text-sm md:text-base whitespace-pre-wrap leading-relaxed italic px-1 ${colorClass}`}>
            {file.contenido}
          </pre>
        </div>

        {/* Pie del visor */}
        <div className={`mt-4 pt-2 border-t text-[9px] uppercase tracking-[0.2em] flex justify-between ${isError ? 'border-terminal-red/30 text-terminal-red' : 'border-terminal-green/30 text-terminal-green'}`}>
          <span>{isError ? "ERR_CODE: 0x000F4" : "STATUS: DECRYPTED"}</span>
          <span className={isError ? "animate-bounce" : "opacity-50"}>
            {isError ? "!!! S.O.S !!!" : "DATA_SECURE"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ArchivoDisplay;