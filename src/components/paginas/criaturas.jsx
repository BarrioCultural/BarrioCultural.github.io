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
    <main className="min-h-screen bg-[#F0F0F0] pb-20 pt-16 font-sans">
      <AnimatePresence>
        {!selected && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* CABECERA ARTÍSTICA */}
            <header className="mb-16 text-center">
              <h1 className="text-7xl font-black italic tracking-tighter text-[#6B5E70] uppercase leading-none">
                Bestiario
              </h1>
              <div className="h-1 w-24 bg-[#6B5E70] mx-auto mt-4 rounded-full opacity-20" />
            </header>

            {/* SECCIÓN DE FILTROS REDISEÑADA */}
            <div className="max-w-4xl mx-auto mb-20 px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                {Object.entries(configFiltros).map(([grupo, opciones], index) => (
                  <div key={grupo} className="flex flex-col items-center space-y-4">
                    {/* Título de categoría estético */}
                    <div className="flex items-center space-x-2 w-full justify-center">
                      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#6B5E70]/20" />
                      <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#6B5E70] italic">
                        {grupo}
                      </span>
                      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#6B5E70]/20" />
                    </div>

                    {/* Contenedor de botones */}
                    <div className="flex flex-wrap justify-center gap-2">
                      {opciones.map(opt => (
                        <button
                          key={opt}
                          onClick={() => updateFiltro(grupo, opt)}
                          className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all duration-300 border ${
                            filtros[grupo] === opt 
                            ? 'bg-[#6B5E70] text-white border-[#6B5E70] shadow-lg shadow-[#6B5E70]/20 scale-105' 
                            : 'bg-white text-[#6B5E70]/40 border-transparent hover:border-[#6B5E70]/20 hover:text-[#6B5E70]'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PANEL DE DETALLE (Lore) */}
      <AnimatePresence mode="wait">
        {selected && (
          <motion.div 
            key="panel" 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.95 }} 
            className="max-w-6xl mx-auto mb-16 p-1 relative"
          >
            <div className="bg-white rounded-[3.5rem] overflow-hidden shadow-2xl border border-white p-10">
              <button 
                onClick={() => setSelected(null)} 
                className="absolute top-10 right-10 p-3 bg-[#EBEBEB] text-[#6B5E70] rounded-full hover:bg-[#6B5E70] hover:text-white transition-all z-50"
              >
                <X size={24} />
              </button>
              
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="rounded-[3rem] overflow-hidden shadow-inner aspect-square bg-[#F8F8F8]">
                  <img src={selected.imagen_url} alt={selected.nombre} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex flex-wrap gap-3 mb-8">
                    {['habitat', 'pensamiento', 'alma'].map(key => (
                      <span key={key} className="px-4 py-1 bg-[#F0F0F0] text-[#6B5E70] text-[9px] font-black uppercase rounded-lg tracking-widest border border-[#6B5E70]/5">
                        {key === 'alma' ? `Alma ${selected[key]}` : selected[key]}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-8xl font-black uppercase italic text-[#6B5E70] leading-[0.85] tracking-tighter mb-8">
                    {selected.nombre}
                  </h2>
                  <p className="text-[#6B5E70]/70 text-lg italic leading-relaxed font-medium">
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
          <div className="py-20 text-center text-[#6B5E70]/40 font-black uppercase text-xs tracking-[0.5em] animate-pulse">Sincronizando Archivos</div>
        ) : (
          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {filtradas.map(c => (
              <motion.div 
                key={c.id} 
                layout
                onClick={() => { setSelected(c); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                className="group relative aspect-[4/5] overflow-hidden rounded-[2.8rem] cursor-pointer bg-white transition-all duration-500 hover:-translate-y-2"
              >
                <img src={c.imagen_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[0.3] group-hover:grayscale-0" alt={c.nombre} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#6B5E70] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-8 left-8 right-8">
                  <p className="text-[8px] font-black text-white/50 uppercase tracking-[0.3em] mb-2">
                    {c.habitat} / {c.alma}
                  </p>
                  <h3 className="text-xl font-black text-white uppercase italic leading-none tracking-tighter">
                    {c.nombre}
                  </h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </main>
  );
}