"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { GalleryGrid, GalleryItem } from "@/components/recursos/display/gallery";
import { X } from 'lucide-react';

export default function Inventario() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('TODOS');

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      const { data } = await supabase.from('items').select('*').order('created_at', { ascending: false });
      setItems(data || []);
      setLoading(false);
    };
    fetchItems();
  }, []);

  const categorias = useMemo(() => ['TODOS', ...new Set(items.map(i => i.categoria))], [items]);
  const filtrados = useMemo(() => filtro === 'TODOS' ? items : items.filter(i => i.categoria === filtro), [items, filtro]);

  return (
    <main className="min-h-screen bg-bg-main pb-20 pt-16 font-sans">
      <header className="mb-16 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-primary uppercase leading-none">
          Inventario
        </h1>
        <div className="h-1.5 w-24 bg-primary mx-auto mt-4 rounded-full opacity-20" />
        
        {/* Filtros Estilo Diario/Personajes */}
        <div className="flex flex-wrap justify-center gap-2 mt-10 max-w-2xl mx-auto">
          {categorias.map(cat => (
            <button 
              key={cat} 
              onClick={() => setFiltro(cat)} 
              className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all border 
                ${filtro === cat ? 'bg-primary text-white border-primary shadow-lg scale-105' : 'bg-white/50 text-primary/60 border-transparent hover:border-primary/20'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Detalle del Item (Lightbox) */}
      {selected && (
        <div className="max-w-6xl mx-auto mb-16 p-4 md:p-6 relative animate-in fade-in zoom-in duration-300">
          <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[500px]">
            <button onClick={() => setSelected(null)} className="absolute top-10 right-10 p-3 bg-bg-main text-primary rounded-full hover:bg-primary hover:text-white transition-all z-50 shadow-md">
              <X size={20} />
            </button>
            <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-12">
              <img src={selected.imagen_url} alt={selected.nombre} className="max-h-full object-contain mix-blend-multiply" />
            </div>
            <div className="w-full lg:w-1/2 p-12 flex flex-col justify-center bg-bg-main/5">
              <span className="px-3 py-1 bg-primary text-white text-[10px] font-black uppercase rounded-lg tracking-widest w-fit mb-6">
                {selected.categoria}
              </span>
              <h2 className="text-5xl md:text-7xl font-black uppercase italic text-primary leading-none tracking-tighter mb-6">
                {selected.nombre}
              </h2>
              <p className="text-primary/80 text-lg italic leading-relaxed border-l-4 border-primary pl-6">
                {selected.descripcion}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grid Unificado (Se adapta a lo que ya tenías) */}
      <GalleryGrid>
        {filtrados.map(item => (
          <GalleryItem 
            key={item.id} 
            src={item.imagen_url} 
            onClick={() => { setSelected(item); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <p className="text-[8px] font-black text-white/50 uppercase tracking-[0.2em] mb-1">
              {item.categoria}
            </p>
            <h3 className="text-lg font-black text-white uppercase italic leading-none tracking-tighter">
              {item.nombre}
            </h3>
          </GalleryItem>
        ))}
      </GalleryGrid>
    </main>
  );
}