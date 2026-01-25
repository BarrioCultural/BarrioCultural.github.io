"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, ChevronRight, BookOpen, Settings } from 'lucide-react';

export default function Lector() {
  const { id, capId } = useParams(); // 'id' es del libro, 'capId' del capítulo
  const router = useRouter();
  const [capitulo, setCapitulo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCapitulo = async () => {
      const { data, error } = await supabase
        .from('capitulos')
        .select(`
          *,
          libros ( titulo )
        `)
        .eq('id', capId)
        .single();

      if (!error) setCapitulo(data);
      setLoading(false);
    };

    if (capId) fetchCapitulo();
  }, [capId]);

  if (loading) return <div className="h-screen flex items-center justify-center text-[#6B5E70] font-black uppercase text-[10px]">Desenrollando pergamino...</div>;
  if (!capitulo) return <div className="p-20 text-center">Capítulo no encontrado</div>;

  return (
    <div className="min-h-screen bg-[#FDFCFD] text-[#2C262E]">
      
      {/* Barra de Navegación del Lector */}
      <nav className="sticky top-0 z-50 bg-[#FDFCFD]/80 backdrop-blur-md border-b border-[#6B5E70]/5 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => router.push(`/libros/${id}`)}
            className="text-[#6B5E70]/40 hover:text-[#6B5E70] transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="text-center">
            <h2 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#6B5E70]/40 leading-none mb-1">
              {capitulo.libros?.titulo}
            </h2>
            <p className="text-[11px] font-bold text-[#6B5E70] uppercase">
              Capítulo {capitulo.orden}: {capitulo.titulo_capitulo}
            </p>
          </div>

          <button className="text-[#6B5E70]/40">
            <Settings size={18} />
          </button>
        </div>
      </nav>

      {/* Cuerpo del Relato */}
      <article className="max-w-2xl mx-auto px-6 py-16 md:py-24">
        {/* Título interno */}
        <header className="mb-16 text-center">
          <span className="text-[#6B5E70]/20 font-serif italic text-4xl block mb-4">
            § {capitulo.orden}
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#6B5E70]">
            {capitulo.titulo_capitulo}
          </h1>
          <div className="w-12 h-[1px] bg-[#6B5E70]/20 mx-auto mt-8" />
        </header>

        {/* El Texto (Aquí es donde fluye tu historia) */}
        <div className="prose prose-stone lg:prose-xl mx-auto">
          <p className="text-lg md:text-xl leading-[1.8] text-[#2C262E]/90 font-serif whitespace-pre-line first-letter:text-5xl first-letter:font-bold first-letter:text-[#6B5E70] first-letter:mr-3 first-letter:float-left">
            {capitulo.contenido}
          </p>
        </div>

        {/* Fin del Capítulo y Navegación */}
        <footer className="mt-24 pt-12 border-t border-[#6B5E70]/10">
          <div className="flex flex-col items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="h-[1px] w-8 bg-[#6B5E70]/20" />
              <BookOpen size={20} className="text-[#6B5E70]/20" />
              <div className="h-[1px] w-8 bg-[#6B5E70]/20" />
            </div>
            
            <div className="flex gap-4 w-full">
              <button 
                onClick={() => router.back()}
                className="flex-1 p-5 rounded-2xl border border-[#6B5E70]/10 text-[#6B5E70]/40 font-black uppercase text-[10px] tracking-widest hover:bg-[#6B5E70]/5 transition-all"
              >
                Volver al índice
              </button>
              {/* Aquí podrías añadir lógica para "Siguiente Capítulo" luego */}
              <button className="flex-1 p-5 rounded-2xl bg-[#6B5E70] text-white font-black uppercase text-[10px] tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2">
                Siguiente <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}