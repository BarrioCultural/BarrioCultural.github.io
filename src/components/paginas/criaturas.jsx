"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
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

  // 1. CARGAR FILTROS DINÁMICOS
  useEffect(() => {
    const fetchOpciones = async () => {
      const { data, error } = await supabase
        .from('criaturas')
        .select('habitat, pensamiento, alma');
      
      if (error) {
        console.error("Error cargando opciones de filtro:", error.message);
        return;
      }

      if (data) {
        const extraerUnicos = (campo) => {
          const valores = data.map(item => item[campo]).filter(Boolean);
          const unicos = [...new Set(valores)].sort();
          return ['todos', ...unicos];
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

  // 2. CARGAR CRIATURAS CON FILTROS
  useEffect(() => {
    const fetchCriaturas = async () => {
      setLoading(true);
      let query = supabase.from('criaturas').select('*').order('nombre', { ascending: true });

      if (filtros.habitat !== 'todos') query = query.eq('habitat', filtros.habitat);
      if (filtros.pensamiento !== 'todos') query = query.eq('pensamiento', filtros.pensamiento);
      if (filtros.alma !== 'todos') query = query.eq('alma', filtros.alma);

      const { data, error } = await query;
      if (error) console.error("Error filtrando:", error.message);
      else setCriaturas(data || []);
      setLoading(false);
    };
    fetchCriaturas();
  }, [filtros]);

  const updateFiltro = (grupo, valor) => {
    setFiltros(prev => ({ ...prev, [grupo]: valor }));
  };

  return (
    <main className="min-h-screen bg-bg-main pb-20 pt-16 font-sans overflow-x-hidden">
      
      {/* SECCIÓN SUPERIOR: TÍTULO Y FILTROS */}
      <AnimatePresence>
        {!selected && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
          >
            <header className="mb-12 text-center px-4">
              <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-primary uppercase leading-none">
                Bestiario
              </h1>
              <div className="h-1.5 w-24 bg-primary mx-auto mt-4 rounded-full opacity-20" />
            </header>

            <div className="max-w-4xl mx-auto mb-16 px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {Object.entries(opcionesFiltros).map(([grupo, opciones]) => (
                  <div key={grupo} className="flex flex-col items-center space-y-4">
                    <div className="flex items-center space-x-2 w-full justify-center opacity-40">
                      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-primary" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">
                        {grupo}
                      </span>
                      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-primary" />
                    </div>

                    <div className="flex flex-wrap justify-center gap-2">
                      {opciones.map(opt => (
                        <button
                          key={opt}
                          onClick={() => updateFiltro(grupo, opt)}
                          className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all border ${
                            filtros[grupo] === opt 
                            ? 'bg-primary text-white border-primary shadow-lg scale-105' 
                            : 'bg-white/50 text-primary/60 border-transparent hover:border-primary/20 hover:text-primary'
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

      {/* PANEL DE DETALLE (SE DESPLIEGA AL SELECCIONAR) */}
      <AnimatePresence mode="wait">
        {selected && (
          <motion.div 
            key="panel" 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.98 }} 
            className="max-w-6xl mx-auto mb-16 p-4 md:p-6 relative"
          >
            {/* Usamos la clase maestra .card-main y forzamos bg-white para el detalle */}
            <div className="card-main !bg-white !p-0 overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[500px]">
              <button 
                onClick={() => setSelected(null)} 
                className="absolute top-8 right-8 p-3 bg-bg-main text-primary rounded-full hover:bg-primary hover:text-white transition-all z-50 shadow-md"
              >
                <X size={24} />
              </button>
              
              <div className="w-full lg:w-1/2 aspect-square lg:aspect-auto">
                <img src={selected.imagen_url} alt={selected.nombre} className="w-full h-full object-cover" />
              </div>

              <div className="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center">
                <div className="flex flex-wrap gap-2 mb-8">
                  {['habitat', 'pensamiento', 'alma'].map(key => (
                    <span key={key} className="px-3 py-1 bg-bg-main text-primary text-[9px] font-black uppercase rounded-lg tracking-widest border border-primary/5">
                      {key === 'alma' ? `Alma ${selected[key]}` : selected[key]}
                    </span>
                  ))}
                </div>

                <h2 className="text-5xl md:text-8xl font-black uppercase italic text-primary leading-[0.85] tracking-tighter mb-8">
                  {selected.nombre}
                </h2>

                <div className="border-l-4 border-primary pl-6 py-2">
                  <p className="text-primary/80 text-lg md:text-xl italic leading-relaxed font-medium">
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
          <div className="py-20 text-center text-primary/30 font-black uppercase text-[10px] tracking-[0.5em] animate-pulse">
            Sincronizando Archivos...
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {criaturas.length > 0 ? (
              criaturas.map(c => (
                <motion.div 
                  key={c.id} 
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => { setSelected(c); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                  className="char-card-base group"
                >
                  <img src={c.imagen_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={c.nombre} />
                  
                  {/* Overlay estético */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="absolute bottom-6 left-6 right-6 translate-y-2 group-hover:translate-y-0 transition-transform">
                    <p className="text-[8px] font-black text-white/50 uppercase tracking-[0.2em] mb-1">
                      {c.habitat} / {c.alma}
                    </p>
                    <h3 className="text-xl font-black text-white uppercase italic leading-none tracking-tighter">
                      {c.nombre}
                    </h3>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-primary/40 font-bold uppercase text-xs tracking-widest">
                Sin registros en este sector.
              </div>
            )}
          </motion.div>
        )}
      </section>
    </main>
  );
}