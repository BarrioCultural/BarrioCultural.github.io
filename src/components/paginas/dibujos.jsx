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
    // Usamos bg-bg-main definido en tu CSS global
    <main className="min-h-screen bg-bg-main pb-20 pt-16 font-sans overflow-x-hidden">
      
      {/* CABECERA (Ahora usa text-primary) */}
      <header className="mb-12 md:mb-16 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-primary uppercase leading-none">
          Galería
        </h1>
        <div className="h-1.5 w-24 bg-primary mx-auto mt-4 rounded-full opacity-20" />
      </header>

      {/* FILTROS (Misma lógica que en Bestiario) */}
      <div className="max-w-4xl mx-auto mb-16 px-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2 w-full max-w-md justify-center opacity-40">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">
              Categorías
            </span>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-primary" />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {categorias.map(cat => (
              <button
                key={cat}
                onClick={() => setFiltro(cat)}
                className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all border ${
                  filtro === cat 
                  ? 'bg-primary text-white border-primary shadow-lg scale-105' 
                  : 'bg-white/50 text-primary/60 border-transparent hover:border-primary/20 hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* GALERÍA */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-8">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-primary/40 font-black uppercase text-[10px] tracking-[0.3em] animate-pulse">
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
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="group"
                      >
                        {/* Usamos tu nueva clase de tarjeta de personaje para mantener la estética */}
                        <div className="char-card-base !aspect-auto bg-white p-1 md:p-2">
                           <GalleryItem 
                            src={dibujo.url_imagen}
                            alt={dibujo.titulo}
                            onClick={() => handleOpenLightbox(index)}
                            className="rounded-[1rem] md:rounded-[2rem] grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700"
                          />
                          
                          {/* Overlay de información (Consistente con las tarjetas del bestiario) */}
                          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex flex-col justify-end p-6 md:p-8">
                            <p className="text-[8px] font-black text-white/70 uppercase tracking-[0.2em] mb-1">
                              {dibujo.categoria}
                            </p>
                            <h3 className="text-lg font-black text-white uppercase italic tracking-tighter leading-none">
                              {dibujo.titulo}
                            </h3>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full py-20 text-center">
                      <p className="text-primary/30 font-bold uppercase text-[10px] tracking-[0.4em] italic">
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