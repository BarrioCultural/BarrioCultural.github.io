"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, Play, ListOrdered, BookText } from 'lucide-react';

export default function LibroDetalle() {
  const { id } = useParams();
  const router = useRouter();
  const [libro, setLibro] = useState(null);
  const [capitulos, setCapitulos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDatosLibro = async () => {
      // 1. Traer info del libro
      const { data: libroData } = await supabase
        .from('libros')
        .select('*')
        .eq('id', id)
        .single();

      // 2. Traer sus capítulos ordenados
      const { data: capsData } = await supabase
        .from('capitulos')
        .select('id, titulo_capitulo, orden')
        .eq('libro_id', id)
        .order('orden', { ascending: true });

      setLibro(libroData);
      setCapitulos(capsData || []);
      setLoading(false);
    };

    if (id) fetchDatosLibro();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center text-[#6B5E70] font-black uppercase text-[10px]">Cargando historia...</div>;
  if (!libro) return <div className="p-20 text-center">Libro no encontrado</div>;

  return (
    <div className="min-h-screen bg-[#FDFCFD] pb-20">
      {/* Botón Volver */}
      <button onClick={() => router.back()} className="p-6 text-[#6B5E70]/40 hover:text-[#6B5E70] flex items-center gap-2 font-black text-[10px] uppercase transition-all">
        <ChevronLeft size={16} /> Volver a la Biblioteca
      </button>

      <div className="max-w-4xl mx-auto px-6 grid md:grid-cols-[300px_1fr] gap-12 mt-8">
        {/* Lado Izquierdo: Portada e Info */}
        <aside className="flex flex-col gap-6">
          <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border border-[#6B5E70]/10">
            <img src={libro.portada_url} alt={libro.titulo} className="w-full h-full object-cover" />
          </div>
          <div className="bg-[#6B5E70]/5 p-6 rounded-3xl border border-[#6B5E70]/5">
            <span className="text-[9px] font-black text-[#6B5E70]/40 uppercase tracking-widest">Estado</span>
            <p className="text-[#6B5E70] font-bold uppercase text-xs mt-1">{libro.estado}</p>
          </div>
        </aside>

        {/* Lado Derecho: Sinopsis e Índice */}
        <main>
          <h1 className="text-4xl font-black text-[#6B5E70] italic tracking-tighter leading-none mb-4">
            {libro.titulo}
          </h1>
          <p className="text-[#6B5E70]/70 leading-relaxed mb-12 text-lg">
            {libro.sinopsis}
          </p>

          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-[#6B5E70] font-black uppercase text-[10px] tracking-[0.2em] mb-6">
              <ListOrdered size={14} /> Índice de Capítulos
            </h3>
            
            {capitulos.length > 0 ? (
              capitulos.map((cap) => (
                <button 
                  key={cap.id}
                  onClick={() => router.push(`/libros/${id}/leer/${cap.id}`)}
                  className="w-full group flex items-center justify-between p-5 bg-white border border-[#6B5E70]/10 rounded-2xl hover:border-[#6B5E70] hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-[#6B5E70]/20 font-black italic group-hover:text-[#6B5E70]/40 transition-colors">
                      {cap.orden.toString().padStart(2, '0')}
                    </span>
                    <span className="text-[#6B5E70] font-bold uppercase text-[11px] tracking-wide">
                      {cap.titulo_capitulo}
                    </span>
                  </div>
                  <Play size={14} className="text-[#6B5E70]/20 group-hover:text-[#6B5E70] transition-colors" />
                </button>
              ))
            ) : (
              <div className="p-10 border-2 border-dashed border-[#6B5E70]/10 rounded-3xl text-center">
                <BookText className="mx-auto text-[#6B5E70]/20 mb-3" size={32} />
                <p className="text-[#6B5E70]/40 font-bold uppercase text-[10px]">Próximamente el primer capítulo</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}