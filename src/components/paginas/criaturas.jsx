"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { GalleryGrid, GalleryItem } from "@/components/recursos/display/gallery";
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Criaturas() {
  const [criaturas, setCriaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const [opcionesFiltros, setOpcionesFiltros] = useState({
    habitat: ['todos'],
    pensamiento: ['todos'],
    alma: ['todos']
  });

  const [filtros, setFiltros] = useState({
    habitat: 'todos',
    pensamiento: 'todos',
    alma: 'todos'
  });

  // Carga de opciones para los botones de filtro
  useEffect(() => {
    const fetchOpciones = async () => {
      const { data } = await supabase.from('criaturas').select('habitat, pensamiento, alma');
      if (data) {
        const extraerUnicos = (campo) => {
          const valores = data.map(item => item[campo]).filter(Boolean);
          return ['todos', ...new Set(valores)].sort();
        };
        setOpcionesFiltros({
          habitat: extraerUnicos('habitat'),
          pensamiento: extraerUnicos('pensamiento'),
          alma: extraerUnicos('alma')
        });
      }
    };
    fetchOpciones();
  }, []);

  // Carga de criaturas filtradas
  useEffect(() => {
    const fetchCriaturas = async () => {
      setLoading(true);
      let query = supabase.from('criaturas').select('*').order('nombre', { ascending: true });
      if (filtros.habitat !== 'todos') query = query.eq('habitat', filtros.habitat);
      if (filtros.pensamiento !== 'todos') query = query.eq('pensamiento', filtros.pensamiento);
      if (filtros.alma !== 'todos') query = query.eq('alma', filtros.alma);

      const { data } = await query;
      setCriaturas(data || []);
      setLoading(false);
    };
    fetchCriaturas();
  }, [filtros]);

  const updateFiltro = (grupo, valor) => setFiltros(prev => ({ ...prev, [grupo]: valor }));

  return (
    <main className="min-h-screen bg-bg-main pb-20 pt-16 font-sans overflow-x-hidden">
      
      {/* HEADER Y FILTROS */}
      <AnimatePresence>
        {!selected && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <header className="mb-12 text-center px-4">
              <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-primary uppercase leading-none">
                Bestiario
              </h1>
              <div className="h-1.5 w-24 bg-primary mx-auto mt-4 rounded-full opacity-20" />
            </header>

            <div className="max-w-5xl mx-auto mb-16 px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {Object.entries(opcionesFiltros).map(([grupo, opciones]) => (
                  <div key={grupo} className="flex flex-col items-center space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 italic">{grupo}</span>
                    <div className="flex flex-wrap justify-center gap-2">
                      {opciones.map(opt => (
                        <button
                          key={opt}
                          onClick={() => updateFiltro(grupo, opt)}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all border ${
                            filtros[grupo] === opt ? 'bg-primary text-white shadow-lg' : 'bg-white/50 text-primary/60 border-transparent'
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

      {/* DETALLE DE CRIATURA */}
      <AnimatePresence mode="wait">
        {selected && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="max-w-6xl mx-auto mb-16 p-4 md:p-6 relative">
            <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[500px]">
              <button onClick={() => setSelected(null)} className="absolute top-10 right-10 z-50 p-3 bg-bg-main text-primary rounded-full shadow-md hover:bg-primary hover:text-white transition-all">
                <X size={20} />
              </button>
              <img src={selected.imagen_url} className="w-full lg:w-1/2 aspect-square object-cover" />
              <div className="p-12 md:p-20 flex flex-col justify-center bg-bg-main/5">
                <div className="flex gap-2 mb-6">
                  <span className="px-3 py-1 bg-primary text-white text-[10px] font-black uppercase rounded-lg">{selected.habitat}</span>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-lg">Alma {selected.alma}</span>
                </div>
                <h2 className="text-6xl md:text-8xl font-black uppercase italic text-primary leading-none tracking-tighter mb-6">{selected.nombre}</h2>
                <p className="text-primary/70 text-xl italic leading-relaxed border-l-4 border-primary pl-6">{selected.descripcion}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GRID MAESTRO */}
      {loading ? (
        <div className="py-20 text-center text-primary/30 font-black uppercase text-[10px] tracking-widest animate-pulse">Sincronizando Archivos...</div>
      ) : (
        <GalleryGrid>
          {criaturas.map(c => (
            <GalleryItem 
              key={c.id} 
              src={c.imagen_url} 
              onClick={() => { setSelected(c); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              <p className="text-[8px] font-black text-white/50 uppercase tracking-[0.2em] mb-1">{c.habitat} • {c.alma}</p>
              <h3 className="text-xl font-black text-white uppercase italic leading-none tracking-tighter">{c.nombre}</h3>
            </GalleryItem>
          ))}
        </GalleryGrid>
      )}
    </main>
  );
}