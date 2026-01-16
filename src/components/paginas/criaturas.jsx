"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Footprints, X } from 'lucide-react';

const Criaturas = () => {
  const [criaturas, setCriaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos');
  const [selected, setSelected] = useState(null);

  const categorias = ['todos', 'terrestres', 'voladoras', 'acuáticas'];

  useEffect(() => {
    const fetchCriaturas = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('criaturas')
          .select('id, imagen_url, nombre, categoria, descripcion') 
          .order('nombre', { ascending: true });

        if (error) throw error;
        setCriaturas(data || []);
      } catch (err) {
        console.error("Error en fetch:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCriaturas();
  }, []);

  const criaturasFiltradas = useMemo(() => {
    if (!criaturas) return [];
    if (filtro === 'todos') return criaturas;
    return criaturas.filter(c => 
      c && c.categoria && c.categoria.toLowerCase() === filtro.toLowerCase()
    );
  }, [criaturas, filtro]);

  const handleSelect = (c) => {
    setSelected(selected?.id === c.id ? null : c);
    // Hacemos scroll al inicio para que el panel aparezca arriba del todo
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-bg-main pb-20">
      
      {/* HEADER COMPLETO: Se esconde si hay algo seleccionado */}
      <AnimatePresence>
        {!selected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <header className="relative z-40 pt-20 mb-6 px-4 text-center">
              <div className="flex justify-center mb-4">
                  <div className="p-3 bg-[#6B5E70]/5 rounded-full border border-[#6B5E70]/10 text-[#6B5E70]">
                      <Footprints size={32} />
                  </div>
              </div>
              <h1 className="text-4xl font-black italic tracking-tighter text-[#6B5E70] uppercase">
                Bestiario
              </h1>
              <p className="mt-2 text-[#6B5E70]/60 font-medium italic">
                Criaturas y entidades descubiertas
              </p>
            </header>

            {/* FILTROS */}
            <div className="flex justify-center gap-2 mb-12 px-4 flex-wrap">
              {categorias.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFiltro(cat)}
                  className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${
                    filtro === cat 
                    ? 'bg-[#6B5E70] text-white border-[#6B5E70] shadow-lg scale-105' 
                    : 'bg-white/40 text-[#6B5E70]/40 border-[#6B5E70]/10 hover:border-[#6B5E70]/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PANEL DE INFORMACIÓN DESPLEGABLE (Ahora aparecerá arriba del todo) */}
      <AnimatePresence mode="wait">
        {selected && (
          <motion.div
            key="info-panel-criatura"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white/80 backdrop-blur-xl overflow-hidden shadow-2xl border-b border-[#6B5E70]/10 relative mb-12"
          >
            <div className="p-6 md:p-12 max-w-7xl mx-auto flex flex-col md:flex-row gap-8 md:gap-16 items-center">
              
              <motion.div 
                initial={{ scale: 0.9, rotate: -2 }}
                animate={{ scale: 1, rotate: 0 }}
                className="w-full md:w-[450px] aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl shrink-0 bg-[#6B5E70]/5 border border-[#6B5E70]/10"
              >
                <img src={selected.imagen_url} className="w-full h-full object-cover" alt={selected.nombre} />
              </motion.div>

              <div className="flex-1 relative w-full">
                <button 
                  onClick={() => setSelected(null)} 
                  className="absolute -top-6 right-0 md:top-0 p-3 bg-white rounded-full text-[#6B5E70] shadow-md hover:bg-[#6B5E70] hover:text-white transition-all z-50"
                >
                  <X size={20} />
                </button>
                
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-[#6B5E70] text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full">
                    Categoría: {selected.categoria}
                  </span>
                </div>

                <h2 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter text-[#6B5E70] mb-6 leading-none">
                  {selected.nombre}
                </h2>
                
                <p className="text-xl md:text-2xl text-[#6B5E70]/80 font-medium leading-snug border-l-8 border-[#6B5E70] pl-8 italic">
                  {selected.descripcion}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GRID DE CRIATURAS */}
      <section className="max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-60 gap-4">
            <div className="w-8 h-8 border-4 border-[#6B5E70]/20 border-t-[#6B5E70] rounded-full animate-spin"></div>
            <p className="text-[#6B5E70]/50 animate-pulse text-xs font-black uppercase tracking-widest">Rastreando huellas...</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {criaturasFiltradas.length > 0 ? (
              criaturasFiltradas.map((criatura) => (
                <motion.div
                  key={criatura.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => handleSelect(criatura)}
                  className={`group relative aspect-[3/4] cursor-pointer transition-all duration-500 overflow-hidden
                    ${selected?.id === criatura.id 
                      ? 'rounded-[3rem] ring-8 ring-[#6B5E70] z-20 scale-95 shadow-2xl' 
                      : 'rounded-2xl grayscale hover:grayscale-0 shadow-md'
                    }`}
                >
                  <img 
                    src={criatura.imagen_url || ''} 
                    className="w-full h-full object-cover" 
                    alt={criatura.nombre} 
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-[#6B5E70]/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                  <div className="absolute bottom-4 left-4 right-4 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                      <p className="text-[8px] font-black text-white/70 uppercase tracking-widest mb-1">
                          {criatura.categoria}
                      </p>
                      <h3 className="text-lg font-black text-white uppercase italic tracking-tighter leading-none">
                          {criatura.nombre}
                      </h3>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-[#6B5E70]/40 font-black uppercase text-[10px] tracking-[0.3em]">
                  No se han avistado criaturas en esta región.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </section>

      <div className="h-24"></div>
    </main>
  );
};

export default Criaturas;