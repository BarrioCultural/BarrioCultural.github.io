"use client";
import React, { useState } from 'react';
import ArchivoDisplay from '@/components/ArchivoDisplay';

const ARCHIVOS = [
  { id: 1, nombre: "PROYECTO_PK.log", desc: "Registro de la asesina principal", color: 'text-terminal-green' },
  { id: 2, nombre: "ACCESO_DORIAN.key", desc: "Notas del líder del PF", color: 'text-terminal-green' },
  { id: 3, nombre: "DATABASE_FAKER.dat", desc: "Registros de hackeo", color: 'text-terminal-red' },
  { id: 4, nombre: "ANALISIS_FRANI.txt", desc: "Informe del posible rebelde", color: 'text-terminal-green' }
];

const TerminalSimple = () => {
  const [currentFile, setCurrentFile] = useState(null);

  // Contenido simulado para cada archivo
  const obtenerContenido = (nombre) => {
    const contenidos = {
      "PROYECTO_PK.log": "ERROR 404: Datos no encontrados.",
      "ACCESO_DORIAN.key": "Ultimo registro: Dorian ha tomado el control del trafico en la zona norte",
      "DATABASE_FAKER.dat": "ACCESO DENEGADO. Intento de rastreo detectado. IP del usuario enviada al cuartel de  seguridad.",
      "ANALISIS_FRANI.txt": "Frani podria sernos util... Hay que vigilarlo mas de cerca"
    };
    return contenidos[nombre] || "Archivo vacío.";
  };

  return (
    <div className="scanlines bg-terminal-dark border-2 border-terminal-green shadow-terminal p-6 rounded-lg font-mono w-full max-w-2xl mx-auto">
      <header className="mb-6 border-b border-terminal-green/30 pb-4">
        <h2 className="text-terminal-green uppercase tracking-[0.2em] text-sm md:text-base">
          Archivos del Partido por el Progreso
        </h2>
        <p className="text-terminal-gray text-[10px] mt-1 italic">Haga clic en un archivo para visualizar</p>
      </header>

      <ul className="space-y-4">
        {ARCHIVOS.map((archivo) => (
          <li 
            key={archivo.id}
            onClick={() => setCurrentFile({ nombre: archivo.nombre, contenido: obtenerContenido(archivo.nombre) })}
            className="group flex items-center justify-between cursor-pointer border border-transparent hover:border-terminal-green/40 p-3 transition-all rounded"
          >
            <div className="flex items-center gap-3">
              <span className="text-terminal-green opacity-50">{'>'}</span>
              <div>
                <p className={`${archivo.color} font-bold text-sm md:text-base`}>
                  {archivo.nombre}
                </p>
                <p className="text-terminal-gray text-[10px] uppercase">
                  {archivo.desc}
                </p>
              </div>
            </div>
            <span className="text-terminal-green text-xs opacity-0 group-hover:opacity-100 transition-opacity">
              [ABRIR]
            </span>
          </li>
        ))}
      </ul>

      {/* Visor de archivos */}
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