"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const PureGridLore = () => {
  const [personajes, setPersonajes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('TODOS');

  const reinos = ['TODOS', 'Caelistan', 'Omnisia', 'Froslia', 'Torres'];

  useEffect(() => {
    const fetchLore = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('personajes')
        .select('*')
        .order('id', { ascending: true });
      
      if (data) {
        setPersonajes(data);
        setFiltered(data);
      }
      if (error) console.error("Error:", error.message);
      setLoading(false);
    };
    fetchLore();
  }, []);

  useEffect(() => {
    if (activeFilter === 'TODOS') {
      setFiltered(personajes);
    } else {
      setFiltered(personajes.filter(p => p.reino === activeFilter));
    }
  }, [activeFilter, personajes]);

  const handleSelect = (p) => {
    setSelected(selected?.id === p.id ? null : p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#EBEBEB] font-sans pb-20">
      
      {/* HEADER DINÁMICO: Desaparece al seleccionar */}
      <AnimatePresence>
        {!selected && (
          <motion.header 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="relative z-40 bg-[#EBEBEB] border-b border-zinc-200 overflow-hidden"
          >
            <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h1 className="text-3xl md:text-5xl font-black tracking-tighter italic text-[#6B5E70] uppercase leading-none">
                    Personajes
                  </h1>
                  <p className="mt-2 text-[#6B5E70]/60 font-medium italic text-sm">
                    Registro de habitantes
                  </p>
                </div>

                {/* SELECTOR DE FILTROS */}
                <div className="flex flex-wrap gap-2">
                  {reinos.map((reino) => (
                    <button
                      key={reino}
                      onClick={() => setActiveFilter(reino)}
                      className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${
                        activeFilter === reino 
                        ? 'bg-[#6B5E70] text-white border-[#6B5E70] shadow-lg scale-105' 
                        : 'bg-white/40 text-[#6B5E70]/40 border-[#6B5E70]/10 hover:border-[#6B5E70]/30 hover:bg-white/60'
                      }`}
                    >
                      {reino}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* PANEL DE INFORMACIÓN (Aparece arriba del todo) */}
      <AnimatePresence mode="wait">
        {selected && (
          <motion.div
            key="info-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white overflow-hidden shadow-2xl border-b border-zinc-300 relative"
          >
            <div className="p-6 md:p-12 max-w-7xl mx-auto flex flex-col md:flex-row gap-8 md:gap-16 items-center">
              
              <motion.div 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="w-full md:w-[450px] aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl shrink-0 bg-zinc-100"
              >
                <img src={selected.img_url} className="w-full h-full object-cover" alt={selected.nombre} />
              </motion.div>

              <div className="flex-1 relative w-full">
                {/* Botón X ajustado para la parte superior */}
                <button 
                  onClick={() => setSelected(null)} 
                  className="absolute -top-6 right-0 md:top-0 p-3 bg-zinc-100 rounded-full text-[#6B5E70] hover:bg-[#6B5E70] hover:text-white transition-all z-50 shadow-sm"
                >
                  <X size={20} />
                </button>
                
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-[#6B5E70] text-white text-[9px] font-black uppercase tracking-widest rounded-full">
                    Reino: {selected.reino || 'Desconocido'}
                  </span>
                </div>

                <h2 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter text-zinc-900 mb-6 leading-none">
                  {selected.nombre}
                </h2>
                
                <p className="text-xl md:text-2xl text-zinc-700 font-medium leading-snug border-l-8 border-[#6B5E70] pl-8">
                  {selected.sobre}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GRID FILTRADO */}
      <main className="p-4 md:p-8 max-w-[1600px] mx-auto">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 gap-4">
            <div className="w-8 h-8 border-4 border-[#6B5E70]/20 border-t-[#6B5E70] rounded-full animate-spin"></div>
            <p className="text-[#6B5E70]/50 animate-pulse text-xs font-black uppercase tracking-widest">
              Accediendo a la base de datos...
            </p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filtered.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => handleSelect(p)}
                className={`relative aspect-[3/4] cursor-pointer overflow-hidden transition-all duration-500 group
                  ${selected?.id === p.id 
                    ? 'rounded-[3rem] ring-8 ring-[#6B5E70] z-20 scale-95 shadow-2xl' 
                    : 'rounded-2xl grayscale hover:grayscale-0'
                  }`}
              >
                <img src={p.img_url} className="w-full h-full object-cover" alt={p.nombre} />
                
                <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-white/90 backdrop-blur-sm text-[#6B5E70] text-[7px] font-black px-2 py-1 rounded uppercase tracking-tighter">
                    {p.reino}
                  </span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                
                <div className="absolute bottom-4 left-4">
                  <p className="text-white text-[11px] font-black uppercase tracking-tighter leading-none">
                    {p.nombre}
                  </p>
                </div>

                <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: p.color_hex || '#6B5E70' }} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default PureGridLore;