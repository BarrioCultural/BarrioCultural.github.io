"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Footprints, X } from 'lucide-react';

export default function Criaturas() {
  const [criaturas, setCriaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos');
  const [selected, setSelected] = useState(null);

  const categorias = ['todos', 'terrestres', 'voladoras', 'acuáticas'];

  useEffect(() => {
    const fetchCriaturas = async () => {
      setLoading(true);
      const { data } = await supabase.from('criaturas').select('*').order('nombre', { ascending: true });
      if (data) setCriaturas(data);
      setLoading(false);
    };
    fetchCriaturas();
  }, []);

  const filtradas = useMemo(() => {
    return filtro === 'todos' ? criaturas : criaturas.filter(c => c.categoria?.toLowerCase() === filtro.toLowerCase());
  }, [criaturas, filtro]);

  return (
    <main className="min-h-screen bg-[#EBEBEB] pb-20 pt-10">
      <AnimatePresence>
        {!selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <header className="relative z-40 mb-6 px-4 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-[#6B5E70]/5 rounded-full border border-[#6B5E70]/10 text-[#6B5E70]"><Footprints size={32} /></div>
              </div>
              <h1 className="text-4xl font-black italic tracking-tighter text-[#6B5E70] uppercase">Bestiario</h1>
              <p className="mt-2 text-[#6B5E70]/60 font-medium italic">Criaturas y entidades descubiertas</p>
            </header>
            <div className="flex justify-center gap-2 mb-12 px-4 flex-wrap">
              {categorias.map(cat => (
                <button key={cat} onClick={() => setFiltro(cat)} className={`filter-pill ${filtro === cat ? 'filter-pill-active' : 'filter-pill-inactive'}`}>{cat}</button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {selected && (
          <motion.div key="panel" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lore-panel mb-12">
            <div className="lore-panel-layout">
              <button onClick={() => setSelected(null)} className="btn-close-panel"><X size={24} /></button>
              <div className="lore-image-container"><img src={selected.imagen_url} alt={selected.nombre} /></div>
              <div className="lore-content">
                <span className="px-4 py-1 bg-[#6B5E70] text-white text-[10px] font-black uppercase rounded-full tracking-widest">Categoría: {selected.categoria}</span>
                <h2 className="text-5xl md:text-8xl font-black uppercase italic text-[#6B5E70] mt-4 leading-none tracking-tighter">{selected.nombre}</h2>
                <p className="lore-description italic">{selected.descripcion}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="py-20 text-center animate-pulse text-[#6B5E70] font-black uppercase text-xs">Rastreando huellas...</div>
        ) : (
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {filtradas.map(c => (
              <motion.div key={c.id} layout onClick={() => { setSelected(c); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`char-card group ${selected?.id === c.id ? 'char-card-selected' : ''}`}>
                <img src={c.imagen_url} className="w-full h-full object-cover" alt={c.nombre} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#6B5E70]/90 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute bottom-4 left-4 right-4 translate-y-2 group-hover:translate-y-0 transition-all">
                  <p className="text-[8px] font-black text-white/70 uppercase tracking-widest">{c.categoria}</p>
                  <h3 className="text-lg font-black text-white uppercase italic leading-none">{c.nombre}</h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </main>
  );
}