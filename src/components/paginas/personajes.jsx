"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Criaturas() {
  const [criaturas, setCriaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

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

  const updateFiltro = (grupo, valor) => {
    setFiltros(prev => ({ ...prev, [grupo]: valor }));
  };

  return (
    <main className="min-h-screen bg-[#EBEBEB] pb-20 pt-16">
      <AnimatePresence>
        {!selected && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* CABECERA LIMPIA */}
            <header className="mb-12 px-4 text-center">
              <h1 className="text-6xl font-black italic tracking-tighter text-[#6B5E70] uppercase">
                Bestiario
              </h1>
            </header>

            {/* SELECTORES DE FILTROS */}
            <div className="max-w-5xl mx-auto mb-16 px-6 flex flex-wrap justify-center gap-x-12 gap-y-8">
              {Object.entries(configFiltros).map(([grupo, opciones]) => (
                <div key={grupo} className="flex flex-col items-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6B5E70]/40 mb-3 italic">
                    {grupo}
                  </span>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {opciones.map(opt => (
                      <button
                        key={opt}
                        onClick={() => updateFiltro(grupo, opt)}
                        className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all border ${
                          filtros[grupo] === opt 
                          ? 'bg-[#6B5E70] text-white border-[#6B5E70] shadow-md' 
                          : 'bg-white/50 text-[#6B5E70]/50 border-[#6B5E70]/10 hover:border-[#6B5E70]/30 hover:text-[#6B5E70]'
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

      {/* PANEL DE DETALLE */}
      <AnimatePresence mode="wait">
        {selected && (
          <motion.div 
            key="panel" 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: "auto", opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }} 
            className="mb-12 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto p-8 relative bg-white/40 backdrop-blur-sm rounded-[3rem] border border-white/20">
              <button 
                onClick={() => setSelected(null)} 
                className="absolute top-8 right-8 text-[#6B5E70] hover:scale-110 transition-transform z-50"
              >
                <X size={32} />
              </button>
              
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="rounded-[2.5rem] overflow-hidden aspect-square shadow-xl bg-gray-200">
                  <img src={selected.imagen_url} alt={selected.nombre} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-[#6B5E70] text-white text-[9px] font-black uppercase rounded-full tracking-widest">{selected.habitat}</span>
                    <span className="px-3 py-1 bg-[#6B5E70]/10 text-[#6B5E70] text-[9px] font-black uppercase rounded-full tracking-widest">{selected.pensamiento}</span>
                    <span className="px-3 py-1 bg-[#6B5E70]/10 text-[#6B5E70] text-[9px] font-black uppercase rounded-full tracking-widest">Alma {selected.alma}</span>
                  </div>
                  <h2 className="text-7xl font-black uppercase italic text-[#6B5E70] leading-none tracking-tighter mb-6">
                    {selected.nombre}
                  </h2>
                  <p className="text-[#6B5E70]/80 text-xl italic leading-relaxed max-w-xl">
                    {selected.descripcion}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RESULTADOS */}
      <section className="max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="py-20 text-center animate-pulse text-[#6B5E70] font-black uppercase text-xs tracking-widest">Accediendo a los registros...</div>
        ) : (
          <>
            {filtradas.length === 0 ? (
              <div className="text-center py-20 text-[#6B5E70]/30 italic uppercase text-sm font-bold tracking-[0.2em]">Registro vacío para esta combinación</div>
            ) : (
              <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {filtradas.map(c => (
                  <motion.div 
                    key={c.id} 
                    layout 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => { setSelected(c); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                    className="group relative aspect-[4/5] overflow-hidden rounded-[2.5rem] cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 bg-white"
                  >
                    <img src={c.imagen_url} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" alt={c.nombre} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#6B5E70]/90 via-[#6B5E70]/10 to-transparent opacity-80" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <p className="text-[7px] font-black text-white/50 uppercase tracking-[0.3em] mb-1">
                        {c.habitat} / {c.alma}
                      </p>
                      <h3 className="text-lg font-black text-white uppercase italic leading-none tracking-tighter">
                        {c.nombre}
                      </h3>
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