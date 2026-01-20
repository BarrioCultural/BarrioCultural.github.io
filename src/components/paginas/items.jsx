"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Box, Shield, Zap } from 'lucide-react';

export default function PureGridItems() {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categoriasData, setCategoriasData] = useState([]); 
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('TODOS');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Consultamos la tabla de items y la de categorías (o tipos)
        const [itemsRes, catRes] = await Promise.all([
          supabase
            .from('items') // Cambia 'items' por el nombre de tu tabla
            .select('*')
            .order('id', { ascending: true }),
          supabase
            .from('categorias_items') // Cambia por tu tabla de categorías
            .select('*')
            .order('orden', { ascending: true })
        ]);
        
        if (itemsRes.data) {
          setItems(itemsRes.data);
          setFiltered(itemsRes.data);
        }
        if (catRes.data) {
          setCategoriasData(catRes.data);
        }
      } catch (err) {
        console.error("Error en la sincronización:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Lógica de filtrado por categoría
  useEffect(() => {
    setFiltered(activeFilter === 'TODOS' 
      ? items 
      : items.filter(i => i.categoria === activeFilter)
    );
  }, [activeFilter, items]);

  const currentCategoria = categoriasData.find(c => c.nombre === activeFilter);

  const handleSelect = (item) => {
    setSelected(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#EBEBEB] pb-20 font-sans">
      {/* HEADER DINÁMICO */}
      <AnimatePresence>
        {!selected && (
          <motion.header 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, height: 0 }} 
            className="bg-[#EBEBEB] border-b border-zinc-200 overflow-hidden"
          >
            <div className="p-8 max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-end gap-6">
              <div className="max-w-2xl">
                <h1 className="text-5xl font-black italic text-[#4A4A4A] uppercase tracking-tighter leading-none">
                  {activeFilter === 'TODOS' ? 'Inventario' : activeFilter}
                </h1>
                
                <motion.p 
                  key={activeFilter}
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }}
                  className="text-[#4A4A4A]/70 italic text-sm font-medium mt-4 border-l-2 border-[#6B5E70]/40 pl-4"
                >
                  {activeFilter === 'TODOS' 
                    ? `Equipamiento disponible: ${items.length} objetos registrados.` 
                    : currentCategoria?.descripcion || "Explorando especificaciones técnicas..."}
                </motion.p>
              </div>

              {/* FILTROS DE CATEGORÍA */}
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setActiveFilter('TODOS')} 
                  className={`px-4 py-1 text-[10px] font-black tracking-widest border-2 transition-all uppercase ${activeFilter === 'TODOS' ? 'bg-[#6B5E70] border-[#6B5E70] text-white' : 'border-zinc-300 text-zinc-500 hover:border-zinc-400'}`}
                >
                  TODOS
                </button>
                {categoriasData.map(c => (
                  <button 
                    key={c.id} 
                    onClick={() => setActiveFilter(c.nombre)} 
                    className={`px-4 py-1 text-[10px] font-black tracking-widest border-2 transition-all uppercase ${activeFilter === c.nombre ? 'bg-[#6B5E70] border-[#6B5E70] text-white' : 'border-zinc-300 text-zinc-500 hover:border-zinc-400'}`}
                  >
                    {c.nombre}
                  </button>
                ))}
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* PANEL DE DETALLE DEL ITEM */}
      <AnimatePresence mode="wait">
        {selected && (
          <motion.div 
            key="panel" 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.95 }} 
            className="max-w-[1600px] mx-auto p-8"
          >
            <div className="bg-white border border-zinc-200 flex flex-col md:flex-row relative overflow-hidden shadow-sm">
              <button 
                onClick={() => setSelected(null)} 
                className="absolute top-6 right-6 z-10 p-2 hover:bg-zinc-100 rounded-full transition-colors"
              >
                <X size={28} className="text-zinc-400" />
              </button>
              
              {/* Imagen del Item */}
              <div className="w-full md:w-1/2 bg-zinc-100 aspect-square md:aspect-auto">
                <img 
                  src={selected.imagen_url} 
                  alt={selected.nombre} 
                  className="w-full h-full object-cover mix-blend-multiply opacity-90"
                />
              </div>

              {/* Info del Item */}
              <div className="flex-1 p-10 md:p-16 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-6">
                  <span className="px-3 py-1 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                    {selected.categoria}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                    ID: #{selected.id.toString().padStart(4, '0')}
                  </span>
                </div>

                <h2 className="text-6xl md:text-8xl font-black uppercase italic text-zinc-900 leading-[0.8] tracking-tighter">
                  {selected.nombre}
                </h2>

                <div className="mt-8 space-y-6">
                  <p className="text-zinc-500 text-lg md:text-xl font-medium leading-relaxed italic max-w-xl">
                    "{selected.descripcion}"
                  </p>
                  
                  {/* Stats o Atributos del Item (Ejemplos) */}
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-zinc-100">
                    <div>
                      <span className="block text-[10px] font-black text-zinc-400 uppercase">Estado</span>
                      <span className="text-sm font-bold text-zinc-800 uppercase">{selected.estado || 'Operativo'}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-black text-zinc-400 uppercase">Rareza</span>
                      <span className="text-sm font-bold uppercase" style={{ color: selected.color_hex }}>
                        {selected.rareza || 'Común'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GRID DE CARDS */}
      <main className="p-8 max-w-[1600px] mx-auto">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center gap-4">
             <div className="w-10 h-10 border-4 border-zinc-200 border-t-[#6B5E70] rounded-full animate-spin"></div>
             <p className="text-[#6B5E70] font-black uppercase text-[10px] tracking-widest">Cargando Manifiesto...</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {filtered.map(item => (
              <motion.div 
                key={item.id} 
                layout 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => handleSelect(item)} 
                className={`group relative aspect-square cursor-pointer bg-white border border-zinc-200 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${selected?.id === item.id ? 'ring-2 ring-zinc-900' : ''}`}
              >
                {/* Visual */}
                <div className="p-4 w-full h-full flex items-center justify-center overflow-hidden">
                  <img 
                    src={item.imagen_url} 
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
                    alt={item.nombre} 
                  />
                </div>

                {/* Info Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-white via-white/80 to-transparent">
                  <span className="text-[8px] font-black text-[#6B5E70] uppercase tracking-tighter opacity-70">
                    {item.categoria}
                  </span>
                  <p className="text-zinc-900 text-xs font-black uppercase truncate tracking-tighter">
                    {item.nombre}
                  </p>
                </div>

                <div 
                  className="absolute top-0 left-0 w-full h-1" 
                  style={{ backgroundColor: item.color_hex || '#6B5E70' }} 
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}