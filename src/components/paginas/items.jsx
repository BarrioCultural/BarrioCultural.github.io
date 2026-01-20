"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

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
      
      // 1. Cargar Items usando la nueva columna 'categoria'
      try {
        const { data: itemsData, error: itemsError } = await supabase
          .from('items') 
          .select('*')
          .order('created_at', { ascending: false });
        
        if (itemsError) throw itemsError;
        if (itemsData) {
          setItems(itemsData);
          setFiltered(itemsData);
        }
      } catch (err) {
        console.error("Error cargando items:", err.message);
      }

      // 2. Cargar Categorías para los botones superiores
      try {
        const { data: catData } = await supabase
          .from('categorias_items') 
          .select('*')
          .order('orden', { ascending: true });
        
        if (catData) setCategoriasData(catData);
      } catch (err) {
        console.warn("Tabla categorias_items no disponible.");
      }

      setLoading(false);
    };
    fetchData();
  }, []);

  // Lógica de filtrado actualizada a 'categoria'
  useEffect(() => {
    setFiltered(activeFilter === 'TODOS' 
      ? items 
      : items.filter(i => i.categoria === activeFilter)
    );
  }, [activeFilter, items]);

  const currentCategoria = categoriasData.find(c => c.nombre === activeFilter);

  return (
    <div className="min-h-screen bg-[#EBEBEB] pb-20 font-sans">
      <AnimatePresence>
        {!selected && (
          <motion.header 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: "auto" }} 
            exit={{ opacity: 0, height: 0 }} 
            className="bg-[#EBEBEB] border-b border-zinc-200 overflow-hidden"
          >
            <div className="p-8 max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-end gap-6">
              <div className="max-w-2xl">
                <h1 className="text-4xl font-black italic text-[#6B5E70] uppercase tracking-tighter">
                  {activeFilter === 'TODOS' ? 'Inventario' : activeFilter}
                </h1>
                <motion.p key={activeFilter} className="text-[#6B5E70]/80 italic text-sm font-medium mt-2 border-l-2 border-[#6B5E70]/20 pl-4">
                  {activeFilter === 'TODOS' 
                    ? `Objetos registrados: ${items.length}` 
                    : currentCategoria?.descripcion || "Especificaciones del equipo."}
                </motion.p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setActiveFilter('TODOS')} 
                  className={`filter-pill uppercase ${activeFilter === 'TODOS' ? 'filter-pill-active' : 'filter-pill-inactive'}`}
                >
                  TODOS
                </button>
                {categoriasData.map(c => (
                  <button 
                    key={c.id} 
                    onClick={() => setActiveFilter(c.nombre)} 
                    className={`filter-pill uppercase ${activeFilter === c.nombre ? 'filter-pill-active' : 'filter-pill-inactive'}`}
                  >
                    {c.nombre}
                  </button>
                ))}
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {selected && (
          <motion.div key="panel" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lore-panel">
            <div className="lore-panel-layout">
              <button onClick={() => setSelected(null)} className="btn-close-panel"><X size={24} /></button>
              <div className="lore-image-container bg-white flex items-center justify-center">
                <img src={selected.imagen_url} alt={selected.nombre} className="mix-blend-multiply object-contain p-10 max-h-[500px]" />
              </div>
              <div className="lore-content">
                <span className="px-4 py-1 bg-[#6B5E70] text-white text-[10px] font-black uppercase rounded-full tracking-widest">
                  Categoría: {selected.categoria}
                </span>
                <h2 className="text-5xl md:text-8xl font-black uppercase italic text-zinc-900 mt-4 leading-none tracking-tighter">
                  {selected.nombre}
                </h2>
                <p className="lore-description">{selected.descripcion || "Sin descripción disponible."}</p>
                <div className="mt-8 pt-6 border-t border-zinc-100 opacity-30 text-[10px] font-black uppercase tracking-[0.3em]">
                   REGISTRO: {new Date(selected.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="p-8 max-w-[1600px] mx-auto">
        {loading ? (
          <div className="py-20 text-center">
             <p className="text-[#6B5E70] font-black uppercase text-xs tracking-widest animate-pulse">Sincronizando Manifiesto...</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filtered.map(item => (
              <motion.div 
                key={item.id} 
                layout 
                onClick={() => setSelected(item)} 
                className={`char-card group bg-white ${selected?.id === item.id ? 'char-card-selected' : ''}`}
              >
                <div className="w-full h-full p-6 flex items-center justify-center">
                   <img src={item.imagen_url} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" alt={item.nombre} />
                </div>
                <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="badge-reino uppercase">{item.categoria}</span>
                </div>
                <p className="absolute bottom-4 left-4 text-[#6B5E70] text-[11px] font-black uppercase tracking-wider">{item.nombre}</p>
                <div className="absolute top-0 w-full h-1 bg-[#6B5E70]/20" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}