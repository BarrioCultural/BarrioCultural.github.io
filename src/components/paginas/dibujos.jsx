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

  // Optimización de la lista filtrada
  const dibujosFiltrados = useMemo(() => (
    filtro === 'todos' ? dibujos : dibujos.filter(d => d.categoria === filtro)
  ), [dibujos, filtro]);

  // Optimización para el Lightbox
  const imagenesParaLightbox = useMemo(() => (
    dibujosFiltrados.map(d => ({ src: d.url_imagen, alt: d.titulo }))
  ), [dibujosFiltrados]);

  const handleOpenLightbox = useCallback((index) => {
    openLightbox(index, imagenesParaLightbox);
  }, [openLightbox, imagenesParaLightbox]);

  return (
    <main className="min-h-screen bg-[#EBEBEB] pb-20 pt-10">
      
      {/* HEADER */}
      <header className="mb-10 px-4 text-center">
        <h1 className="text-4xl font-black italic text-[#6B5E70] uppercase tracking-tighter">
          Galería de Arte
        </h1>
        <p className="mt-2 text-[#6B5E70]/60 font-medium italic">
          Fanarts, personajes y bocetos :D
        </p>
      </header>

      {/* FILTROS (Reciclando filter-pill) */}
      <div className="flex justify-center gap-2 mb-12 px-4 flex-wrap">
        {categorias.map(cat => (
          <button
            key={cat}
            onClick={() => setFiltro(cat)}
            className={`filter-pill ${filtro === cat ? 'filter-pill-active' : 'filter-pill-inactive'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* GALERÍA CON ANIMACIONES */}
      <section className="max-w-[1600px] mx-auto px-6">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-[#6B5E70]/20 border-t-[#6B5E70] rounded-full animate-spin"></div>
            <p className="text-[#6B5E70] font-black uppercase text-xs tracking-widest animate-pulse">
              Cargando arte... 🎨
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
                        transition={{ duration: 0.3 }}
                      >
                        <GalleryItem 
                          src={dibujo.url_imagen}
                          alt={dibujo.titulo}
                          onClick={() => handleOpenLightbox(index)} 
                        />
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full py-20 text-center">
                      <p className="text-[#6B5E70]/40 font-black uppercase text-[10px] tracking-[0.3em]">
                        No hay dibujos en esta categoría.
                      </p>
                    </div>
                  )}
                </GalleryGrid>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </section>

      <div className="mt-20">
        <Newsletter />
      </div>

      <div className="h-24"></div>
    </main>
  );
}