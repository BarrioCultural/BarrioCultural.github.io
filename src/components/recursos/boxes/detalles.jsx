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
          <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[550px]">
            {/* Botón Cerrar */}
            <button 
              onClick={onClose} 
              className="absolute top-14 right-8 lg:top-10 lg:right-10 p-3 bg-bg-main text-primary rounded-full hover:bg-primary hover:text-white transition-all z-50 shadow-md"
            >
              <X size={20} />
            </button>
            
            {/* Contenedor Imagen */}
            <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-primary/5">
              <img 
                src={imagen} 
                alt={nombre} 
                className="max-h-[500px] w-full object-contain mix-blend-multiply transition-transform duration-700 hover:scale-105" 
              />
            </div>

            {/* Contenedor Texto - Ajustado el padding para mover a la izquierda */}
            <div className="w-full lg:w-1/2 p-8 lg:pl-10 lg:pr-20 flex flex-col justify-center bg-bg-main/5">
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag, i) => tag && (
                  <span key={i} className="px-3 py-1 bg-primary text-white text-[10px] font-black uppercase rounded-lg tracking-widest">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Título más pequeño para evitar desbordes */}
              <h2 className="text-3xl md:text-5xl font-black uppercase italic text-primary leading-[0.9] tracking-tighter mb-6">
                {nombre}
              </h2>
              
              {/* Descripción sin borde lateral para ganar espacio a la izquierda */}
              <p className="text-primary/80 text-base md:text-lg italic leading-snug mb-8">
                {descripcion}
              </p>

              {/* Sección de Música */}
              {mostrarMusica && (data.cancion_nombre || data.cancion_url) && (
                <div className="bg-bg-main/20 p-6 rounded-[2rem] border border-primary/10">
                  <div className="flex items-center gap-3 mb-4 text-primary">
                    <Music size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Tema Musical</span>
                  </div>
                  <h4 className="text-xl font-black text-primary uppercase italic mb-4">
                    {data.cancion_nombre}
                  </h4>
                  {data.cancion_url && (
                    <audio key={data.cancion_url} controls className="w-full mix-blend-multiply opacity-80">
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