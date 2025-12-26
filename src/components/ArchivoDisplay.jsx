// src/components/ArchivoDisplay.jsx
"use client";
import React from 'react';

const ArchivoDisplay = ({ file, onClose }) => {
  return (
    <div className="fixed inset-0 bg-terminal-dark/95 flex flex-col items-center justify-center p-8 font-mono text-terminal-green z-[10000] animate-in fade-in duration-300">
      <div className="bg-terminal-dark border-2 border-terminal-green w-full max-w-2xl h-full max-h-[80vh] flex flex-col p-6 rounded-lg shadow-terminal overflow-hidden">
        <div className="flex justify-between items-center mb-4 border-b border-terminal-green/30 pb-2">
          <h2 className="text-xl font-bold uppercase tracking-tighter">
            {'>'} {file.nombre}
          </h2>
          <button onClick={onClose} className="hover:text-terminal-red text-2xl transition-colors cursor-pointer">
            [X]
          </button>
        </div>
        <pre className="flex-grow overflow-y-auto text-sm md:text-base whitespace-pre-wrap leading-relaxed pr-2 custom-scrollbar">
          {file.contenido}
        </pre>
        <div className="mt-4 text-[10px] text-terminal-gray uppercase">
          Fin del archivo - Presione ESC o [X] para cerrar
        </div>
      </div>
    </div>
  );
};

export default ArchivoDisplay;