"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Youtube, ExternalLink } from 'lucide-react';

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
  
  // Obtenemos el link de la columna "canciones"
  const linkVideo = data.canciones;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div 
          key={data.id}
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
                <div className="absolute inset-0 bg-primary/5 rounded-[4rem] rotate-3 scale-105" />
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

              {/* SECCIÓN DE VIDEOS DE YOUTUBE (BOTONES) */}
              {mostrarMusica && linkVideo && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-primary/40 mb-2">
                    <Youtube size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Contenido Multimedia</span>
                  </div>
                  
                  <motion.a
                    href={linkVideo}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group flex items-center justify-between bg-primary text-white p-5 rounded-[2rem] shadow-xl hover:bg-primary/90 transition-all border-b-4 border-black/20"
                  >
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase opacity-60 tracking-tighter">Ver video de:</span>
                      <span className="text-xl md:text-2xl font-black italic uppercase tracking-tighter">
                        {nombre}
                      </span>
                    </div>
                    <div className="bg-white/20 p-3 rounded-full group-hover:bg-white group-hover:text-primary transition-colors">
                      <ExternalLink size={20} />
                    </div>
                  </motion.a>
                  
                  <p className="text-[9px] text-primary/30 uppercase font-bold text-center tracking-widest">
                    Este link te llevará a YouTube
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}