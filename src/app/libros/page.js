"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Book, ChevronRight, Clock, Plus, Edit3, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Biblioteca = () => {
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Estados para el Modal de Edición
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLibro, setSelectedLibro] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchLibros = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setIsAdmin(true);

      const { data, error } = await supabase
        .from('libros')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error) setLibros(data);
      setLoading(false);
    };
    fetchLibros();
  }, []);

  const openEditModal = (e, libro) => {
    e.preventDefault();
    setSelectedLibro(libro);
    setEditTitle(libro.titulo);
    setShowEditModal(true);
  };

  const handleUpdateLibro = async (e) => {
    e.preventDefault();
    if (!editTitle.trim() || isUpdating) return;

    setIsUpdating(true);
    const { error } = await supabase
      .from('libros')
      .update({ titulo: editTitle.toUpperCase() })
      .eq('id', selectedLibro.id);

    if (error) {
      alert("Error: " + error.message);
    } else {
      setShowEditModal(false);
      // Actualización optimista del estado local
      setLibros(libros.map(l => l.id === selectedLibro.id ? { ...l, titulo: editTitle.toUpperCase() } : l));
    }
    setIsUpdating(false);
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#FDFCFD]">
      <div className="animate-pulse text-[#6B5E70] font-black uppercase text-[10px] tracking-[0.3em]">
        "Abriendo Archivos..."
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFCFD] pb-20">
      
      {/* MODAL DE EDICIÓN ESTILIZADO */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowEditModal(false)}
              className="absolute inset-0 bg-[#6B5E70]/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-2xl border border-[#6B5E70]/10 relative z-10"
            >
              <button onClick={() => setShowEditModal(false)} className="absolute top-8 right-8 text-[#6B5E70]/20 hover:text-[#6B5E70]">
                <X size={20} />
              </button>
              
              <div className="text-center mb-8">
                <h3 className="text-[#6B5E70] font-black uppercase text-[10px] tracking-[0.3em]">"Editar Crónica"</h3>
              </div>

              <form onSubmit={handleUpdateLibro} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#6B5E70]/40 uppercase ml-2">Título del Libro</label>
                  <input 
                    autoFocus type="text" value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-[#FDFCFD] border-b-2 border-[#6B5E70]/10 py-4 text-center text-sm font-black text-[#6B5E70] outline-none focus:border-[#6B5E70] uppercase transition-colors"
                  />
                </div>
                <button 
                  disabled={isUpdating} 
                  type="submit" 
                  className="w-full bg-[#6B5E70] text-white py-4 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-2 hover:bg-[#5A4F5E] transition-colors shadow-lg shadow-[#6B5E70]/20"
                >
                  {isUpdating ? "Guardando..." : <><Save size={14} /> "Actualizar Registro"</>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Encabezado */}
      <div className="max-w-6xl mx-auto pt-16 px-6 mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-[#6B5E70] italic tracking-tighter flex items-center gap-3">
            <Book size={32} /> "BIBLIOTECA"
          </h1>
          <p className="text-[#6B5E70]/50 text-xs font-bold uppercase tracking-widest mt-2">
            "Explora las crónicas y relatos del mundo"
          </p>
        </div>

        {isAdmin && (
          <button className="bg-[#6B5E70] text-white p-3 rounded-full shadow-xl hover:scale-110 transition-transform">
            <Plus size={24} />
          </button>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {libros.map((libro) => (
          <div key={libro.id} className="relative group">
            
            {/* Botón de edición que activa el Modal */}
            {isAdmin && (
              <button 
                onClick={(e) => openEditModal(e, libro)}
                className="absolute top-4 right-4 z-30 bg-white/90 backdrop-blur-md text-[#6B5E70] p-3 rounded-full shadow-lg border border-[#6B5E70]/10 hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
              >
                <Edit3 size={18} />
              </button>
            )}

            <Link href={`/libros/${libro.id}`}>
              <motion.div whileHover={{ y: -10 }} className="cursor-pointer">
                <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-xl border border-[#6B5E70]/10 bg-white">
                  <img 
                    src={libro.portada_url || "/placeholder-cover.jpg"} 
                    alt={libro.titulo}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#6B5E70]/10">
                    <span className="text-[9px] font-black uppercase text-[#6B5E70] tracking-widest">
                      {libro.estado}
                    </span>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-[#6B5E70] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                    <p className="text-white text-[13px] leading-relaxed line-clamp-4 italic opacity-90 font-medium">
                      "{libro.sinopsis}"
                    </p>
                  </div>
                </div>

                <div className="mt-6 px-4">
                  <h2 className="text-[#6B5E70] font-black uppercase text-base group-hover:text-[#9A89A0] transition-colors leading-tight tracking-tight">
                    {libro.titulo}
                  </h2>
                  <div className="flex items-center gap-4 mt-3 text-[#6B5E70]/40 font-bold text-[9px] uppercase tracking-[0.2em]">
                    <span className="flex items-center gap-1.5"><Clock size={12} /> Reciente</span>
                    <span className="flex items-center gap-1.5 text-[#6B5E70]/60"><ChevronRight size={12} /> Leer ahora</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Biblioteca;