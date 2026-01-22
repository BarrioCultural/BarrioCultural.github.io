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
  const [filtros, setFiltros] = useState({ categoria: 'TODOS' });

  // --- OPTIMIZACIÓN: Estilo de botones unificado ---
  const btnStyle = (isActive) => `
    px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all border 
    ${isActive 
      ? 'bg-primary text-white border-primary shadow-lg scale-105' 
      : 'bg-white/50 text-primary/60 border-transparent hover:border-primary/20 hover:text-primary'}
  `;

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
    return items.filter(i => filtros.categoria === 'TODOS' || i.categoria === filtros.categoria);
  }, [items, filtros]);

  return (
    <main className="min-h-screen bg-bg-main pb-20 pt-16 font-sans overflow-x-hidden">
      <AnimatePresence>
        {!selected && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* CABECERA UNIFICADA */}
            <header className="mb-12 text-center px-4">
              <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-primary uppercase leading-none">
                Inventario
              </h1>
              <div className="h-1.5 w-24 bg-primary mx-auto mt-4 rounded-full opacity-20" />
            </header>

            {/* FILTROS DINÁMICOS */}
            <div className="max-w-4xl mx-auto mb-16 px-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-2 w-full max-w-md justify-center opacity-40">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-primary" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">Clasificación</span>
                  <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-primary" />
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <button onClick={() => setFiltros({ categoria: 'TODOS' })} className={btnStyle(filtros.categoria === 'TODOS')}>
                    TODOS
                  </button>
                  {categoriasMenu.map(cat => (
                    <button key={cat} onClick={() => setFiltros({ categoria: cat })} className={btnStyle(filtros.categoria === cat)}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PANEL DE DETALLE (Lightbox) */}
      <AnimatePresence mode="wait">
        {selected && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="max-w-6xl mx-auto mb-16 p-4 md:p-6 relative">
            <div className="card-main !bg-white !p-0 overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[500px]">
              <button onClick={() => setSelected(null)} className="absolute top-8 right-8 p-3 bg-bg-main text-primary rounded-full hover:bg-primary hover:text-white transition-all z-50 shadow-md">
                <X size={24} />
              </button>
              
              <div className="w-full lg:w-1/2 aspect-square bg-white flex items-center justify-center p-12">
                <img src={selected.imagen_url} alt={selected.nombre} className="w-full h-full object-contain mix-blend-multiply" />
              </div>

              <div className="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center">
                <div className="mb-8">
                  <span className="px-3 py-1 bg-primary text-white text-[10px] font-black uppercase rounded-lg tracking-widest">
                    {selected.categoria}
                  </span>
                </div>
                <h2 className="text-5xl md:text-8xl font-black uppercase italic text-primary leading-[0.85] tracking-tighter mb-8">
                  {selected.nombre}
                </h2>
                <div className="border-l-4 border-primary pl-6">
                  <p className="text-primary/80 text-lg md:text-xl italic leading-relaxed font-medium">
                    {selected.descripcion || "Sin descripción adicional en los registros."}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GRID DE RESULTADOS */}
      <section className="p-4 md:p-8 max-w-[1600px] mx-auto">
        {loading ? (
          <div className="py-20 text-center animate-pulse text-primary/30 font-black uppercase text-[10px] tracking-[0.5em]">Indexando Inventario</div>
        ) : (
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {filtered.map(item => (
              <motion.div 
                key={item.id} 
                layout 
                onClick={() => { setSelected(item); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                className="char-card-base bg-white p-4 flex flex-col items-center justify-center group"
              >
                <img src={item.imagen_url} className="w-3/4 h-3/4 object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110" alt={item.nombre} />
                
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-primary/10 to-transparent">
                  <p className="text-[8px] font-black text-primary/40 uppercase tracking-[0.2em] mb-1">{item.categoria}</p>
                  <h3 className="text-sm md:text-lg font-black text-primary uppercase italic leading-none tracking-tighter">{item.nombre}</h3>
                </div>
                
                {/* Indicador superior estético */}
                <div className="absolute top-0 w-full h-1.5 bg-primary/5 group-hover:bg-primary transition-colors" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </main>
  );
}