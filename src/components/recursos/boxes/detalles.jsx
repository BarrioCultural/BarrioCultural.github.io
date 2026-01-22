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
  
  // CORRECCIÓN DEL ERROR: Validamos que data.canciones sea un string antes de usar split
  const listaLinks = (data.canciones && typeof data.canciones === 'string') 
    ? data.canciones.split(',').map(link => link.trim()) 
    : [];

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
            
            {/* IMAGEN */}
            <div className="w-full lg:w-1/2 bg-gradient-to-br from-white to-primary/5 flex items-center justify-center p-10 lg:p-16 border-b lg:border-b-0 lg:border-r border-primary/5">
              <div className="relative w-full aspect-square max-w-[400px]">
                <div className="absolute inset-0 bg-primary/5 rounded-[4rem] rotate-3 scale-105" />
                <img 
                  src={imagen} 
                  alt={nombre} 
                  className="relative z-10 w-full h-full object-contain mix-blend-multiply rounded-[3.5rem]" 
                />
              </div>
            </div>

            {/* TEXTO */}
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

              {/* BOTONES ALINEADOS (SOLO SI HAY LINKS) */}
              {mostrarMusica && listaLinks.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-primary/30 mb-2">
                    <Music size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Soundtrack</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {listaLinks.map((link, index) => (
                      <motion.a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-3 bg-white border-2 border-primary/10 px-6 py-3 rounded-2xl hover:border-primary transition-all shadow-sm"
                      >
                        <span className="text-sm font-black italic uppercase text-primary tracking-tighter">
                          Personaje {index + 1}
                        </span>
                        <Music size={14} className="text-primary/40" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}