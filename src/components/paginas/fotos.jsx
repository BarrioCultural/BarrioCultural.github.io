"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { useLightbox } from "@/components/recursos/boxes/lightbox"; 
import { GalleryGrid, GalleryItem } from "@/components/recursos/display/gallery";
import { supabase } from '@/lib/supabase';

export default function Diario() {
  const { openLightbox } = useLightbox();
  const [entradas, setEntradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos');

  const categorias = ['todos', 'yo', 'amigos', 'animales', 'paisajes'];

  useEffect(() => {
    const fetchFotos = async () => {
      setLoading(true);
      const { data } = await supabase.from('diario_fotos').select('*').order('id', { ascending: false });
      setEntradas(data || []);
      setLoading(false);
    };
    fetchFotos();
  }, []);

  const filtradas = useMemo(() => (
    filtro === 'todos' ? entradas : entradas.filter(e => e.categoria === filtro)
  ), [entradas, filtro]);

  const lbData = useMemo(() => filtradas.map(e => ({ src: e.url_imagen, alt: e.fecha })), [filtradas]);

  return (
    <main className="min-h-screen bg-bg-main py-20 px-4">
      <header className="mb-16 text-center">
        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-primary uppercase">Diario</h1>
        <div className="h-1.5 w-24 bg-primary mx-auto mt-4 rounded-full opacity-20" />
      </header>

      {/* Filtros */}
      <div className="flex flex-wrap justify-center gap-2 mb-16">
        {categorias.map(cat => (
          <button 
            key={cat} 
            onClick={() => setFiltro(cat)}
            className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all border ${
              filtro === cat ? 'bg-primary text-white' : 'bg-white/50 text-primary/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <GalleryGrid>
        {filtradas.map((e, i) => (
          <GalleryItem key={e.id} src={e.url_imagen} onClick={() => openLightbox(i, lbData)}>
            <p className="text-[8px] font-black text-white/50 uppercase tracking-widest mb-1">{e.categoria}</p>
            <h3 className="text-lg font-black text-white uppercase italic tracking-tighter leading-none">{e.fecha}</h3>
          </GalleryItem>
        ))}
      </GalleryGrid>
    </main>
  );
}