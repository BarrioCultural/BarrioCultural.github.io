"use client";

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useLightbox } from "@/components/recursos/lightbox"; 
import { GalleryGrid, GalleryItem } from "@/components/recursos/display/gallery";
import { supabase } from '@/lib/supabase';
import Newsletter from "@/components/recursos/boxes/newsletter";

const Drawings = () => {
  const { openLightbox } = useLightbox();
  
  const [dibujos, setDibujos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos');

  useEffect(() => {
    const fetchDibujos = async () => {
      try {
        setLoading(true);
        // 1. OPTIMIZACIÓN: Solo pedimos las columnas que necesitamos
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

  // 2. OPTIMIZACIÓN: Memorizamos la lista filtrada para que no se recalcule al hacer scroll
  const dibujosFiltrados = useMemo(() => (
    filtro === 'todos' 
      ? dibujos 
      : dibujos.filter(d => d.categoria === filtro)
  ), [dibujos, filtro]);

  // 3. OPTIMIZACIÓN: Memorizamos la lista para el Lightbox
  const imagenesParaLightbox = useMemo(() => (
    dibujosFiltrados.map(d => ({
      src: d.url_imagen,
      alt: d.titulo
    }))
  ), [dibujosFiltrados]);

  // Usamos useCallback para que la función de abrir el lightbox sea estable
  const handleOpenLightbox = useCallback((index) => {
    openLightbox(index, imagenesParaLightbox);
  }, [openLightbox, imagenesParaLightbox]);

  const categorias = ['todos', 'fanart', 'original', 'bocetos'];

  return (
    <main className="min-h-screen bg-bg-main pt-10">
      <header className="mb-10 px-4 text-center">
        <h1 className="text-4xl font-bold text-primary tracking-tight">Dibujos</h1>
        <p className="mt-2 text-primary/60 italic">Fanarts y Personajes :D</p>
      </header>

      <Newsletter />

      {/* 🔘 Botones de Filtro */}
      <div className="flex justify-center gap-2 mb-8 px-4 flex-wrap">
        {categorias.map(cat => (
          <button
            key={cat}
            onClick={() => setFiltro(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
              filtro === cat 
              ? 'bg-primary text-white border-primary shadow-md' 
              : 'bg-white/10 text-primary/40 border-primary/10 hover:border-primary/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-primary animate-pulse text-lg font-bold uppercase tracking-widest">Cargando arte... 🎨</p>
        </div>
      ) : (
        <div className="px-4">
          <GalleryGrid>
            {dibujosFiltrados.length > 0 ? (
              dibujosFiltrados.map((dibujo, index) => (
                <GalleryItem 
                  key={dibujo.id}
                  src={dibujo.url_imagen}
                  alt={dibujo.titulo}
                  // Usamos la función memorizada
                  onClick={() => handleOpenLightbox(index)} 
                />
              ))
            ) : (
              <p className="text-center col-span-full text-primary/50 italic py-10">
                No hay dibujos en la categoría "{filtro}".
              </p>
            )}
          </GalleryGrid>
        </div>
      )}

      <div className="h-24"></div>
    </main>
  );
};

export default Drawings;