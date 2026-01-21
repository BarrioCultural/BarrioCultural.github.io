"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Footprints, X, Filter } from 'lucide-react';

export default function Criaturas() {
  const [criaturas, setCriaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  // Estado único para todos los filtros
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

  // Lógica de filtrado combinada
  const filtradas = useMemo(() => {
    return criaturas.filter(c => {
      const h = filtros.habitat === 'todos' || c.habitat?.toLowerCase() === filtros.habitat.toLowerCase();
      const p = filtros.pensamiento === 'todos' || c.pensamiento?.toLowerCase() === filtros.pensamiento.toLowerCase();
      const a = filtros.alma === 'todos' || c.alma?.toLowerCase() === filtros.alma.toLowerCase();
      return h && p && a;
    });
  }, [criaturas, filtros]);

  const updateFiltro = (grupo, valor) => {
    setFiltros(prev => ({ ...prev, [grupo]: valor }));
  };

  return (
    <main className="min-h-screen bg-[#EBEBEB] pb-20 pt-10">
      <AnimatePresence>
        {!selected && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <header className="relative z-40 mb-10 px-4 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-[#6B5E70]/5 rounded-full border border-[#6B5E70]/10 text-[#6B5E70]">
                  <Footprints size={32} />
                </div>
              </div>
              <h1 className="text-4xl font-black italic tracking-tighter text-[#6B5E70] uppercase">Bestiario</h1>
              <p className="mt-2 text-[#6B5E70]/60 font-medium italic">Filtra por naturaleza, conciencia y esencia</p>
            </header>

            {/* Contenedor de Filtros Grupales */}
            <div className="max-w-4xl mx-auto mb-12 px-6 flex flex-wrap justify-center gap-8">
              {Object.entries(configFiltros).map(([grupo, opciones]) => (
                <div key={grupo} className="flex flex-col items-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6B5E70]/40 mb-3">
                    {grupo}
                  </span>
                  <div className="flex gap-1 bg-white/50 p-1 rounded-full border border-[#6B5E70]/10">
                    {opciones.map(opt => (
                      <button
                        key={opt}
                        onClick={() => updateFiltro(grupo, opt)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                          filtros[grupo] === opt 
                          ? 'bg-[#6B5E70] text-white shadow-lg' 
                          : 'text-[#6B5E70]/50 hover:text-[#6B5E70]'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel de Detalle (Se mantiene tu estilo original) */}
      <AnimatePresence mode="wait">
        {selected && (
          <motion.div key="panel" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lore-panel mb-12">
            <div className="lore-panel-layout">
              <button onClick={() => setSelected(null)} className="btn-close-panel"><X size={24} /></button>
              <div className="lore-image-container"><img src={selected.imagen_url} alt={selected.nombre} /></div>
              <div className="lore-content">
                <div className="flex gap-2 mb-4">
                  <span className="badge-lore">{selected.habitat}</span>
                  <span className="badge-lore">{selected.pensamiento}</span>
                  <span className="badge-lore">Alma {selected.alma}</span>
                </div>
                <h2 className="text-5xl md:text-8xl font-black uppercase italic text-[#6B5E70] leading-none tracking-tighter">{selected.nombre}</h2>
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
          <>
            {filtradas.length === 0 ? (
              <div className="text-center py-20 text-[#6B5E70]/40 italic uppercase text-sm font-bold">No hay criaturas con esta combinación</div>
            ) : (
              <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {filtradas.map(c => (
                  <motion.div 
                    key={c.id} 
                    layout 
                    onClick={() => { setSelected(c); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                    className={`char-card group ${selected?.id === c.id ? 'char-card-selected' : ''}`}
                  >
                    <img src={c.imagen_url} className="w-full h-full object-cover" alt={c.nombre} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#6B5E70]/90 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    <div className="absolute bottom-4 left-4 right-4 translate-y-2 group-hover:translate-y-0 transition-all">
                      <p className="text-[7px] font-black text-white/50 uppercase tracking-widest mb-1">
                        {c.habitat} • {c.alma}
                      </p>
                      <h3 className="text-lg font-black text-white uppercase italic leading-none">{c.nombre}</h3>
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