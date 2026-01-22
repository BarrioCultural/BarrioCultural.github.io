"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { useLightbox } from "@/components/recursos/boxes/lightbox"; 
import { GalleryGrid, GalleryItem } from "@/components/recursos/display/gallery";
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

export default function Diario() {
  const { openLightbox } = useLightbox();
  
  const [entradas, setEntradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos');

  const categorias = ['todos', 'yo', 'amigos', 'animales', 'paisajes'];

  useEffect(() => {
    const fetchFotos = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('diario_fotos')
          .select('*')
          .order('id', { ascending: false });

        if (error) throw error;
        setEntradas(data || []);
      } catch (err) {
        console.error("Error cargando diario:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFotos();
  }, []);

  const fotosFiltradas = useMemo(() => (
    filtro === 'todos' ? entradas : entradas.filter(e => e.categoria === filtro)
  ), [entradas, filtro]);

  const fotosParaLightbox = useMemo(() => (
    fotosFiltradas.map(e => ({ 
      src: e.url_imagen, 
      alt: e.fecha || e.titulo 
    }))
  ), [fotosFiltradas]);

  return (
    <main className="min-h-screen bg-[#F0F0F0] pb-20 pt-16 font-sans overflow-x-hidden">
      
      {/* CABECERA */}
      <header className="mb-12 md:mb-16 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-[#6B5E70] uppercase leading-none break-words">
          Diario
        </h1>
        <div className="h-1 w-20 md:w-24 bg-[#6B5E70] mx-auto mt-4 rounded-full opacity-20" />
      </header>

      {/* FILTROS DE CATEGORÍA */}
      <div className="max-w-4xl mx-auto mb-16 md:mb-20 px-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2 w-full max-w-md justify-center">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#6B5E70]/20" />
            <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-[#6B5E70] italic">
              Recuerdos
            </span>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#6B5E70]/20" />
          </div>

          <div className="flex flex-wrap justify-center gap-1.5 md:gap-2">
            {categorias.map(cat => (
              <button
                key={cat}
                onClick={() => setFiltro(cat)}
                className={`px-4 py-1.5 rounded-xl text-[9px] md:text-[10px] font-bold uppercase transition-all duration-300 border ${
                  filtro === cat 
                  ? 'bg-[#6B5E70] text-white border-[#6B5E70] shadow-lg shadow-[#6B5E70]/20 scale-105' 
                  : 'bg-white text-[#6B5E70]/40 border-transparent hover:border-[#6B5E70]/20 hover:text-[#6B5E70]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CUADRÍCULA DE FOTOS */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-8">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-3 border-[#6B5E70]/20 border-t-[#6B5E70] rounded-full animate-spin"></div>
            <p className="text-[#6B5E70]/40 font-black uppercase text-[10px] tracking-[0.3em] animate-pulse">
              Abriendo Archivo...
            </p>
          </div>
        ) : (
          <div className="min-h-[400px]">
            <AnimatePresence mode="popLayout">
              <motion.div layout>
                <GalleryGrid>
                  {fotosFiltradas.length > 0 ? (
                    fotosFiltradas.map((entrada, index) => (
                      <motion.div 
                        key={entrada.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4 }}
                        className="flex flex-col group cursor-pointer"
                        onClick={() => openLightbox(index, fotosParaLightbox)}
                      >
                        <div className="relative overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl bg-white p-1 md:p-2">
                          <GalleryItem 
                            src={entrada.url_imagen} 
                            alt={entrada.fecha} 
                            className="grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700 rounded-[1rem] md:rounded-[2rem]"
                          />
                        </div>
                        
                        {/* Fecha/Título CORREGIDO PARA MÓVIL */}
                        <div className="mt-3 md:mt-4 px-2 md:px-4 text-center w-full overflow-hidden">
                          <p className="text-[8px] md:text-[9px] font-black text-[#6B5E70]/40 uppercase tracking-[0.2em] mb-0.5 truncate">
                            {entrada.categoria}
                          </p>
                          <h3 className="text-[10px] md:text-[11px] font-black text-[#6B5E70] uppercase italic tracking-tighter leading-tight break-words max-w-[140px] md:max-w-none mx-auto">
                            {entrada.fecha || entrada.titulo}
                          </h3>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full py-20 text-center">
                      <p className="text-[#6B5E70]/30 font-bold uppercase text-[11px] tracking-[0.4em] italic">
                        Sin capturas en este álbum
                      </p>
                    </div>
                  )}
                </GalleryGrid>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </section>

      <div className="h-24"></div>
    </main>
  );
}