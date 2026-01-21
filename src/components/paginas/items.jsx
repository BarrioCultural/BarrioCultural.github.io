"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function PureGridItems() {
  const [items, setItems] = useState([]);
  const [categoriasMenu, setCategoriasMenu] = useState([]); 
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const [filtros, setFiltros] = useState({
    categoria: 'TODOS'
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('items')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;

        if (data) {
          setItems(data);
          const unicas = [...new Set(data.map(item => item.categoria))].filter(Boolean);
          setCategoriasMenu(unicas);
        }
      } catch (err) {
        console.error("Error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    return items.filter(i => {
      return filtros.categoria === 'TODOS' || i.categoria === filtros.categoria;
    });
  }, [items, filtros]);

  return (
    <div className="min-h-screen bg-[#F0F0F0] pb-20 pt-16 font-sans overflow-x-hidden">
      <AnimatePresence>
        {!selected && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* CABECERA */}
            <header className="mb-12 md:mb-16 text-center px-4">
              <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-[#6B5E70] uppercase leading-none break-words">
                Inventario
              </h1>
              <div className="h-1 w-20 md:w-24 bg-[#6B5E70] mx-auto mt-4 rounded-full opacity-20" />
            </header>

            {/* FILTROS DINÁMICOS */}
            <div className="max-w-4xl mx-auto mb-16 md:mb-20 px-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-2 w-full max-w-md justify-center">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#6B5E70]/20" />
                  <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-[#6B5E70] italic">
                    Clasificación
                  </span>
                  <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#6B5E70]/20" />
                </div>
                <div className="flex flex-wrap justify-center gap-1.5 md:gap-2">
                  <button 
                    onClick={() => setFiltros({ categoria: 'TODOS' })}
                    className={`px-4 py-1.5 rounded-xl text-[9px] md:text-[10px] font-bold uppercase transition-all duration-300 border ${filtros.categoria === 'TODOS' ? 'bg-[#6B5E70] text-white shadow-lg' : 'bg-white text-[#6B5E70]/40 border-transparent'}`}
                  >
                    TODOS
                  </button>
                  {categoriasMenu.map(cat => (
                    <button 
                      key={cat} 
                      onClick={() => setFiltros({ categoria: cat })}
                      className={`px-4 py-1.5 rounded-xl text-[9px] md:text-[10px] font-bold uppercase transition-all duration-300 border ${filtros.categoria === cat ? 'bg-[#6B5E70] text-white shadow-lg shadow-[#6B5E70]/20' : 'bg-white text-[#6B5E70]/40 border-transparent hover:text-[#6B5E70]'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PANEL DE DETALLE (Lightbox de Objeto) */}
      <AnimatePresence mode="wait">
        {selected && (
          <motion.div key="panel" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-6xl mx-auto mb-16 p-4 md:p-6 relative">
            <div className="bg-white rounded-[2rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl border border-white">
              <button onClick={() => setSelected(null)} className="absolute top-6 right-6 md:top-10 md:right-10 p-2 md:p-3 bg-[#F0F0F0] text-[#6B5E70] rounded-full hover:bg-[#6B5E70] hover:text-white transition-all z-50">
                <X size={20} />
              </button>
              
              <div className="flex flex-col lg:flex-row items-center lg:items-stretch">
                <div className="w-full lg:w-1/2 aspect-square bg-white flex items-center justify-center p-8 md:p-16">
                  <img src={selected.imagen_url} alt={selected.nombre} className="w-full h-full object-contain mix-blend-multiply" />
                </div>

                <div className="w-full lg:w-1/2 p-6 md:p-12 flex flex-col justify-center">
                  <div className="mb-6">
                    <span className="px-3 py-1 bg-[#6B5E70] text-white text-[8px] md:text-[10px] font-black uppercase rounded-lg tracking-widest">Categoría: {selected.categoria}</span>
                  </div>
                  <h2 className="text-4xl md:text-6xl lg:text-8xl font-black uppercase italic text-[#6B5E70] leading-[0.9] tracking-tighter mb-6 break-words">
                    {selected.nombre}
                  </h2>
                  <div className="max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                    <p className="text-[#6B5E70]/70 text-sm md:text-lg italic leading-relaxed font-medium">
                      {selected.descripcion || "Sin descripción adicional en los registros."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GRID DE RESULTADOS */}
      <main className="p-4 md:p-8 max-w-[1600px] mx-auto">
        {loading ? (
          <div className="py-20 text-center animate-pulse text-[#6B5E70] font-black uppercase text-[10px] tracking-[0.5em]">Indexando Inventario</div>
        ) : (
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6">
            {filtered.map(item => (
              <motion.div 
                key={item.id} 
                layout 
                onClick={() => { setSelected(item); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                className="group relative aspect-[4/5] overflow-hidden rounded-[1.5rem] md:rounded-[2.8rem] cursor-pointer bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl flex flex-col items-center justify-center p-4"
              >
                <img src={item.imagen_url} className="w-3/4 h-3/4 object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110" alt={item.nombre} />
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 bg-gradient-to-t from-[#6B5E70]/10 to-transparent">
                  <p className="text-[6px] md:text-[8px] font-black text-[#6B5E70]/40 uppercase tracking-[0.3em] mb-1">{item.categoria}</p>
                  <h3 className="text-xs md:text-lg font-black text-[#6B5E70] uppercase italic leading-none tracking-tighter">{item.nombre}</h3>
                </div>
                <div className="absolute top-0 w-full h-1 bg-[#6B5E70]/5 group-hover:bg-[#6B5E70] transition-colors" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}