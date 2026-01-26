"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, Play, ListOrdered, BookText, Plus, Trash2, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LibroDetalle() {
  const params = useParams();
  const id = params?.id; // Acceso más seguro al ID
  const router = useRouter();
  
  const [libro, setLibro] = useState(null);
  const [capitulos, setCapitulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [nuevoTitulo, setNuevoTitulo] = useState("");
  const [creando, setCreando] = useState(false);

  useEffect(() => {
    const fetchDatosLibro = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        // 1. Verificar Usuario
        const { data: { session } } = await supabase.auth.getSession();
        if (session) setIsAdmin(true);

        // 2. Cargar Libro
        // Cambiamos select('*') por campos específicos si prefieres, 
        // pero lo importante es el .eq() y manejar el resultado.
        const { data: libroData, error: libroError } = await supabase
          .from('libros')
          .select('*')
          .eq('id', id);

        if (libroError) throw libroError;

        if (!libroData || libroData.length === 0) {
          setError("El libro que buscas no existe en nuestros archivos.");
          setLoading(false);
          return;
        }

        setLibro(libroData[0]);

        // 3. Cargar Capítulos
        const { data: capsData, error: capsError } = await supabase
          .from('capitulos')
          .select('id, titulo_capitulo, orden')
          .eq('libro_id', id)
          .order('orden', { ascending: true });

        if (capsError) throw capsError;
        setCapitulos(capsData || []);

      } catch (err) {
        console.error("Error crítico en LibroDetalle:", err);
        setError("Error de conexión con la biblioteca digital.");
      } finally {
        setLoading(false); // ESTO GARANTIZA QUE PARE EL LOADING
      }
    };

    fetchDatosLibro();
  }, [id]);

  // FUNCIÓN PARA CREAR CAPÍTULO
  const handleCrearCapitulo = async (e) => {
    e.preventDefault();
    if (!nuevoTitulo.trim() || creando) return;
    
    setCreando(true);
    const orden = capitulos.length + 1;

    try {
      const { error } = await supabase
        .from('capitulos')
        .insert([{ 
          libro_id: id, 
          titulo_capitulo: nuevoTitulo.toUpperCase(), 
          orden: orden,
          contenido: "Comienza a escribir esta nueva crónica..." 
        }]);

      if (error) throw error;
      
      setShowModal(false);
      setNuevoTitulo("");
      // Recarga suave: En lugar de reload completo, podrías re-ejecutar el fetch.
      window.location.reload();
    } catch (err) {
      alert("No se pudo crear el capítulo: " + err.message);
    } finally {
      setCreando(false);
    }
  };

  const deleteCapitulo = async (e, capId) => {
    e.stopPropagation();
    if (!confirm("¿Seguro que quieres borrar este capítulo?")) return;

    try {
      const { error } = await supabase
        .from('capitulos')
        .delete()
        .eq('id', capId);

      if (error) throw error;
      window.location.reload();
    } catch (err) {
      alert("Error al borrar: " + err.message);
    }
  };

  // VISTA DE ERROR
  if (error) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#FDFCFD] p-6 text-center">
      <h2 className="text-[#6B5E70] font-black uppercase tracking-widest mb-4">"Error de Acceso"</h2>
      <p className="text-[#6B5E70]/50 italic mb-8">{error}</p>
      <button onClick={() => router.push('/libros')} className="text-[10px] font-black uppercase underline tracking-widest text-[#6B5E70]">
        Regresar
      </button>
    </div>
  );

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#FDFCFD]">
      <div className="animate-pulse text-[#6B5E70] font-black uppercase text-[10px] tracking-[0.3em]">
        "Consultando archivos..."
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFCFD] pb-20 relative">
      {/* ... (Resto de tu JSX se mantiene igual) ... */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-[#6B5E70]/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-2xl border border-[#6B5E70]/10 relative z-10"
            >
              <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-[#6B5E70]/20 hover:text-[#6B5E70]">
                <X size={20} />
              </button>
              <div className="text-center mb-8">
                <h3 className="text-[#6B5E70] font-black uppercase text-[10px] tracking-[0.3em]">"Nuevo Capítulo"</h3>
              </div>
              <form onSubmit={handleCrearCapitulo} className="space-y-6">
                <input 
                  autoFocus type="text" placeholder="TÍTULO..." value={nuevoTitulo}
                  onChange={(e) => setNuevoTitulo(e.target.value)}
                  className="w-full bg-[#FDFCFD] border-b-2 border-[#6B5E70]/10 py-4 text-center text-sm font-black text-[#6B5E70] outline-none focus:border-[#6B5E70] uppercase"
                />
                <button disabled={creando} type="submit" className="w-full bg-[#6B5E70] text-white py-4 rounded-2xl font-black uppercase text-[10px]">
                  {creando ? "Sellando..." : "Revelar Capítulo"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <button onClick={() => router.push('/libros')} className="p-8 text-[#6B5E70]/40 hover:text-[#6B5E70] flex items-center gap-2 font-black text-[10px] uppercase transition-all group">
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> "Volver a la Biblioteca"
      </button>

      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-[320px_1fr] gap-16 mt-4">
        <aside className="flex flex-col gap-8">
          <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl border border-[#6B5E70]/10 bg-white">
            <img src={libro?.portada_url || "/placeholder-cover.jpg"} alt={libro?.titulo} className="w-full h-full object-cover" />
          </div>
        </aside>

        <main>
          <div className="mb-12">
            <h1 className="text-5xl font-black text-[#6B5E70] italic tracking-tighter leading-[0.9] mb-6 uppercase">{libro?.titulo}</h1>
            <p className="text-[#6B5E70]/70 leading-relaxed text-lg font-medium italic">"{libro?.sinopsis}"</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between mb-8 border-b border-[#6B5E70]/10 pb-4">
              <h3 className="text-[#6B5E70] font-black uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
                <ListOrdered size={16} /> Índice
              </h3>
              {isAdmin && (
                <button onClick={() => setShowModal(true)} className="bg-[#6B5E70] text-white p-2 rounded-full shadow-lg">
                  <Plus size={16} />
                </button>
              )}
            </div>
            
            <div className="grid gap-3">
              {capitulos.map((cap) => (
                <div key={cap.id} className="relative group">
                  <button 
                    onClick={() => router.push(`/libros/${id}/leer/${cap.id}`)}
                    className="w-full flex items-center justify-between p-6 bg-white border border-[#6B5E70]/5 rounded-3xl hover:border-[#6B5E70]/20 transition-all"
                  >
                    <span className="text-[#6B5E70] font-black uppercase text-[12px]">{cap.orden}. {cap.titulo_capitulo}</span>
                    <Play size={14} fill="currentColor" className="text-[#6B5E70]" />
                  </button>
                  {isAdmin && (
                    <button onClick={(e) => deleteCapitulo(e, cap.id)} className="absolute right-16 top-1/2 -translate-y-1/2 p-2 text-red-300">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}