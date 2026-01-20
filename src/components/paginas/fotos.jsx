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

  // Lógica de filtrado optimizada
  const fotosFiltradas = useMemo(() => (
    filtro === 'todos' ? entradas : entradas.filter(e => e.categoria === filtro)
  ), [entradas, filtro]);

  // Preparamos el Lightbox
  const fotosParaLightbox = useMemo(() => (
    fotosFiltradas.map(e => ({ 
      src: e.url_imagen, 
      alt: e.fecha || e.titulo 
    }))
  ), [fotosFiltradas]);

  return (
    <main className="min-h-screen bg-[#EBEBEB] pb-20 pt-10">
      
      {/* HEADER */}
      <header className="mb-10 px-4 text-center">
        <h1 className="text-4xl font-black italic text-[#6B5E70] uppercase tracking-tighter">Diario de Fotos</h1>
        <p className="mt-2 text-[#6B5E70]/60 text-[10px] font-black uppercase tracking-widest">Recuerdos y momentos</p>
      </header>

      {/* FILTROS (Reciclados del CSS Global) */}
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

      {/* GALERÍA DE FOTOS */}
      <section className="max-w-[1600px] mx-auto px-6">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-[#6B5E70]/20 border-t-[#6B5E70] rounded-full animate-spin"></div>
            <p className="text-[#6B5E70] font-black uppercase text-xs tracking-widest animate-pulse">Cargando recuerdos... 🎞️</p>
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
                        className="flex flex-col group"
                      >
                        <GalleryItem 
                          src={entrada.url_imagen} 
                          alt={entrada.fecha} 
                          onClick={() => openLightbox(index, fotosParaLightbox)} 
                        />
                        <h3 className="mt-3 text-center text-[10px] font-black text-[#6B5E70] uppercase tracking-tighter opacity-50 group-hover:opacity-100 transition-opacity">
                          {entrada.fecha || entrada.titulo}
                        </h3>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full py-20 text-center">
                      <p className="text-[#6B5E70]/40 font-black uppercase text-[10px] tracking-[0.3em]">
                        Aún no hay fotos en la categoría "{filtro}".
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