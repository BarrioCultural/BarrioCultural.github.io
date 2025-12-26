"use client";
import React, { useState } from 'react';
import ArchivoDisplay from '@/components/ArchivoDisplay';

const ARCHIVOS = [
  { id: 1, nombre: "PROYECTO_PK.log", desc: "Registro de la asesina principal", color: 'text-terminal-green' },
  { id: 2, nombre: "ACCESO_DORIAN.key", desc: "Notas del líder del PF", color: 'text-terminal-green' },
  { id: 3, nombre: "DATABASE_FAKER.dat", desc: "Registros de hackeo", color: 'text-terminal-red' },
  { id: 4, nombre: "ANALISIS_FRANI.txt", desc: "Informe del posible rebelde", color: 'text-terminal-green' }, // Se añadió coma aquí
  { id: 5, nombre: "EXPERIMENTO_QUIMERA.cfg", desc: "Resultados", color: 'text-terminal-red' }
];

const TerminalSimple = () => {
  const [currentFile, setCurrentFile] = useState(null);

  const obtenerContenido = (nombre) => {
    const contenidos = {
      "PROYECTO_PK.log": "ERROR 404: Datos corruptos. El rastro de la asesina ha sido borrado por un protocolo externo.",
      "ACCESO_DORIAN.key": "Último registro: Dorian ha tomado el control del tráfico en la zona norte. Priorizar recuperacion de la droga del abismo lo antes posible.",
      "DATABASE_FAKER.dat": "ACCESO DENEGADO. Intento de rastreo detectado. Su dirección IP ha sido enviada al cuartel de seguridad central.",
      "ANALISIS_FRANI.txt": "Sujeto: Frani. Observación: Podría sernos útil... Hay que vigilarlo más de cerca.",
      "EXPERIMENTO_QUIMERA.cfg": "PROYECTO QUIMERA: Experimento exitoso. Capacidad de adaptación biológica confirmada. El espécimen escapó de las instalaciones durante el apagón. Proceder con protocolo de eliminación o reinicio inmediato."
    };
    return contenidos[nombre] || "Archivo vacío.";
  };

  return (
    <div className="scanlines bg-terminal-dark border-2 border-terminal-green shadow-terminal p-6 rounded-lg font-mono w-full max-w-2xl mx-auto overflow-hidden relative">
      
      {/* Resplandor decorativo de esquina */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-terminal-green/5 blur-3xl pointer-events-none"></div>

      <header className="mb-6 border-b border-terminal-green/30 pb-4 relative z-10">
        <h2 className="text-terminal-green uppercase tracking-[0.2em] text-sm md:text-base animate-pulse">
          Archivos del Partido por el Progreso
        </h2>
        <div className="flex justify-between items-center mt-1">
          <p className="text-terminal-gray text-[10px] italic">Seleccione una entrada para desencriptar</p>
          <span className="text-terminal-gray text-[10px] opacity-50">v2.0.25</span>
        </div>
      </header>

      <ul className="space-y-4 relative z-10">
        {ARCHIVOS.map((archivo) => (
          <li 
            key={archivo.id}
            onClick={() => setCurrentFile({ nombre: archivo.nombre, contenido: obtenerContenido(archivo.nombre) })}
            className="group flex items-center justify-between cursor-pointer border border-transparent hover:border-terminal-green/20 hover:bg-terminal-green/5 p-3 transition-all duration-200 rounded"
          >
            <div className="flex items-center gap-3">
              <span className="text-terminal-green group-hover:translate-x-1 transition-transform">
                {'>'}
              </span>
              <div>
                <p className={`${archivo.color} font-bold text-sm md:text-base tracking-tight`}>
                  {archivo.nombre}
                </p>
                <p className="text-terminal-gray text-[9px] md:text-[10px] uppercase tracking-widest mt-0.5">
                  {archivo.desc}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-terminal-green/40 font-bold hidden md:inline group-hover:inline">
                STATUS: OK
              </span>
              <span className="text-terminal-green text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                [ABRIR]
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/* Footer de la terminal */}
      <div className="mt-8 pt-4 border-t border-terminal-green/10 flex justify-between items-center text-terminal-gray text-[9px] uppercase tracking-widest">
        <span>Conexión Segura</span>
        <span className="animate-pulse">● Recibiendo datos...</span>
      </div>

      {currentFile && (
        <ArchivoDisplay 
          file={currentFile} 
          onClose={() => setCurrentFile(null)} 
        />
      )}
    </div>
  );
};

export default TerminalSimple;