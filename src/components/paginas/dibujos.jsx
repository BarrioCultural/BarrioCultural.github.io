"use client";
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useLightbox } from "@/components/recursos/boxes/lightbox"; 
import { GalleryGrid, GalleryItem } from "@/components/recursos/display/gallery";
import { supabase } from '@/lib/supabase';
import Newsletter from "@/components/recursos/boxes/newsletter";
import { motion, AnimatePresence } from 'framer-motion';

export default function Drawings() {
  const { openLightbox } = useLightbox();
  const [dibujos, setDibujos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos');

  const categorias = ['todos', 'fanart', 'original', 'bocetos'];

  useEffect(() => {
    const fetchDibujos = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('dibujos')
          .select('id, url_imagen, titulo, categoria') 
          .order('id', { ascending: false });

        if (error) throw error;
        setDibujos(data || []);
      } catch (err) {
        console.error("Error cargando dibujos:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDibujos();
  }, []);

  const dibujosFiltrados = useMemo(() => (
    filtro === 'todos' ? dibujos : dibujos.filter(d => d.categoria === filtro)
  ), [dibujos, filtro]);

  const imagenesParaLightbox = useMemo(() => (
    dibujosFiltrados.map(d => ({ src: d.url_imagen, alt: d.titulo }))
  ), [dibujosFiltrados]);

  const handleOpenLightbox = useCallback((index) => {
    openLightbox(index, imagenesParaLightbox);
  }, [openLightbox, imagenesParaLightbox]);

  return (
    <main className="min-h-screen bg-[#F0F0F0] pb-20 pt-16 font-sans overflow-x-hidden">
      
      {/* CABECERA ESTILO LORE */}
      <header className="mb-12 md:mb-16 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-[#6B5E70] uppercase leading-none break-words">
          Galería
        </h1>
        <div className="h-1 w-20 md:w-24 bg-[#6B5E70] mx-auto mt-4 rounded-full opacity-20" />
      </header>

      {/* FILTROS REDISEÑADOS (CONSISTENTES) */}
      <div className="max-w-4xl mx-auto mb-16 md:mb-20 px-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Título de categoría estético */}
          <div className="flex items-center space-x-2 w-full max-w-md justify-center">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#6B5E70]/20" />
            <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-[#6B5E70] italic">
              Categorías
            </span>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#6B5E70]/20" />
          </div>

          {/* Botones estilo Pills */}
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

      {/* GALERÍA CON ANIMACIONES */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-8">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-3 border-[#6B5E70]/20 border-t-[#6B5E70] rounded-full animate-spin"></div>
            <p className="text-[#6B5E70]/40 font-black uppercase text-[10px] tracking-[0.3em] animate-pulse">
              Desplegando Arte
            </p>
          </div>
        ) : (
          <div className="min-h-[400px]">
            <AnimatePresence mode="popLayout">
              <motion.div layout>
                <GalleryGrid>
                  {dibujosFiltrados.length > 0 ? (
                    dibujosFiltrados.map((dibujo, index) => (
                      <motion.div
                        key={dibujo.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4 }}
                        className="group"
                      >
                        <div className="relative overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl bg-white p-1 md:p-2">
                           <GalleryItem 
                            src={dibujo.url_imagen}
                            alt={dibujo.titulo}
                            onClick={() => handleOpenLightbox(index)}
                            className="grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700 rounded-[1rem] md:rounded-[2rem]"
                          />
                          {/* Label sutil al hacer hover */}
                          <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            <p className="text-[8px] font-black text-white uppercase tracking-widest drop-shadow-lg">
                              {dibujo.categoria}
                            </p>
                            <h3 className="text-sm font-black text-white uppercase italic tracking-tighter drop-shadow-lg">
                              {dibujo.titulo}
                            </h3>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full py-20 text-center">
                      <p className="text-[#6B5E70]/30 font-bold uppercase text-[11px] tracking-[0.4em] italic">
                        Sin registros en esta sección
                      </p>
                    </div>
                  )}
                </GalleryGrid>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </section>

      <div className="mt-32">
        <Newsletter />
      </div>

      <div className="h-24"></div>
    </main>
  );
}