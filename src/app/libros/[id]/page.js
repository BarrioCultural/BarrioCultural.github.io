"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, Play, ListOrdered, BookText, AlertCircle } from 'lucide-react';

export default function LibroDetalle() {
  const { id } = useParams();
  const router = useRouter();
  
  const [libro, setLibro] = useState(null);
  const [capitulos, setCapitulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDatosLibro = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Traer info del libro
        const { data: libroData, error: libroError } = await supabase
          .from('libros')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (libroError) throw libroError;
        if (!libroData) {
          setError("El libro que buscas no existe.");
          return;
        }
        setLibro(libroData);

        // 2. Traer sus capítulos ordenados
        const { data: capsData, error: capsError } = await supabase
          .from('capitulos')
          .select('id, titulo_capitulo, orden')
          .eq('libro_id', id)
          .order('orden', { ascending: true });

        if (capsError) throw capsError;
        setCapitulos(capsData || []);

      } catch (err) {
        console.error("Error cargando detalle:", err);
        setError("Hubo un problema al cargar la información del libro.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDatosLibro();
  }, [id]);

  // Pantalla de Carga
  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#FDFCFD]">
      <div className="animate-pulse text-[#6B5E70] font-black uppercase text-[10px] tracking-[0.3em]">
        Consultando archivos...
      </div>
    </div>
  );

  // Pantalla de Error
  if (error) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#FDFCFD] text-center p-6">
      <AlertCircle className="text-red-400 mb-4" size={40} />
      <h2 className="text-[#6B5E70] font-black uppercase text-xs mb-4">{error}</h2>
      <button 
        onClick={() => router.push('/libros')} 
        className="px-8 py-3 bg-[#6B5E70] text-white rounded-full font-black text-[10px] uppercase shadow-lg shadow-[#6B5E70]/20"
      >
        Volver a la Biblioteca
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFCFD] pb-20">
      
      {/* NAVEGACIÓN MEJORADA: Ahora va directo a /libros */}
      <button 
        onClick={() => router.push('/libros')} 
        className="p-8 text-[#6B5E70]/40 hover:text-[#6B5E70] flex items-center gap-2 font-black text-[10px] uppercase transition-all group"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
        Volver a la Biblioteca
      </button>

      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-[320px_1fr] gap-16 mt-4">
        
        {/* Lado Izquierdo: Portada */}
        <aside className="flex flex-col gap-8">
          <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl border border-[#6B5E70]/10 bg-white group">
            <img 
              src={libro.portada_url || "https://images.unsplash.com/photo-1543005139-059e1fe29598?q=80&w=1000&auto=format&fit=crop"} 
              alt={libro.titulo} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
          </div>
          
          <div className="bg-white p-6 rounded-[2rem] border border-[#6B5E70]/5 shadow-sm">
            <span className="text-[9px] font-black text-[#6B5E70]/30 uppercase tracking-[0.2em] block mb-2">Estado de Obra</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <p className="text-[#6B5E70] font-black uppercase text-[11px] tracking-tighter">{libro.estado || "En curso"}</p>
            </div>
          </div>
        </aside>

        {/* Lado Derecho: Contenido */}
        <main>
          <div className="mb-12">
            <h1 className="text-5xl font-black text-[#6B5E70] italic tracking-tighter leading-[0.9] mb-6">
              {libro.titulo}
            </h1>
            <div className="prose prose-stone">
              <p className="text-[#6B5E70]/70 leading-relaxed text-lg font-medium italic">
                "{libro.sinopsis}"
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between mb-8 border-b border-[#6B5E70]/10 pb-4">
              <h3 className="flex items-center gap-3 text-[#6B5E70] font-black uppercase text-[10px] tracking-[0.2em]">
                <ListOrdered size={16} /> Índice de Capítulos
              </h3>
              <span className="text-[10px] font-black text-[#6B5E70]/30 uppercase">{capitulos.length} Capítulos</span>
            </div>
            
            <div className="grid gap-3">
              {capitulos.length > 0 ? (
                capitulos.map((cap) => (
                  <button 
                    key={cap.id}
                    onClick={() => router.push(`/libros/${id}/leer/${cap.id}`)}
                    className="w-full group flex items-center justify-between p-6 bg-white border border-[#6B5E70]/5 rounded-3xl hover:border-[#6B5E70]/20 hover:shadow-xl hover:shadow-[#6B5E70]/5 transition-all duration-300"
                  >
                    <div className="flex items-center gap-5">
                      <span className="text-2xl font-black italic text-[#6B5E70]/10 group-hover:text-[#6B5E70]/20 transition-colors w-8">
                        {cap.orden}
                      </span>
                      <div className="text-left">
                        <span className="text-[#6B5E70] font-black uppercase text-[12px] tracking-tight block group-hover:translate-x-1 transition-transform">
                          {cap.titulo_capitulo}
                        </span>
                      </div>
                    </div>
                    <div className="bg-[#6B5E70]/5 p-2 rounded-full group-hover:bg-[#6B5E70] group-hover:text-white transition-all">
                      <Play size={14} fill="currentColor" />
                    </div>
                  </button>
                ))
              ) : (
                <div className="py-20 border-2 border-dashed border-[#6B5E70]/10 rounded-[3rem] text-center">
                  <BookText className="mx-auto text-[#6B5E70]/10 mb-4" size={48} />
                  <p className="text-[#6B5E70]/30 font-black uppercase text-[10px] tracking-widest">Aún no se han revelado capítulos</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}