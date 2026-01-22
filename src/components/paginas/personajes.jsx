"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Youtube, Music } from 'lucide-react';

export default function PersonajesGrid() {
  const [personajes, setPersonajes] = useState([]);
  const [reinosData, setReinosData] = useState([]); 
  const [criaturasData, setCriaturasData] = useState([]); 
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const [filtros, setFiltros] = useState({
    reino: 'TODOS',
    especie: 'TODOS'
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [charsRes, reinosRes, criaturasRes] = await Promise.all([
          supabase.from('personajes').select('*').order('id', { ascending: true }),
          supabase.from('reinos').select('*').order('orden', { ascending: true }),
          supabase.from('criaturas').select('nombre').order('nombre', { ascending: true })
        ]);

        if (charsRes.data) setPersonajes(charsRes.data);
        if (reinosRes.data) setReinosData(reinosRes.data);
        if (criaturasRes.data) setCriaturasData(criaturasRes.data);

      } catch (err) {
        console.error("Error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const especiesConPersonajes = useMemo(() => {
    const especiesEnUso = new Set(personajes.map(p => p.especie?.toLowerCase().trim()));
    return criaturasData.filter(c => especiesEnUso.has(c.nombre?.toLowerCase().trim()));
  }, [personajes, criaturasData]);

  const filtered = useMemo(() => {
    return personajes.filter(p => {
      const matchReino = filtros.reino === 'TODOS' || p.reino === filtros.reino;
      const pEspecie = p.especie?.toLowerCase().trim();
      const fEspecie = filtros.especie.toLowerCase().trim();
      const matchEspecie = fEspecie === 'todos' || pEspecie === fEspecie;
      return matchReino && matchEspecie;
    });
  }, [personajes, filtros]);

  const updateFiltro = (key, value) => {
    setFiltros(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] pb-20 font-sans overflow-x-hidden">
      
      <AnimatePresence>
        {!selected && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <header className="pt-16 mb-12 text-center px-4">
              <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-[#6B5E70] uppercase leading-none break-words">
                Personajes
              </h1>
              <div className="h-1 w-24 bg-[#6B5E70] mx-auto mt-4 rounded-full opacity-20" />
            </header>

            {/* FILTROS */}
            <div className="max-w-5xl mx-auto mb-20 px-6 space-y-10">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-3 w-full max-w-2xl justify-center">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#6B5E70]/20" />
                  <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-[#6B5E70] italic">Reinos</span>
                  <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#6B5E70]/20" />
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <button onClick={() => updateFiltro('reino', 'TODOS')} className={`px-3 py-1.5 rounded-xl text-[9px] md:text-[10px] font-bold uppercase transition-all border ${filtros.reino === 'TODOS' ? 'bg-[#6B5E70] text-white shadow-lg' : 'bg-white text-[#6B5E70]/40 border-transparent'}`}>TODOS</button>
                  {reinosData.map(r => (
                    <button key={r.id} onClick={() => updateFiltro('reino', r.nombre)} className={`px-3 py-1.5 rounded-xl text-[9px] md:text-[10px] font-bold uppercase transition-all border ${filtros.reino === r.nombre ? 'bg-[#6B5E70] text-white shadow-lg' : 'bg-white text-[#6B5E70]/40 border-transparent'}`}>{r.nombre}</button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-3 w-full max-w-md justify-center">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#6B5E70]/20" />
                  <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-[#6B5E70] italic">Especies</span>
                  <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#6B5E70]/20" />
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <button onClick={() => updateFiltro('especie', 'TODOS')} className={`px-3 py-1.5 rounded-xl text-[9px] md:text-[10px] font-bold uppercase transition-all border ${filtros.especie === 'TODOS' ? 'bg-[#6B5E70] text-white shadow-lg' : 'bg-white text-[#6B5E70]/40 border-transparent'}`}>TODOS</button>
                  {especiesConPersonajes.map((c, index) => (
                    <button key={index} onClick={() => updateFiltro('especie', c.nombre)} className={`px-3 py-1.5 rounded-xl text-[9px] md:text-[10px] font-bold uppercase transition-all border ${filtros.especie === c.nombre ? 'bg-[#6B5E70] text-white shadow-lg' : 'bg-white text-[#6B5E70]/40 border-transparent'}`}>{c.nombre}</button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PANEL DE DETALLE */}
      <AnimatePresence mode="wait">
        {selected && (
          <motion.div key="panel" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-6xl mx-auto mb-16 p-4 md:p-6">
            
            <div className="bg-white rounded-[2rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl border border-white relative mb-8">
              <button onClick={() => setSelected(null)} className="absolute top-4 right-4 md:top-8 md:right-8 p-2 md:p-3 bg-[#F0F0F0] text-[#6B5E70] rounded-full hover:bg-[#6B5E70] hover:text-white transition-all z-50">
                <X size={20} />
              </button>
              <div className="flex flex-col lg:flex-row items-center lg:items-stretch">
                <div className="w-full lg:w-1/2 aspect-square">
                  <img src={selected.img_url} alt={selected.nombre} className="w-full h-full object-cover" />
                </div>
                <div className="w-full lg:w-1/2 p-6 md:p-12 flex flex-col justify-center">
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-3 py-1 bg-[#6B5E70]/10 text-[#6B5E70] text-[8px] md:text-[10px] font-black uppercase rounded-lg tracking-widest border border-[#6B5E70]/5">Reino: {selected.reino}</span>
                    <span className="px-3 py-1 bg-[#6B5E70] text-white text-[8px] md:text-[10px] font-black uppercase rounded-lg tracking-widest">{selected.especie || 'Desconocido'}</span>
                  </div>
                  <h2 className="text-4xl md:text-6xl lg:text-8xl font-black uppercase italic text-[#6B5E70] leading-[0.9] tracking-tighter break-words mb-6">
                    {selected.nombre}
                  </h2>
                  <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    <p className="text-[#6B5E70]/70 text-sm md:text-lg italic leading-relaxed font-medium">
                      {selected.sobre}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTONES DE CANCIONES (Abajo de la tarjeta) */}
            {selected.canciones && selected.canciones.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="flex flex-col items-center space-y-6"
              >
                <div className="flex items-center space-x-4 w-full max-w-xl">
                  <div className="h-[1px] flex-1 bg-[#6B5E70]/20" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#6B5E70]/60 italic flex items-center">
                    <Music size={14} className="mr-2" /> Crónicas Musicales
                  </span>
                  <div className="h-[1px] flex-1 bg-[#6B5E70]/20" />
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                  {selected.canciones.map((url, idx) => (
                    <a 
                      key={idx} 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group flex items-center space-x-4 bg-[#6B5E70] text-white px-8 py-4 rounded-2xl md:rounded-3xl hover:bg-[#FF0000] hover:scale-105 transition-all duration-300 shadow-xl shadow-[#6B5E70]/10"
                    >
                      <Youtube size={24} className="text-white fill-current" />
                      <div className="text-left leading-tight">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 group-hover:opacity-100">YouTube</p>
                        <p className="text-sm md:text-lg font-black uppercase italic tracking-tighter">Escuchar Tema {idx + 1}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </motion.div>
            )}

          </motion.div>
        )}
      </AnimatePresence>

      {/* GRID DE RESULTADOS */}
      <main className="p-4 md:p-8 max-w-[1600px] mx-auto">
        {loading ? (
          <div className="py-20 text-center animate-pulse text-[#6B5E70] font-black uppercase text-xs tracking-widest">Cargando...</div>
        ) : (
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6">
            {filtered.map(p => (
              <motion.div 
                key={p.id} 
                layout 
                onClick={() => { setSelected(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                className="group relative aspect-[3/4] overflow-hidden rounded-[1.5rem] md:rounded-[2.8rem] cursor-pointer bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl shadow-sm"
              >
                <img src={p.img_url} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" alt={p.nombre} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#6B5E70] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 right-4 md:right-6">
                  <p className="text-[6px] md:text-[8px] font-black text-white/50 uppercase tracking-[0.2em] mb-1">{p.reino} • {p.especie}</p>
                  <h3 className="text-sm md:text-xl font-black text-white uppercase italic leading-none tracking-tighter">{p.nombre}</h3>
                </div>
                <div className="absolute top-0 w-full h-1" style={{ backgroundColor: p.color_hex || '#6B5E70' }} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}