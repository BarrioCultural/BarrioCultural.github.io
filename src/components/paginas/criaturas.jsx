"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Criaturas() {
  const [criaturas, setCriaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  // Opciones de filtros que se cargarán dinámicamente desde la BD
  const [opcionesFiltros, setOpcionesFiltros] = useState({
    habitat: ['todos'],
    pensamiento: ['todos'],
    alma: ['todos']
  });

  // Estado de los filtros seleccionados
  const [filtros, setFiltros] = useState({
    habitat: 'todos',
    pensamiento: 'todos',
    alma: 'todos'
  });

  // 1. CARGAR FILTROS DINÁMICOS (Se ejecuta una sola vez al montar)
  useEffect(() => {
    const fetchOpciones = async () => {
      // Pedimos solo las columnas necesarias para armar los filtros
      const { data, error } = await supabase
        .from('criaturas')
        .select('habitat, pensamiento, alma');
      
      if (error) {
        console.error("Error cargando opciones de filtro:", error.message);
        return;
      }

      if (data) {
        const extraerUnicos = (campo) => {
          // Extraer valores, filtrar nulos, y usar Set para eliminar duplicados
          const valores = data
            .map(item => item[campo])
            .filter(Boolean);
          
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

  // 2. CARGAR CRIATURAS (Se ejecuta cada vez que cambian los filtros)
  useEffect(() => {
    const fetchCriaturas = async () => {
      setLoading(true);
      
      let query = supabase
        .from('criaturas')
        .select('*')
        .order('nombre', { ascending: true });

      // Aplicar filtros a la consulta de Supabase si no es "todos"
      if (filtros.habitat !== 'todos') {
        query = query.eq('habitat', filtros.habitat);
      }
      if (filtros.pensamiento !== 'todos') {
        query = query.eq('pensamiento', filtros.pensamiento);
      }
      if (filtros.alma !== 'todos') {
        query = query.eq('alma', filtros.alma);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error("Error filtrando criaturas:", error.message);
      } else {
        setCriaturas(data || []);
      }
      setLoading(false);
    };

    fetchCriaturas();
  }, [filtros]);

  const updateFiltro = (grupo, valor) => {
    setFiltros(prev => ({ ...prev, [grupo]: valor }));
  };

  return (
    <main className="min-h-screen bg-[#F0F0F0] pb-20 pt-16 font-sans overflow-x-hidden">
      <AnimatePresence>
        {!selected && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
          >
            {/* CABECERA */}
            <header className="mb-12 md:mb-16 text-center px-4">
              <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-[#6B5E70] uppercase leading-none break-words">
                Bestiario
              </h1>
              <div className="h-1 w-20 md:w-24 bg-[#6B5E70] mx-auto mt-4 rounded-full opacity-20" />
            </header>

            {/* SECCIÓN DE FILTROS DINÁMICOS */}
            <div className="max-w-4xl mx-auto mb-16 md:mb-20 px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                {Object.entries(opcionesFiltros).map(([grupo, opciones]) => (
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

      {/* PANEL DE DETALLE (Lightbox) */}
      <AnimatePresence mode="wait">
        {selected && (
          <motion.div 
            key="panel" 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.95 }} 
            className="max-w-6xl mx-auto mb-16 p-4 md:p-6 relative"
          >
            <div className="bg-white rounded-[2rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl border border-white">
              <button 
                onClick={() => setSelected(null)} 
                className="absolute top-6 right-6 md:top-10 md:right-10 p-2 md:p-3 bg-[#EBEBEB] text-[#6B5E70] rounded-full hover:bg-[#6B5E70] hover:text-white transition-all z-50"
              >
                <X size={20} />
              </button>
              
              <div className="flex flex-col lg:flex-row items-center lg:items-stretch">
                <div className="w-full lg:w-1/2 aspect-square bg-[#F8F8F8]">
                  <img src={selected.imagen_url} alt={selected.nombre} className="w-full h-full object-cover" />
                </div>

                <div className="w-full lg:w-1/2 p-6 md:p-12 flex flex-col justify-center">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {['habitat', 'pensamiento', 'alma'].map(key => (
                      <span key={key} className="px-3 py-1 bg-[#F0F0F0] text-[#6B5E70] text-[8px] md:text-[9px] font-black uppercase rounded-lg tracking-widest border border-[#6B5E70]/5">
                        {key === 'alma' ? `Alma ${selected[key]}` : selected[key]}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-4xl md:text-6xl lg:text-8xl font-black uppercase italic text-[#6B5E70] leading-[0.9] tracking-tighter mb-6 break-words">
                    {selected.nombre}
                  </h2>

                  <div className="max-h-[250px] md:max-h-none overflow-y-auto md:overflow-visible pr-2">
                    <p className="text-[#6B5E70]/70 text-sm md:text-lg italic leading-relaxed font-medium">
                      {selected.descripcion}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RESULTADOS (GRILLA) */}
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
              <div className="col-span-full py-20 text-center text-[#6B5E70]/40 font-bold uppercase text-xs tracking-widest">
                No se encontraron registros en este sector del archivo.
              </div>
            )}
          </motion.div>
        )}
      </section>
    </main>
  );
}