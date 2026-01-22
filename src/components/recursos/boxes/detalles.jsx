"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Music } from 'lucide-react';

export default function DetalleMaestro({ 
  isOpen, 
  onClose, 
  data, 
  tags = [], 
  mostrarMusica = false 
}) {
  if (!data) return null;

  const imagen = data.img_url || data.imagen_url;
  const nombre = data.nombre;
  const descripcion = data.sobre || data.descripcion;

  return (
    <AnimatePresence mode="popLayout">
      {isOpen && (
        <motion.div 
          key={data.id}
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="max-w-7xl mx-auto mb-16 relative pt-10 px-4"
        >
          <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[500px]">
            {/* Botón Cerrar */}
            <button 
              onClick={onClose} 
              className="absolute top-14 right-8 lg:top-10 lg:right-10 p-3 bg-bg-main text-primary rounded-full hover:bg-primary hover:text-white transition-all z-50 shadow-md"
            >
              <X size={20} />
            </button>
            
            {/* Contenedor Imagen */}
            <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6 lg:p-12 border-b lg:border-b-0 lg:border-r border-primary/5">
              <img 
                src={imagen} 
                alt={nombre} 
                className="max-h-[400px] lg:max-h-[500px] w-full object-contain mix-blend-multiply transition-transform duration-700 hover:scale-105" 
              />
            </div>

            {/* Contenedor Texto - Ajustado para que no se corte */}
            <div className="w-full lg:w-1/2 p-6 md:p-10 lg:pl-12 lg:pr-16 flex flex-col justify-center bg-bg-main/5">
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag, i) => tag && (
                  <span key={i} className="px-3 py-1 bg-primary text-white text-[10px] font-black uppercase rounded-lg tracking-widest">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Título: Reducido de 5xl/7xl a 4xl/6xl y añadido break-words */}
              <h2 className="text-4xl md:text-6xl font-black uppercase italic text-primary leading-[0.85] tracking-tighter mb-6 break-words">
                {nombre}
              </h2>
              
              {/* Descripción: Sin la barra lateral para ganar espacio y alineado a la izquierda */}
              <p className="text-primary/80 text-base md:text-lg italic leading-tight mb-8">
                {descripcion}
              </p>

              {/* Sección de Música */}
              {mostrarMusica && (data.cancion_nombre || data.cancion_url) && (
                <div className="bg-bg-main/20 p-5 rounded-[2rem] border border-primary/10">
                  <div className="flex items-center gap-3 mb-3 text-primary">
                    <Music size={16} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Tema Musical</span>
                  </div>
                  <h4 className="text-lg font-black text-primary uppercase italic mb-3">
                    {data.cancion_nombre}
                  </h4>
                  {data.cancion_url && (
                    <audio key={data.cancion_url} controls className="w-full h-8 mix-blend-multiply opacity-80">
                      <source src={data.cancion_url} type="audio/mpeg" />
                    </audio>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}