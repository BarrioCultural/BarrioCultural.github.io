"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, ChevronRight, BookOpen, AlertCircle, Save, Edit3, X } from 'lucide-react';
import { cn } from "@/lib/utils"; 

export default function Lector() {
  const { id, capId } = useParams(); 
  const router = useRouter();
  
  const [capitulo, setCapitulo] = useState(null);
  const [listaCapitulos, setListaCapitulos] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados de edición
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [nuevoContenido, setNuevoContenido] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Verificar Admin
        const { data: { user } } = await supabase.auth.getUser();
        if (user) setIsAdmin(true);

        // 2. Traer capítulo
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
        setNuevoContenido(capData.contenido || ""); 

        // 3. Lista para navegación
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

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('capitulos')
      .update({ contenido: nuevoContenido })
      .eq('id', capId);

    if (error) {
      alert("Error al guardar: " + error.message);
    } else {
      setCapitulo({ ...capitulo, contenido: nuevoContenido });
      setEditMode(false);
      alert("¡Manuscrito guardado!");
    }
    setSaving(false);
  };

  const indiceActual = listaCapitulos.findIndex(c => c.id === capId);
  const anteriorCap = listaCapitulos[indiceActual - 1];
  const siguienteCap = listaCapitulos[indiceActual + 1];
  const esPrimero = indiceActual === 0;
  const esUltimo = indiceActual === listaCapitulos.length - 1;

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#FDFCFD]">
      <div className="animate-pulse text-[#6B5E70] font-black uppercase text-[10px] tracking-[0.3em]">
        "Desenrollando pergamino..."
      </div>
    </div>
  );

  if (error || !capitulo) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#FDFCFD] text-center p-6">
      <AlertCircle className="text-red-400 mb-4" size={32} />
      <h2 className="text-[#6B5E70] font-black uppercase text-xs">"{error}"</h2>
      <button onClick={() => router.push(`/libros/${id}`)} className="mt-6 px-6 py-3 bg-[#6B5E70] text-white rounded-full font-black text-[10px] uppercase">
        Volver al índice
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFCFD] text-[#2C262E]">
      
      {/* Botones Flotantes de Admin */}
      {isAdmin && (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4">
          {editMode ? (
            <>
              <button 
                onClick={() => { setEditMode(false); setNuevoContenido(capitulo.contenido); }}
                className="bg-red-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all"
              >
                <X size={24} />
              </button>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="bg-green-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center gap-2"
              >
                <Save size={24} />
                <span className="font-black text-[10px] uppercase pr-2">{saving ? '...' : 'Guardar'}</span>
              </button>
            </>
          ) : (
            <button 
              onClick={() => setEditMode(true)}
              className="bg-[#6B5E70] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all"
            >
              <Edit3 size={24} />
            </button>
          )}
        </div>
      )}

      {/* Navbar Superior */}
      <nav className="sticky top-0 z-50 bg-[#FDFCFD]/80 backdrop-blur-md border-b border-[#6B5E70]/5 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button onClick={() => router.push(`/libros/${id}`)} className="text-[#6B5E70]/40 hover:text-[#6B5E70] transition-transform">
            <ChevronLeft size={20} />
          </button>
          <div className="text-center">
            <h2 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#6B5E70]/40 leading-none mb-1 uppercase">
              {capitulo.libros?.titulo}
            </h2>
            <p className="text-[11px] font-bold text-[#6B5E70] uppercase">
              Capítulo {capitulo.orden}
            </p>
          </div>
          <div className="w-5" /> 
        </div>
      </nav>

      <article className="max-w-2xl mx-auto px-6 py-16 md:py-24">
        <header className="mb-16 text-center">
          <span className="text-[#6B5E70]/20 font-serif italic text-4xl block mb-4">§ {capitulo.orden}</span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#6B5E70] leading-tight uppercase">
            {capitulo.titulo_capitulo}
          </h1>
          <div className="w-12 h-[1px] bg-[#6B5E70]/20 mx-auto mt-8" />
        </header>

        <div className="prose prose-stone lg:prose-xl mx-auto">
          {editMode ? (
            <textarea
              value={nuevoContenido}
              onChange={(e) => setNuevoContenido(e.target.value)}
              className="w-full min-h-[60vh] bg-white/50 p-4 rounded-2xl border border-[#6B5E70]/10 font-serif text-lg md:text-xl leading-[1.9] text-[#2C262E] focus:ring-2 focus:ring-[#6B5E70]/20 resize-none transition-all"
              placeholder="Escribe tu historia aquí..."
              autoFocus
            />
          ) : (
            <div className="text-lg md:text-xl leading-[1.9] text-[#2C262E]/90 font-serif whitespace-pre-line first-letter:text-6xl first-letter:font-bold first-letter:text-[#6B5E70] first-letter:mr-3 first-letter:float-left first-letter:mt-2">
              {capitulo.contenido}
            </div>
          )}
        </div>

        {!editMode && (
          <footer className="mt-24 pt-12 border-t border-[#6B5E70]/10">
            <div className="flex flex-col items-center gap-10">
              <BookOpen size={20} className="text-[#6B5E70]/20" />
              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                <button 
                  onClick={() => anteriorCap && router.push(`/libros/${id}/leer/${anteriorCap.id}`)}
                  disabled={esPrimero}
                  className={cn(
                    "p-5 rounded-2xl border font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2",
                    esPrimero ? "opacity-20 cursor-not-allowed" : "border-[#6B5E70]/10 text-[#6B5E70]/60"
                  )}
                >
                  <ChevronLeft size={14} /> "Anterior"
                </button>

                <button 
                  onClick={() => siguienteCap ? router.push(`/libros/${id}/leer/${siguienteCap.id}`) : router.push(`/libros/${id}`)}
                  className="p-5 rounded-2xl bg-[#6B5E70] text-white font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2"
                >
                  {esUltimo ? "Finalizar" : "Siguiente"} <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </footer>
        )}
      </article>
    </div>
  );
}