"use client";
import React, { useEffect, useState } from 'react';
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

  // EFECTO DE CARGA: Se ejecuta al inicio y cuando cambia cualquier filtro
  useEffect(() => {
    const fetchCriaturas = async () => {
      setLoading(true);
      
      // 1. Iniciamos la query
      let query = supabase
        .from('criaturas')
        .select('*')
        .order('nombre', { ascending: true });

      // 2. Aplicamos filtros condicionales solo si no es "todos"
      // .ilike es excelente porque ignora mayúsculas/minúsculas
      if (filtros.habitat !== 'todos') {
        query = query.ilike('habitat', filtros.habitat);
      }
      if (filtros.pensamiento !== 'todos') {
        query = query.ilike('pensamiento', filtros.pensamiento);
      }
      if (filtros.alma !== 'todos') {
        query = query.ilike('alma', filtros.alma);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error cargando criaturas:", error.message);
      } else {
        setCriaturas(data);
      }
      setLoading(false);
    };

    fetchCriaturas();
  }, [filtros]); // <-- IMPORTANTE: Se re-ejecuta cuando 'filtros' cambia

  const updateFiltro = (grupo, valor) => {
    setFiltros(prev => ({ ...prev, [grupo]: valor }));
  };

  return (
    <main className="min-h-screen bg-[#F0F0F0] pb-20 pt-16 font-sans overflow-x-hidden">
      {/* ... (Cabecera y Filtros se mantienen igual) ... */}
      <AnimatePresence>
        {!selected && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <header className="mb-12 md:mb-16 text-center px-4">
              <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-[#6B5E70] uppercase leading-none break-words">
                Bestiario
              </h1>
              <div className="h-1 w-20 md:w-24 bg-[#6B5E70] mx-auto mt-4 rounded-full opacity-20" />
            </header>

            <div className="max-w-4xl mx-auto mb-16 md:mb-20 px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                {Object.entries(configFiltros).map(([grupo, opciones]) => (
                  <div key={grupo} className="flex flex-col items-center space-y-4">
                    <div className="flex items-center space-x-2 w-full justify-center">
                      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#6B5E70]/20" />
                      <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-[#6B5E70] italic">
                        {grupo}
                      </span>
                      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#6B5E70]/20" />
                    </div>

                    <div className="flex flex-wrap justify-center gap-1.5 md:gap-2">
                      {opciones.map(opt => (
                        <button
                          key={opt}
                          onClick={() => updateFiltro(grupo, opt)}
                          className={`px-3 py-1 md:px-4 md:py-1.5 rounded-xl text-[9px] md:text-[10px] font-bold uppercase transition-all duration-300 border ${
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

      {/* PANEL DE DETALLE */}
      {/* ... (Se mantiene igual que tu código original) ... */}

      {/* RESULTADOS */}
      <section className="max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="py-20 text-center text-[#6B5E70]/40 font-black uppercase text-xs tracking-[0.5em] animate-pulse">
            Consultando Archivos...
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
            {criaturas.length > 0 ? (
              criaturas.map(c => (
                <motion.div 
                  key={c.id} 
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => { setSelected(c); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                  className="group relative aspect-[4/5] overflow-hidden rounded-[1.5rem] md:rounded-[2.8rem] cursor-pointer bg-white transition-all duration-500 hover:-translate-y-2"
                >
                  <img src={c.imagen_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[0.3] group-hover:grayscale-0" alt={c.nombre} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#6B5E70] via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 right-4 md:right-8">
                    <p className="text-[6px] md:text-[8px] font-black text-white/50 uppercase tracking-[0.3em] mb-1 md:mb-2">
                      {c.habitat} / {c.alma}
                    </p>
                    <h3 className="text-sm md:text-xl font-black text-white uppercase italic leading-none tracking-tighter">
                      {c.nombre}
                    </h3>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-[#6B5E70]/40 font-bold uppercase text-xs">
                No se encontraron criaturas con esos rasgos.
              </div>
            )}
          </motion.div>
        )}
      </section>
    </main>
  );
}