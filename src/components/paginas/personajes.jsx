"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function PureGridLore() {
  const [personajes, setPersonajes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [reinos, setReinos] = useState(['TODOS']);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('TODOS');

  useEffect(() => {
    const fetchLore = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('personajes')
          .select('*')
          .order('id', { ascending: true });
        
        if (data) {
          setPersonajes(data);
          setFiltered(data);
          const reinosExtraidos = data.map(p => p.reino).filter(Boolean);
          setReinos(['TODOS', ...new Set(reinosExtraidos)]);
        }
        if (error) throw error;
      } catch (err) {
        console.error("Error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLore();
  }, []);

  useEffect(() => {
    setFiltered(activeFilter === 'TODOS' 
      ? personajes 
      : personajes.filter(p => p.reino === activeFilter)
    );
  }, [activeFilter, personajes]);

  const handleSelect = (p) => {
    setSelected(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#EBEBEB] pb-20">
      {/* HEADER CON FILTROS */}
      <AnimatePresence>
        {!selected && (
          <motion.header 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: "auto" }} 
            exit={{ opacity: 0, height: 0 }} 
            className="bg-[#EBEBEB] border-b border-zinc-200 overflow-hidden"
          >
            <div className="p-8 max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-end gap-6">
              <div>
                <h1 className="text-4xl font-black italic text-[#6B5E70] uppercase tracking-tighter">Personajes</h1>
                <p className="text-[#6B5E70]/60 italic text-sm font-medium">Habitantes registrados: {filtered.length}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {reinos.map(r => (
                  <button 
                    key={r} 
                    onClick={() => setActiveFilter(r)} 
                    className={`filter-pill ${activeFilter === r ? 'filter-pill-active' : 'filter-pill-inactive'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* PANEL DE DETALLE */}
      <AnimatePresence mode="wait">
        {selected && (
          <motion.div key="panel" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lore-panel">
            <div className="lore-panel-layout">
              <button onClick={() => setSelected(null)} className="btn-close-panel"><X size={24} /></button>
              
              <div className="lore-image-container">
                <img src={selected.img_url} alt={selected.nombre} />
              </div>

              <div className="lore-content">
                <span className="px-4 py-1 bg-[#6B5E70] text-white text-[10px] font-black uppercase rounded-full tracking-widest">
                  Reino: {selected.reino}
                </span>
                <h2 className="text-5xl md:text-8xl font-black uppercase italic text-zinc-900 mt-4 leading-none tracking-tighter">
                  {selected.nombre}
                </h2>
                <p className="lore-description">{selected.sobre}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GRID DE TARJETAS */}
      <main className="p-8 max-w-[1600px] mx-auto">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center gap-4">
             <div className="w-10 h-10 border-4 border-[#6B5E70]/20 border-t-[#6B5E70] rounded-full animate-spin"></div>
             <p className="text-[#6B5E70] font-black uppercase text-xs tracking-widest animate-pulse">Sincronizando Archivos...</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filtered.map(p => (
              <motion.div 
                key={p.id} 
                layout 
                onClick={() => handleSelect(p)} 
                className={`char-card group ${selected?.id === p.id ? 'char-card-selected' : ''}`}
              >
                <img src={p.img_url} className="w-full h-full object-cover" alt={p.nombre} />
                <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="badge-reino">{p.reino}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                <p className="absolute bottom-4 left-4 text-white text-[11px] font-black uppercase">{p.nombre}</p>
                <div className="absolute top-0 w-full h-1" style={{ backgroundColor: p.color_hex || '#6B5E70' }} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}