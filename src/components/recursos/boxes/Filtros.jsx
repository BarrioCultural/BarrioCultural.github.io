"use client";
import React from 'react';

export default function FiltrosMaestros({ 
  config, // Objeto con { nombreGrupo: opciones[] }
  filtrosActivos, // Objeto con { nombreGrupo: valorSeleccionado }
  onChange // Función (grupo, valor) => void
}) {
  return (
    <div className="max-w-5xl mx-auto mb-16 px-6 space-y-8">
      {Object.entries(config).map(([grupo, opciones]) => (
        <div key={grupo} className="flex flex-col items-center space-y-4">
          {/* Solo mostramos el nombre del grupo si hay más de uno */}
          {Object.keys(config).length > 1 && (
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 italic">
              {grupo}
            </span>
          )}
          
          <div className="flex flex-wrap justify-center gap-2">
            {opciones.map(opt => {
              const isActive = filtrosActivos[grupo] === opt;
              return (
                <button
                  key={opt}
                  onClick={() => onChange(grupo, opt)}
                  className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all border ${
                    isActive 
                    ? 'bg-primary text-white shadow-lg scale-105 border-primary' 
                    : 'bg-white/50 text-primary/60 border-transparent hover:border-primary/20'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}