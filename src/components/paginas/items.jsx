"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function PureGridItems() {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categoriasMenu, setCategoriasMenu] = useState([]); 
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('TODOS');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Consultamos la tabla 'items' ordenados por creación
        const { data, error } = await supabase
          .from('items')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;

        if (data) {
          setItems(data);
          setFiltered(data);
          // Generamos las categorías dinámicamente desde la columna 'categoria'
          const unicas = [...new Set(data.map(item => item.categoria))].filter(Boolean);
          setCategoriasMenu(unicas);
        }
      } catch (err) {
        console.error("Error en la sincronización de items:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Lógica de filtrado idéntica a PureGridLore
  useEffect(() => {
    setFiltered(activeFilter === 'TODOS' 
      ? items 
      : items.filter(i => i.categoria === activeFilter)
    );
  }, [activeFilter, items]);

  const handleSelect = (item) => {
    setSelected(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#EBEBEB] pb-20">
      {/* HEADER DINÁMICO (Estilo Lore) */}
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
                
                <motion.p 
                  key={activeFilter}
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }}
                  className="text-[#6B5E70]/80 italic text-sm font-medium mt-2 border-l-2 border-[#6B5E70]/20 pl-4"
                >
                  {activeFilter === 'TODOS' 
                    ? `Objetos en el manifiesto: ${items.length}` 
                    : `Explorando la categoría: ${activeFilter.toLowerCase()}`}
                </motion.p>
              </div>

              {/* FILTROS DINÁMICOS */}
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setActiveFilter('TODOS')} 
                  className={`filter-pill uppercase ${activeFilter === 'TODOS' ? 'filter-pill-active' : 'filter-pill-inactive'}`}
                >
                  TODOS
                </button>
                {categoriasMenu.map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setActiveFilter(cat)} 
                    className={`filter-pill uppercase ${activeFilter === cat ? 'filter-pill-active' : 'filter-pill-inactive'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* PANEL DE DETALLE (Lore Panel) */}
      <AnimatePresence mode="wait">
        {selected && (
          <motion.div key="panel" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lore-panel">
            <div className="lore-panel-layout">
              <button onClick={() => setSelected(null)} className="btn-close-panel"><X size={24} /></button>
              
              <div className="lore-image-container bg-white flex items-center justify-center">
                {/* Imagen en detalle con transparencia multiplicada para items */}
                <img 
                    src={selected.imagen_url} 
                    alt={selected.nombre} 
                    className="mix-blend-multiply object-contain p-12 max-h-[500px]" 
                />
              </div>

              <div className="lore-content">
                <span className="px-4 py-1 bg-[#6B5E70] text-white text-[10px] font-black uppercase rounded-full tracking-widest">
                  Categoría: {selected.categoria}
                </span>
                <h2 className="text-5xl md:text-8xl font-black uppercase italic text-zinc-900 mt-4 leading-none tracking-tighter">
                  {selected.nombre}
                </h2>
                <p className="lore-description">{selected.descripcion || "Este objeto no posee una descripción en los archivos."}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GRID DE TARJETAS (Con Degradado como Personajes) */}
      <main className="p-8 max-w-[1600px] mx-auto">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center gap-4">
             <div className="w-10 h-10 border-4 border-[#6B5E70]/20 border-t-[#6B5E70] rounded-full animate-spin"></div>
             <p className="text-[#6B5E70] font-black uppercase text-xs tracking-widest">Sincronizando Inventario...</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filtered.map(item => (
              <motion.div 
                key={item.id} 
                layout 
                onClick={() => handleSelect(item)} 
                className={`char-card group bg-white ${selected?.id === item.id ? 'char-card-selected' : ''}`}
              >
                {/* Contenedor de imagen con máscara de degradado inferior */}
                <div className="relative aspect-[4/5] overflow-hidden">
                    <img 
                        src={item.imagen_url} 
                        className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-700 mix-blend-multiply" 
                        style={{
                            maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
                        }}
                        alt={item.nombre} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent opacity-60" />
                </div>

                <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="badge-reino uppercase !bg-[#6B5E70]">{item.categoria}</span>
                </div>

                <p className="absolute bottom-4 left-4 text-[#6B5E70] text-[11px] font-black uppercase tracking-wider">{item.nombre}</p>
                
                {/* Línea superior estética */}
                <div className="absolute top-0 w-full h-1 bg-[#6B5E70]/10 group-hover:bg-[#6B5E70]/40 transition-colors" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}