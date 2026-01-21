"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Footprints, X, ChevronDown } from 'lucide-react';

export default function Criaturas() {
  const [criaturas, setCriaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const [filtros, setFiltros] = useState({
    habitat: 'todos',
    pensamiento: 'todos',
    alma: 'todos'
  });

  const configFiltros = {
    habitat: ['todos', 'terrestre', 'acuática', 'voladora'],
    pensamiento: ['todos', 'pensante', 'salvaje'],
    alma: ['todos', 'normal', 'divina', 'impura', 'salvaje']
  };

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
    return criaturas.filter(c => {
      const h = filtros.habitat === 'todos' || c.habitat?.toLowerCase() === filtros.habitat.toLowerCase();
      const p = filtros.pensamiento === 'todos' || c.pensamiento?.toLowerCase() === filtros.pensamiento.toLowerCase();
      const a = filtros.alma === 'todos' || c.alma?.toLowerCase() === filtros.alma.toLowerCase();
      return h && p && a;
    });
  }, [criaturas, filtros]);

  const toggleDropdown = (name) => setActiveDropdown(activeDropdown === name ? null : name);

  const seleccionarFiltro = (grupo, valor) => {
    setFiltros(prev => ({ ...prev, [grupo]: valor }));
    setActiveDropdown(null);
  };

  return (
    <main className="min-h-screen bg-[#EBEBEB] pb-20 pt-10">
      {/* HEADER Y FILTROS */}
      <AnimatePresence>
        {!selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <header className="relative z-40 mb-10 px-4 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-[#6B5E70]/5 rounded-full border border-[#6B5E70]/10 text-[#6B5E70]">
                  <Footprints size={32} />
                </div>
              </div>
              <h1 className="text-4xl font-black italic tracking-tighter text-[#6B5E70] uppercase">Bestiario</h1>
              <p className="mt-2 text-[#6B5E70]/60 font-medium italic">Explora las entidades registradas</p>
            </header>

            <div className="flex flex-wrap justify-center gap-4 mb-16 px-4 relative z-50">
              {Object.entries(configFiltros).map(([grupo, opciones]) => (
                <div key={grupo} className="relative">
                  <button
                    onClick={() => toggleDropdown(grupo)}
                    className={`flex items-center gap-3 px-6 py-3 rounded-full border transition-all text-[11px] font-black uppercase tracking-widest ${
                      filtros[grupo] !== 'todos' 
                      ? 'bg-[#6B5E70] text-white border-[#6B5E70]' 
                      : 'bg-white text-[#6B5E70] border-[#6B5E70]/20 hover:border-[#6B5E70]/40'
                    }`}
                  >
                    <span className="opacity-60">{grupo}:</span>
                    <span>{filtros[grupo]}</span>
                    <ChevronDown size={14} className={`transition-transform ${activeDropdown === grupo ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {activeDropdown === grupo && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-[#6B5E70]/10 overflow-hidden py-2 z-[60]"
                      >
                        {opciones.map(opt => (
                          <button
                            key={opt}
                            onClick={() => seleccionarFiltro(grupo, opt)}
                            className={`w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-wider transition-colors ${
                              filtros[grupo] === opt 
                              ? 'bg-[#6B5E70]/10 text-[#6B5E70]' 
                              : 'text-[#6B5E70]/60 hover:bg-[#6B5E70]/5 hover:text-[#6B5E70]'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PANEL DE DETALLE (LORE) */}
      <AnimatePresence mode="wait">
        {selected && (
          <motion.div 
            key="panel" 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: "auto", opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }} 
            className="lore-panel mb-12 overflow-hidden bg-white/80 backdrop-blur-md"
          >
            <div className="max-w-7xl mx-auto p-8 relative">
              <button 
                onClick={() => setSelected(null)} 
                className="absolute top-8 right-8 p-2 bg-[#6B5E70] text-white rounded-full hover:scale-110 transition-transform z-50"
              >
                <X size={24} />
              </button>
              
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="rounded-3xl overflow-hidden shadow-2xl aspect-square">
                  <img src={selected.imagen_url} alt={selected.nombre} className="w-full h-full object-cover" />
                </div>
                <div className="lore-content">
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-4 py-1 bg-[#6B5E70]/10 text-[#6B5E70] text-[10px] font-black uppercase rounded-full tracking-widest">{selected.habitat}</span>
                    <span className="px-4 py-1 bg-[#6B5E70]/10 text-[#6B5E70] text-[10px] font-black uppercase rounded-full tracking-widest">{selected.pensamiento}</span>
                    <span className="px-4 py-1 bg-[#6B5E70] text-white text-[10px] font-black uppercase rounded-full tracking-widest">Alma {selected.alma}</span>
                  </div>
                  <h2 className="text-6xl md:text-8xl font-black uppercase italic text-[#6B5E70] leading-[0.8] tracking-tighter mb-6">
                    {selected.nombre}
                  </h2>
                  <p className="text-[#6B5E70]/80 text-lg italic leading-relaxed max-w-xl">
                    {selected.descripcion}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GRILLA DE CRIATURAS */}
      <section className="max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="py-20 text-center animate-pulse text-[#6B5E70] font-black uppercase text-xs tracking-widest">Rastreando huellas...</div>
        ) : (
          <>
            {filtradas.length === 0 ? (
              <div className="text-center py-20 text-[#6B5E70]/40 italic uppercase text-sm font-bold tracking-widest">No hay criaturas con esta combinación</div>
            ) : (
              <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {filtradas.map(c => (
                  <motion.div 
                    key={c.id} 
                    layout 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => { setSelected(c); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                    className={`group relative aspect-[3/4] overflow-hidden rounded-[2rem] cursor-pointer bg-white transition-all hover:shadow-2xl ${selected?.id === c.id ? 'ring-4 ring-[#6B5E70]' : ''}`}
                  >
                    <img src={c.imagen_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={c.nombre} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#6B5E70] via-[#6B5E70]/20 to-transparent opacity-80" />
                    <div className="absolute bottom-6 left-6 right-6 translate-y-2 group-hover:translate-y-0 transition-transform">
                      <p className="text-[8px] font-black text-white/60 uppercase tracking-widest mb-1">
                        {c.habitat} • {c.alma}
                      </p>
                      <h3 className="text-xl font-black text-white uppercase italic leading-none tracking-tighter">{c.nombre}</h3>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}
      </section>
    </main>
  );
}