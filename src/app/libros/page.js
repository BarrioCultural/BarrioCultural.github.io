"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Book, ChevronRight, Clock, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const Biblioteca = () => {
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLibros = async () => {
      const { data, error } = await supabase
        .from('libros')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error) setLibros(data);
      setLoading(false);
    };
    fetchLibros();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center text-[#6B5E70] uppercase font-black text-[10px] tracking-widest">Abriendo Archivos...</div>;

  return (
    <div className="min-h-screen bg-[#FDFCFD] pb-20">
      {/* Encabezado de la Sección */}
      <div className="max-w-6xl mx-auto pt-16 px-6 mb-12">
        <h1 className="text-4xl font-black text-[#6B5E70] italic tracking-tighter flex items-center gap-3">
          <Book size={32} /> BIBLIOTECA
        </h1>
        <p className="text-[#6B5E70]/50 text-xs font-bold uppercase tracking-widest mt-2">
          Explora las crónicas y relatos del mundo
        </p>
      </div>

      {/* Grid de Libros */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {libros.map((libro) => (
          <Link href={`/libros/${libro.id}`} key={libro.id}>
            <motion.div 
              whileHover={{ y: -10 }}
              className="group cursor-pointer"
            >
              {/* Contenedor de la Portada con efecto de libro */}
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border border-[#6B5E70]/10 bg-white">
                <img 
                  src={libro.portada_url || "/placeholder-cover.jpg"} 
                  alt={libro.titulo}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Badge de Estado */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#6B5E70]/10">
                  <span className="text-[8px] font-black uppercase text-[#6B5E70] tracking-tighter">
                    {libro.estado}
                  </span>
                </div>

                {/* Info Overlay al hacer Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#6B5E70] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <p className="text-white text-xs leading-relaxed line-clamp-3 italic opacity-90">
                    "{libro.sinopsis}"
                  </p>
                </div>
              </div>

              {/* Título y Detalles */}
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
        ))}
      </div>
    </div>
  );
};

export default Biblioteca;