"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Music } from 'lucide-react';

export default function DetalleMaestro({ 
  isOpen, 
  onClose, 
  data, 
  tags = [], 
  mostrarMusica = true 
}) {
  if (!data) return null;

  const imagen = data.img_url || data.imagen_url;
  const nombre = data.nombre;
  const descripcion = data.sobre || data.descripcion;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -20 }}
          className="max-w-7xl mx-auto mb-16 relative pt-4 px-4"
        >
          <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[500px]">
            {/* Botón Cerrar */}
            <button 
              onClick={onClose} 
              className="absolute top-10 right-10 p-3 bg-bg-main text-primary rounded-full hover:bg-primary hover:text-white transition-all z-50 shadow-md"
            >
              <X size={20} />
            </button>
            
            {/* CONTENEDOR DE IMAGEN ESTÉTICO */}
            <div className="w-full lg:w-1/2 bg-gradient-to-br from-white to-primary/5 flex items-center justify-center p-10 lg:p-16 border-b lg:border-b-0 lg:border-r border-primary/5">
              <div className="relative w-full aspect-square max-w-[400px]">
                {/* Decoración de fondo para la imagen */}
                <div className="absolute inset-0 bg-primary/5 rounded-[4rem] rotate-3 scale-105" />
                
                {/* Imagen con bordes ultra redondeados */}
                <img 
                  src={imagen} 
                  alt={nombre} 
                  className="relative z-10 w-full h-full object-contain mix-blend-multiply rounded-[3.5rem] transform transition-transform duration-500 hover:scale-105" 
                />
              </div>
            </div>

            {/* CONTENEDOR DE TEXTO */}
            <div className="w-full lg:w-1/2 p-8 md:p-12 lg:pl-10 lg:pr-16 flex flex-col justify-center bg-bg-main/5">
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag, i) => tag && (
                  <span key={i} className="px-3 py-1 bg-primary text-white text-[10px] font-black uppercase rounded-lg tracking-widest">
                    {tag}
                  </span>
                ))}
              </div>

              <h2 className="text-4xl md:text-6xl font-black uppercase italic text-primary leading-[0.85] tracking-tighter mb-6 break-words">
                {nombre}
              </h2>
              
              <p className="text-primary/80 text-base md:text-lg italic leading-snug mb-8">
                {descripcion}
              </p>

              {/* MÚSICA */}
              {mostrarMusica && (data.cancion_nombre || data.cancion_url) && (
                <div className="bg-white/40 backdrop-blur-sm p-6 rounded-[2.5rem] border border-primary/10 shadow-inner">
                  <div className="flex items-center gap-3 mb-3 text-primary">
                    <div className="p-2 bg-primary rounded-full text-white">
                      <Music size={14} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Tema Musical</span>
                  </div>
                  <h4 className="text-xl font-black text-primary uppercase italic mb-3">
                    {data.cancion_nombre}
                  </h4>
                  {data.cancion_url && (
                    <audio key={data.cancion_url} controls className="w-full h-10 mix-blend-multiply opacity-80">
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