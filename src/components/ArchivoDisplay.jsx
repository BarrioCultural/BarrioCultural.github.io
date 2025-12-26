"use client";
import React from 'react';

const ArchivoDisplay = ({ file, onClose }) => {
  if (!file) return null;

  // Si es error, usamos rojo. Si no, verde.
  const isError = file.isError;
  const colorClass = isError ? "text-terminal-red" : "text-terminal-green";
  const borderClass = isError ? "border-terminal-red shadow-[0_0_20px_rgba(255,0,0,0.3)]" : "border-terminal-green shadow-terminal";

  return (
    <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center p-4 md:p-8 font-mono z-[10000] animate-in fade-in duration-200">
      <div className={`bg-terminal-dark border-2 w-full max-w-2xl h-full max-h-[75vh] flex flex-col p-6 rounded-lg overflow-hidden transition-colors duration-500 ${borderClass}`}>
        
        {/* Cabecera del visor */}
        <div className={`flex justify-between items-center mb-4 border-b pb-2 ${isError ? 'border-terminal-red/40' : 'border-terminal-green/40'}`}>
          <h2 className={`text-lg md:text-xl font-bold uppercase tracking-tighter ${colorClass}`}>
            {isError ? "[ ADVERTENCIA: ACCESO RESTRINGIDO ]" : `> ${file.nombre}`}
          </h2>
          <button 
            onClick={onClose} 
            className={`${colorClass} hover:scale-110 transition-transform cursor-pointer font-bold text-sm`}
          >
            [CERRAR]
          </button>
        </div>

        {/* Banner de error dinámico */}
        {isError && (
          <div className="bg-terminal-red/10 border border-terminal-red/50 p-2 mb-4 text-[10px] md:text-xs text-center animate-pulse text-terminal-red font-bold uppercase tracking-widest">
            ¡ALERTA! INTENTO DE INTRUSIÓN DETECTADO EN EL ARCHIVO: {file.nombre}
          </div>
        )}

        {/* Contenido del archivo */}
        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
          <pre className={`text-sm md:text-base whitespace-pre-wrap leading-relaxed italic ${colorClass}`}>
            {file.contenido}
          </pre>
        </div>

        {/* Pie del visor */}
        <div className={`mt-4 pt-2 border-t text-[9px] uppercase tracking-[0.2em] opacity-50 ${isError ? 'border-terminal-red/20 text-terminal-red' : 'border-terminal-green/20 text-terminal-green'}`}>
          {isError ? "Código de error: 0x000F4 - Protocolo de seguridad activo" : "Archivo decodificado correctamente"}
        </div>
      </div>
    </div>
  );
};

export default ArchivoDisplay;