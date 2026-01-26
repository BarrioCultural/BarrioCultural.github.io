"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Book, ChevronRight, Clock, Plus, Edit3, X, Save, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Biblioteca = () => {
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Modales
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Campos de formulario
  const [selectedLibro, setSelectedLibro] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [nuevoTitulo, setNuevoTitulo] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const checkUserAndFetch = async () => {
      // Verificación de sesión real
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setIsAdmin(true);

      const { data, error } = await supabase
        .from('libros')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error) setLibros(data);
      setLoading(false);
    };
    checkUserAndFetch();
  }, []);

  // --- LÓGICA DE EDICIÓN ---
  const openEditModal = (e, libro) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedLibro(libro);
    setEditTitle(libro.titulo);
    setShowEditModal(true);
  };

  const handleUpdateLibro = async (e) => {
    e.preventDefault();
    if (!editTitle.trim() || isUpdating) return;
    setIsUpdating(true);
    const { error } = await supabase.from('libros').update({ titulo: editTitle.toUpperCase() }).eq('id', selectedLibro.id);
    if (!error) {
      setLibros(libros.map(l => l.id === selectedLibro.id ? { ...l, titulo: editTitle.toUpperCase() } : l));
      setShowEditModal(false);
    }
    setIsUpdating(false);
  };

  // --- LÓGICA DE CREACIÓN ---
  const handleAddLibro = async (e) => {
    e.preventDefault();
    if (!nuevoTitulo.trim() || isUpdating) return;
    setIsUpdating(true);
    const { data, error } = await supabase.from('libros').insert([{ 
      titulo: nuevoTitulo.toUpperCase(),
      sinopsis: "Nueva crónica por escribir...",
      estado: "EN PROCESO"
    }]).select();

    if (!error) {
      setLibros([data[0], ...libros]);
      setShowAddModal(false);
      setNuevoTitulo("");
    }
    setIsUpdating(false);
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#FDFCFD] text-[#6B5E70] font-black uppercase text-[10px] tracking-[0.3em]">"Abriendo Archivos..."</div>;

  return (
    <div className="min-h-screen bg-[#FDFCFD] pb-20">
      
      {/* MODAL: EDITAR */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowEditModal(false)} className="absolute inset-0 bg-[#6B5E70]/20 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-2xl relative z-10 border border-[#6B5E70]/10">
              <button onClick={() => setShowEditModal(false)} className="absolute top-8 right-8 text-[#6B5E70]/20 hover:text-[#6B5E70]"><X size={20} /></button>
              <h3 className="text-center text-[#6B5E70] font-black uppercase text-[10px] tracking-[0.3em] mb-8">"Editar Título"</h3>
              <form onSubmit={handleUpdateLibro} className="space-y-6">
                <input autoFocus type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full bg-[#FDFCFD] border-b-2 border-[#6B5E70]/10 py-4 text-center text-sm font-black text-[#6B5E70] outline-none focus:border-[#6B5E70] uppercase" />
                <button type="submit" className="w-full bg-[#6B5E70] text-white py-4 rounded-2xl font-black uppercase text-[10px] shadow-lg">{isUpdating ? "Guardando..." : "Actualizar"}</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: AÑADIR NUEVO */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-[#6B5E70]/20 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-2xl relative z-10 border border-[#6B5E70]/10">
              <button onClick={() => setShowAddModal(false)} className="absolute top-8 right-8 text-[#6B5E70]/20 hover:text-[#6B5E70]"><X size={20} /></button>
              <h3 className="text-center text-[#6B5E70] font-black uppercase text-[10px] tracking-[0.3em] mb-8">"Nueva Crónica"</h3>
              <form onSubmit={handleAddLibro} className="space-y-6">
                <input autoFocus type="text" placeholder="TÍTULO..." value={nuevoTitulo} onChange={(e) => setNuevoTitulo(e.target.value)} className="w-full bg-[#FDFCFD] border-b-2 border-[#6B5E70]/10 py-4 text-center text-sm font-black text-[#6B5E70] outline-none focus:border-[#6B5E70] uppercase" />
                <button type="submit" className="w-full bg-[#6B5E70] text-white py-4 rounded-2xl font-black uppercase text-[10px] shadow-lg">Crear Libro</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ENCABEZADO */}
      <div className="max-w-6xl mx-auto pt-16 px-6 mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-[#6B5E70] italic tracking-tighter flex items-center gap-3"><Book size={32} /> "BIBLIOTECA"</h1>
          <p className="text-[#6B5E70]/50 text-xs font-bold uppercase tracking-widest mt-2">"Explora las crónicas del mundo"</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowAddModal(true)} className="bg-[#6B5E70] text-white p-4 rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all z-50">
            <Plus size={24} />
          </button>
        )}
      </div>

      {/* GRID DE LIBROS */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {libros.map((libro) => (
          <div key={libro.id} className="relative group">
            {isAdmin && (
              <button 
                onClick={(e) => openEditModal(e, libro)}
                className="absolute top-4 right-4 z-[60] bg-white/90 backdrop-blur-md text-[#6B5E70] p-3 rounded-full shadow-lg border border-[#6B5E70]/10 hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
              >
                <Edit3 size={18} />
              </button>
            )}
            <Link href={`/libros/${libro.id}`}>
              <motion.div whileHover={{ y: -10 }} className="cursor-pointer">
                <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-xl border border-[#6B5E70]/10 bg-white">
                  <img src={libro.portada_url || "/placeholder-cover.jpg"} alt={libro.titulo} className="w-full h-full object-cover" />
                  <div className="absolute top-6 left-6 bg-white/90 px-4 py-1.5 rounded-full border border-[#6B5E70]/10">
                    <span className="text-[9px] font-black uppercase text-[#6B5E70]">{libro.estado}</span>
                  </div>
                </div>
                <div className="mt-6 px-4">
                  <h2 className="text-[#6B5E70] font-black uppercase text-base group-hover:text-[#9A89A0] transition-colors">{libro.titulo}</h2>
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