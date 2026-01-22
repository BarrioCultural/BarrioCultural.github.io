"use client";
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useLightbox } from "@/components/recursos/boxes/lightbox"; 
import { GalleryGrid, GalleryItem } from "@/components/recursos/display/gallery";
import { supabase } from '@/lib/supabase';
import Newsletter from "@/components/recursos/boxes/newsletter";

export default function Drawings() {
  const { openLightbox } = useLightbox();
  const [dibujos, setDibujos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos');

  const categorias = ['todos', 'fanart', 'original', 'bocetos'];

  useEffect(() => {
    const fetchDibujos = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('dibujos')
        .select('id, url_imagen, titulo, categoria') 
        .order('id', { ascending: false });
      
      setDibujos(data || []);
      setLoading(false);
    };
    fetchDibujos();
  }, []);

  const filtrados = useMemo(() => (
    filtro === 'todos' ? dibujos : dibujos.filter(d => d.categoria === filtro)
  ), [dibujos, filtro]);

  const lbData = useMemo(() => (
    filtrados.map(d => ({ src: d.url_imagen, alt: d.titulo }))
  ), [filtrados]);

  return (
    <main className="min-h-screen bg-bg-main pb-20 pt-16 font-sans">
      
      {/* HEADER */}
      <header className="mb-12 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-primary uppercase leading-none">
          Galería
        </h1>
        <div className="h-1.5 w-24 bg-primary mx-auto mt-4 rounded-full opacity-20" />
      </header>

      {/* FILTROS */}
      <div className="max-w-4xl mx-auto mb-16 px-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex flex-wrap justify-center gap-2">
            {categorias.map(cat => (
              <button
                key={cat}
                onClick={() => setFiltro(cat)}
                className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all border ${
                  filtro === cat 
                  ? 'bg-primary text-white shadow-lg scale-105' 
                  : 'bg-white/50 text-primary/60 border-transparent hover:border-primary/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* REJILLA DE ARTE UNIFICADA */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-8">
        {loading ? (
          <div className="py-20 text-center text-primary/30 font-black uppercase text-[10px] tracking-widest animate-pulse">
            Desplegando Arte...
          </div>
        ) : (
          <GalleryGrid>
            {filtrados.map((dibujo, index) => (
              <GalleryItem
                key={dibujo.id}
                src={dibujo.url_imagen}
                alt={dibujo.titulo}
                onClick={() => openLightbox(index, lbData)}
              >
                <p className="text-[8px] font-black text-white/50 uppercase tracking-[0.2em] mb-1">
                  {dibujo.categoria}
                </p>
                <h3 className="text-lg font-black text-white uppercase italic tracking-tighter leading-none">
                  {dibujo.titulo}
                </h3>
              </GalleryItem>
            ))}
            
            {!loading && filtrados.length === 0 && (
              <div className="col-span-full py-20 text-center text-primary/30 font-bold uppercase text-[10px] tracking-widest">
                Sin registros en esta sección
              </div>
            )}
          </GalleryGrid>
        )}
      </section>

      <div className="mt-32">
        <Newsletter />
      </div>
    </main>
  );
}