"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, ChevronRight, BookOpen, AlertCircle } from 'lucide-react';
import { cn } from "@/lib/utils"; 

export default function Lector() {
  const { id, capId } = useParams(); 
  const router = useRouter();
  
  const [capitulo, setCapitulo] = useState(null);
  const [listaCapitulos, setListaCapitulos] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: capData, error: capError } = await supabase
          .from('capitulos')
          .select('*, libros ( titulo )')
          .eq('id', capId)
          .maybeSingle();

        if (capError) throw capError;
        if (!capData) {
          setError("Capítulo no encontrado");
          return;
        }
        setCapitulo(capData);

        const { data: todosCaps, error: listaError } = await supabase
          .from('capitulos')
          .select('id, orden')
          .eq('libro_id', id)
          .order('orden', { ascending: true });

        if (listaError) throw listaError;
        setListaCapitulos(todosCaps || []);

      } catch (err) {
        console.error("Error en el lector:", err);
        setError("Hubo un error al cargar la historia");
      } finally {
        setLoading(false);
      }
    };

    if (capId && id) fetchDatos();
  }, [capId, id]);

  // LÓGICA DE NAVEGACIÓN
  const indiceActual = listaCapitulos.findIndex(c => c.id === capId);
  
  const anteriorCap = listaCapitulos[indiceActual - 1];
  const siguienteCap = listaCapitulos[indiceActual + 1];
  
  const esPrimero = indiceActual === 0;
  const esUltimo = indiceActual === listaCapitulos.length - 1;

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#FDFCFD]">
      <div className="animate-pulse text-[#6B5E70] font-black uppercase text-[10px] tracking-[0.3em]">
        Desenrollando pergamino...
      </div>
    </div>
  );

  if (error || !capitulo) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#FDFCFD] text-center p-6">
      <AlertCircle className="text-red-400 mb-4" size={32} />
      <h2 className="text-[#6B5E70] font-black uppercase text-xs">{error}</h2>
      <button onClick={() => router.push(`/libros/${id}`)} className="mt-6 px-6 py-3 bg-[#6B5E70] text-white rounded-full font-black text-[10px] uppercase">
        Volver al índice
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFCFD] text-[#2C262E]">
      
      {/* Navbar Superior */}
      <nav className="sticky top-0 z-50 bg-[#FDFCFD]/80 backdrop-blur-md border-b border-[#6B5E70]/5 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button onClick={() => router.push(`/libros/${id}`)} className="text-[#6B5E70]/40 hover:text-[#6B5E70] transition-transform hover:-translate-x-1">
            <ChevronLeft size={20} />
          </button>
          <div className="text-center">
            <h2 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#6B5E70]/40 leading-none mb-1">
              {capitulo.libros?.titulo}
            </h2>
            <p className="text-[11px] font-bold text-[#6B5E70] uppercase">
              Capítulo {capitulo.orden}
            </p>
          </div>
          <div className="w-5" /> 
        </div>
      </nav>

      {/* Contenido */}
      <article className="max-w-2xl mx-auto px-6 py-16 md:py-24">
        <header className="mb-16 text-center">
          <span className="text-[#6B5E70]/20 font-serif italic text-4xl block mb-4">§ {capitulo.orden}</span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#6B5E70] leading-tight">
            {capitulo.titulo_capitulo}
          </h1>
          <div className="w-12 h-[1px] bg-[#6B5E70]/20 mx-auto mt-8" />
        </header>

        <div className="prose prose-stone lg:prose-xl mx-auto">
          <p className="text-lg md:text-xl leading-[1.9] text-[#2C262E]/90 font-serif whitespace-pre-line first-letter:text-6xl first-letter:font-bold first-letter:text-[#6B5E70] first-letter:mr-3 first-letter:float-left first-letter:mt-2">
            {capitulo.contenido}
          </p>
        </div>

        {/* NAVEGACIÓN INFERIOR MEJORADA */}
        <footer className="mt-24 pt-12 border-t border-[#6B5E70]/10">
          <div className="flex flex-col items-center gap-10">
            <BookOpen size={20} className="text-[#6B5E70]/20" />
            
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              {/* Botón Anterior */}
              <button 
                onClick={() => anteriorCap && router.push(`/libros/${id}/leer/${anteriorCap.id}`)}
                disabled={esPrimero}
                className={cn(
                  "p-5 rounded-2xl border font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2",
                  esPrimero 
                    ? "border-transparent text-[#6B5E70]/10 cursor-not-allowed" 
                    : "border-[#6B5E70]/10 text-[#6B5E70]/60 hover:bg-[#6B5E70]/5 active:scale-95"
                )}
              >
                <ChevronLeft size={14} /> Anterior
              </button>

              {/* Botón Siguiente */}
              <button 
                onClick={() => siguienteCap ? router.push(`/libros/${id}/leer/${siguienteCap.id}`) : router.push(`/libros/${id}`)}
                className={cn(
                  "p-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#6B5E70]/10",
                  esUltimo 
                    ? "bg-[#6B5E70]/10 text-[#6B5E70]/40" 
                    : "bg-[#6B5E70] text-white hover:opacity-90 active:scale-95"
                )}
              >
                {esUltimo ? "Finalizar" : "Siguiente"} <ChevronRight size={14} />
              </button>
            </div>

            <button 
              onClick={() => router.push(`/libros/${id}`)}
              className="text-[9px] font-black uppercase tracking-[0.3em] text-[#6B5E70]/30 hover:text-[#6B5E70] transition-colors"
            >
              Volver al Índice
            </button>
          </div>
        </footer>
      </article>
    </div>
  );
}