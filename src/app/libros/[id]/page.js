"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, Play, ListOrdered, BookText, AlertCircle, Plus, Trash2 } from 'lucide-react';

export default function LibroDetalle() {
  const { id } = useParams();
  const router = useRouter();
  
  const [libro, setLibro] = useState(null);
  const [capitulos, setCapitulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // Estado para Admin

  useEffect(() => {
    const fetchDatosLibro = async () => {
      try {
        setLoading(true);
        setError(null);

        // Verificamos si eres Admin
        const { data: { user } } = await supabase.auth.getUser();
        if (user) setIsAdmin(true);

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

        const { data: capsData, error: capsError } = await supabase
          .from('capitulos')
          .select('id, titulo_capitulo, orden')
          .eq('libro_id', id)
          .order('orden', { ascending: true });

        if (capsError) throw capsError;
        setCapitulos(capsData || []);

      } catch (err) {
        console.error("Error cargando detalle:", err);
        setError("Hubo un problema al cargar la información.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDatosLibro();
  }, [id]);

  // FUNCIÓN PARA AÑADIR CAPÍTULO (Rápida para celular)
  const addCapitulo = async () => {
    const titulo = prompt("Título del nuevo capítulo:");
    if (!titulo) return;
    
    const orden = capitulos.length + 1;

    const { error } = await supabase
      .from('capitulos')
      .insert([{ 
        libro_id: id, 
        titulo_capitulo: titulo, 
        orden: orden,
        contenido: "Escribe aquí el contenido..." 
      }]);

    if (error) alert(error.message);
    else window.location.reload();
  };

  // FUNCIÓN PARA BORRAR CAPÍTULO
  const deleteCapitulo = async (e, capId) => {
    e.stopPropagation(); // Evita que el botón de borrar active el router.push
    if (!confirm("¿Seguro que quieres borrar este capítulo?")) return;

    const { error } = await supabase
      .from('capitulos')
      .delete()
      .eq('id', capId);

    if (error) alert(error.message);
    else window.location.reload();
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#FDFCFD]">
      <div className="animate-pulse text-[#6B5E70] font-black uppercase text-[10px] tracking-[0.3em]">
        "Consultando archivos..."
      </div>
    </div>
  );

  if (error) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#FDFCFD] text-center p-6">
      <AlertCircle className="text-red-400 mb-4" size={40} />
      <h2 className="text-[#6B5E70] font-black uppercase text-xs mb-4">"{error}"</h2>
      <button onClick={() => router.push('/libros')} className="btn-brand px-8 py-3 bg-[#6B5E70] text-white rounded-full font-black text-[10px] uppercase">
        Volver a la Biblioteca
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFCFD] pb-20">
      
      <button 
        onClick={() => router.push('/libros')} 
        className="p-8 text-[#6B5E70]/40 hover:text-[#6B5E70] flex items-center gap-2 font-black text-[10px] uppercase transition-all group"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
        "Volver a la Biblioteca"
      </button>

      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-[320px_1fr] gap-16 mt-4">
        
        <aside className="flex flex-col gap-8">
          <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl border border-[#6B5E70]/10 bg-white group">
            <img 
              src={libro.portada_url || "/placeholder-cover.jpg"} 
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

        <main>
          <div className="mb-12">
            <h1 className="text-5xl font-black text-[#6B5E70] italic tracking-tighter leading-[0.9] mb-6 uppercase">
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
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-[#6B5E70]/30 uppercase">{capitulos.length} Capítulos</span>
                {isAdmin && (
                  <button 
                    onClick={addCapitulo}
                    className="bg-[#6B5E70] text-white p-2 rounded-full hover:scale-110 transition-transform shadow-lg"
                  >
                    <Plus size={16} />
                  </button>
                )}
              </div>
            </div>
            
            <div className="grid gap-3">
              {capitulos.length > 0 ? (
                capitulos.map((cap) => (
                  <div key={cap.id} className="relative group">
                    <button 
                      onClick={() => router.push(`/libros/${id}/leer/${cap.id}`)}
                      className="w-full flex items-center justify-between p-6 bg-white border border-[#6B5E70]/5 rounded-3xl hover:border-[#6B5E70]/20 hover:shadow-xl transition-all duration-300 pr-16"
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

                    {isAdmin && (
                      <button 
                        onClick={(e) => deleteCapitulo(e, cap.id)}
                        className="absolute right-16 top-1/2 -translate-y-1/2 p-2 text-red-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-20 border-2 border-dashed border-[#6B5E70]/10 rounded-[3rem] text-center">
                  <BookText className="mx-auto text-[#6B5E70]/10 mb-4" size={48} />
                  <p className="text-[#6B5E70]/30 font-black uppercase text-[10px] tracking-widest">"Aún no se han revelado capítulos"</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}