"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function PersonajesGrid() {
  const [personajes, setPersonajes] = useState([]);
  const [reinosData, setReinosData] = useState([]); 
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estado de filtros combinados
  const [filtros, setFiltros] = useState({
    reino: 'TODOS',
    especie: 'TODOS'
  });

  // Lista de especies (puedes traerlas de DB o definirlas aquí)
  const especies = ['TODOS', 'HUMANO', 'ELFO', 'ENANO', 'ORCO', 'MÁGICO'];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [charsRes, reinosRes] = await Promise.all([
          supabase.from('personajes').select('*').order('id', { ascending: true }),
          supabase.from('reinos').select('*').order('orden', { ascending: true })
        ]);
        
        if (charsRes.data) setPersonajes(charsRes.data);
        if (reinosRes.data) setReinosData(reinosRes.data);
      } catch (err) {
        console.error("Error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Lógica de filtrado combinada (Reino + Especie)
  const filtered = useMemo(() => {
    return personajes.filter(p => {
      const matchReino = filtros.reino === 'TODOS' || p.reino === filtros.reino;
      const matchEspecie = filtros.especie === 'TODOS' || p.especie?.toUpperCase() === filtros.especie;
      return matchReino && matchEspecie;
    });
  }, [personajes, filtros]);

  const updateFiltro = (key, value) => {
    setFiltros(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] pb-20 font-sans">
      <AnimatePresence>
        {!selected && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <header className="pt-16 mb-12 text-center">
              <h1 className="text-7xl font-black italic tracking-tighter text-[#6B5E70] uppercase leading-none">
                Personajes
              </h1>
              <div className="h-1 w-24 bg-[#6B5E70] mx-auto mt-4 rounded-full opacity-20" />
            </header>

            {/* SECCIÓN DE FILTROS DOBLE FILA */}
            <div className="max-w-5xl mx-auto mb-20 px-6 space-y-10">
              
              {/* FILTRO: REINOS */}
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-3 w-full max-w-2xl justify-center">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#6B5E70]/20" />
                  <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#6B5E70] italic">Reinos</span>
                  <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#6B5E70]/20" />
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <button 
                    onClick={() => updateFiltro('reino', 'TODOS')}
                    className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all border ${filtros.reino === 'TODOS' ? 'bg-[#6B5E70] text-white' : 'bg-white text-[#6B5E70]/40 border-transparent hover:text-[#6B5E70]'}`}
                  >
                    TODOS
                  </button>
                  {reinosData.map(r => (
                    <button 
                      key={r.id} 
                      onClick={() => updateFiltro('reino', r.nombre)}
                      className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all border ${filtros.reino === r.nombre ? 'bg-[#6B5E70] text-white shadow-lg' : 'bg-white text-[#6B5E70]/40 border-transparent hover:text-[#6B5E70]'}`}
                    >
                      {r.nombre}
                    </button>
                  ))}
                </div>
              </div>

              {/* FILTRO: ESPECIES */}
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-3 w-full max-w-md justify-center">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#6B5E70]/20" />
                  <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#6B5E70] italic">Especies</span>
                  <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#6B5E70]/20" />
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {especies.map(e => (
                    <button 
                      key={e} 
                      onClick={() => updateFiltro('especie', e)}
                      className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all border ${filtros.especie === e ? 'bg-[#6B5E70] text-white shadow-lg' : 'bg-white text-[#6B5E70]/40 border-transparent hover:text-[#6B5E70]'}`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PANEL DE DETALLE (Lore ampliado) */}
      <AnimatePresence mode="wait">
        {selected && (
          <motion.div key="panel" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-6xl mx-auto mb-16 p-4">
            <div className="bg-white rounded-[3.5rem] overflow-hidden shadow-2xl border border-white p-10 relative">
              <button onClick={() => setSelected(null)} className="absolute top-8 right-8 p-3 bg-[#F0F0F0] text-[#6B5E70] rounded-full hover:bg-[#6B5E70] hover:text-white transition-all"><X size={24} /></button>
              
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="rounded-[3rem] overflow-hidden shadow-2xl aspect-square bg-gray-100">
                  <img src={selected.img_url} alt={selected.nombre} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-6">
                  <div className="flex gap-3">
                    <span className="px-4 py-1 bg-[#6B5E70]/10 text-[#6B5E70] text-[10px] font-black uppercase rounded-lg tracking-widest border border-[#6B5E70]/5">Reino: {selected.reino}</span>
                    <span className="px-4 py-1 bg-[#6B5E70] text-white text-[10px] font-black uppercase rounded-lg tracking-widest">{selected.especie || 'Registro Desconocido'}</span>
                  </div>
                  <h2 className="text-8xl font-black uppercase italic text-[#6B5E70] leading-[0.85] tracking-tighter">{selected.nombre}</h2>
                  <p className="text-[#6B5E70]/70 text-lg italic leading-relaxed font-medium">{selected.sobre}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GRID DE RESULTADOS */}
      <main className="p-8 max-w-[1600px] mx-auto">
        {loading ? (
          <div className="py-20 text-center animate-pulse text-[#6B5E70] font-black uppercase text-xs tracking-widest">Accediendo a la base de datos...</div>
        ) : (
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filtered.map(p => (
              <motion.div 
                key={p.id} 
                layout 
                onClick={() => { setSelected(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                className="group relative aspect-[3/4] overflow-hidden rounded-[2.8rem] cursor-pointer bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                <img src={p.img_url} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" alt={p.nombre} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#6B5E70] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-[8px] font-black text-white/50 uppercase tracking-[0.3em] mb-1">{p.reino} • {p.especie}</p>
                  <h3 className="text-xl font-black text-white uppercase italic leading-none tracking-tighter">{p.nombre}</h3>
                </div>
                {/* Indicador de color dinámico */}
                <div className="absolute top-0 w-full h-1" style={{ backgroundColor: p.color_hex || '#6B5E70' }} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}