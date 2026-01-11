"use client";

import React, { useEffect, useState } from 'react';
import { useLightbox } from "@/components/recursos/boxes/lightbox"; 
import { GalleryGrid, GalleryItem } from "@/components/recursos/display/gallery";
import { supabase } from '@/lib/supabase';

const Diario = () => {
  const { openLightbox } = useLightbox();
  
  const [entradas, setEntradas] = useState([]);
  const [loading, setLoading] = useState(true);
  // 🟢 Estado para el filtro
  const [filtro, setFiltro] = useState('todos');

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

  // 🟢 Lógica de filtrado
  const fotosFiltradas = filtro === 'todos' 
    ? entradas 
    : entradas.filter(e => e.categoria === filtro);

  // Preparamos el Lightbox basándonos en la lista filtrada
  const fotosParaLightbox = fotosFiltradas.map(e => ({ 
    src: e.url_imagen, 
    alt: e.fecha || e.titulo 
  }));

  const categorias = ['todos', 'yo', 'amigos', 'animales', 'paisajes'];

  return (
    <main className="min-h-screen bg-[#E2D8E6] pt-10">
      <header className="mb-10 px-4 text-center">
        <h1 className="text-4xl font-black text-[#6B5E70] tracking-tight italic">Diario de Fotos</h1>
        <p className="mt-2 text-[#6B5E70]/60 text-xs font-bold uppercase tracking-widest">Recuerdos y momentos</p>
      </header>

      {/* 🔘 Botones de Filtro (Estilo igual a dibujos) */}
      <div className="flex justify-center gap-2 mb-8 px-4 flex-wrap">
        {categorias.map(cat => (
          <button
            key={cat}
            onClick={() => setFiltro(cat)}
            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
              filtro === cat 
              ? 'bg-[#6B5E70] text-white border-[#6B5E70]' 
              : 'bg-white/20 text-[#6B5E70]/40 border-[#6B5E70]/10 hover:border-[#6B5E70]/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-[#6B5E70] animate-pulse font-bold uppercase text-xs tracking-widest">
          Cargando recuerdos... 🎞️
        </div>
      ) : (
        <div className="px-4">
          <GalleryGrid>
            {fotosFiltradas.length > 0 ? (
              fotosFiltradas.map((entrada, index) => (
                <div key={entrada.id} className="flex flex-col group">
                  <GalleryItem 
                    src={entrada.url_imagen} 
                    alt={entrada.fecha} 
                    onClick={() => openLightbox(index, fotosParaLightbox)} 
                  />
                  <h3 className="mt-3 text-center text-[10px] font-black text-[#6B5E70] uppercase tracking-tighter opacity-50 group-hover:opacity-100 transition-opacity">
                    {entrada.fecha || entrada.titulo}
                  </h3>
                </div>
              ))
            ) : (
              <p className="text-center col-span-full text-[#6B5E70]/40 italic py-10">
                Aún no hay fotos en la categoría "{filtro}".
              </p>
            )}
          </GalleryGrid>
        </div>
      )}

      <div className="h-24"></div>
    </main>
  );
};

export default Diario;