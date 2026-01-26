"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Book, ChevronRight, Clock, Plus, Edit3 } from 'lucide-react'; // Añadimos iconos
import { motion } from 'framer-motion';

const Biblioteca = () => {
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // Estado para detectar si eres tú

  useEffect(() => {
    const fetchLibros = async () => {
      // 1. Verificar si hay un usuario logueado
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setIsAdmin(true);

      // 2. Traer los libros
      const { data, error } = await supabase
        .from('libros')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error) setLibros(data);
      setLoading(false);
    };
    fetchLibros();
  }, []);

  // Función rápida para editar el estado o título (Prueba desde celular)
  const quickEdit = async (e, id) => {
    e.preventDefault(); // Evita que el Link se active
    const nuevoTitulo = prompt("Nuevo título del libro:");
    if (!nuevoTitulo) return;

    const { error } = await supabase
      .from('libros')
      .update({ titulo: nuevoTitulo })
      .eq('id', id);

    if (error) alert("Error: " + error.message);
    else window.location.reload(); 
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-[#6B5E70] uppercase font-black text-[10px] tracking-widest">"Abriendo Archivos..."</div>;

  return (
    <div className="min-h-screen bg-[#FDFCFD] pb-20">
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

        {/* BOTÓN MÁGICO: Solo visible para ti */}
        {isAdmin && (
          <button className="bg-[#6B5E70] text-white p-3 rounded-full shadow-xl hover:scale-110 transition-transform">
            <Plus size={24} />
          </button>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {libros.map((libro) => (
          <div key={libro.id} className="relative group">
            
            {/* BOTÓN EDITAR RÁPIDO: Solo para ti */}
            {isAdmin && (
              <button 
                onClick={(e) => quickEdit(e, libro.id)}
                className="absolute top-2 right-2 z-30 bg-yellow-400 text-black p-2 rounded-full shadow-md hover:bg-yellow-300"
              >
                <Edit3 size={16} />
              </button>
            )}

            <Link href={`/libros/${libro.id}`}>
              <motion.div whileHover={{ y: -10 }} className="cursor-pointer">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border border-[#6B5E70]/10 bg-white">
                  <img 
                    src={libro.portada_url || "/placeholder-cover.jpg"} 
                    alt={libro.titulo}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#6B5E70]/10">
                    <span className="text-[8px] font-black uppercase text-[#6B5E70] tracking-tighter">
                      {libro.estado}
                    </span>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-[#6B5E70] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <p className="text-white text-xs leading-relaxed line-clamp-3 italic opacity-90">
                      "{libro.sinopsis}"
                    </p>
                  </div>
                </div>

                <div className="mt-4 px-2">
                  <h2 className="text-[#6B5E70] font-black uppercase text-sm group-hover:text-[#9A89A0] transition-colors leading-tight">
                    {libro.titulo}
                  </h2>
                  <div className="flex items-center gap-4 mt-2 text-[#6B5E70]/40 font-bold text-[9px] uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Clock size={10} /> Reciente</span>
                    <span className="flex items-center gap-1"><ChevronRight size={10} /> Leer ahora</span>
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