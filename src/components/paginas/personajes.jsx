"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { GalleryGrid, GalleryItem } from "@/components/recursos/display/gallery";
import { X } from 'lucide-react'; // Para el botón de cerrar detalle

export default function PersonajesGrid() {
  const [personajes, setPersonajes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChars = async () => {
      setLoading(true);
      const { data } = await supabase.from('personajes').select('*').order('id', { ascending: true });
      setPersonajes(data || []);
      setLoading(false);
    };
    fetchChars();
  }, []);

  return (
    <main className="min-h-screen bg-bg-main py-20">
      {/* Si hay un personaje seleccionado, mostramos su ficha (Lightbox Maestro) */}
      {selected && (
        <div className="max-w-6xl mx-auto p-6 mb-20 animate-in fade-in zoom-in duration-300">
           <div className="bg-white rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl relative">
              <button onClick={() => setSelected(null)} className="absolute top-6 right-6 z-50 p-2 bg-bg-main rounded-full">
                <X size={20} />
              </button>
              <img src={selected.img_url} className="w-full md:w-1/2 aspect-square object-cover" />
              <div className="p-10 md:p-20 flex flex-col justify-center">
                <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-primary mb-6">
                  {selected.nombre}
                </h2>
                <p className="text-primary/70 text-xl italic font-medium border-l-4 border-primary pl-6">
                  {selected.sobre}
                </p>
              </div>
           </div>
        </div>
      )}

      {/* Cuadrícula Unificada */}
      {loading ? (
        <p className="text-center font-black uppercase text-[10px] tracking-widest opacity-20">Indexando...</p>
      ) : (
        <GalleryGrid>
          {personajes.map(p => (
            <GalleryItem 
              key={p.id} 
              src={p.img_url} 
              color={p.color_hex} 
              onClick={() => { setSelected(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              <p className="text-[8px] font-black text-white/50 uppercase tracking-widest mb-1">
                {p.reino} • {p.especie}
              </p>
              <h3 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">
                {p.nombre}
              </h3>
            </GalleryItem>
          ))}
        </GalleryGrid>
      )}
    </main>
  );
}