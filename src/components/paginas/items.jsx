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
        const { data, error } = await supabase
          .from('items') 
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        if (data) {
          setItems(data);
          setFiltered(data);
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

  useEffect(() => {
    setFiltered(activeFilter === 'TODOS' 
      ? items 
      : items.filter(i => i.categoria === activeFilter)
    );
  }, [activeFilter, items]);

  return (
    <div className="min-h-screen bg-[#EBEBEB] pb-20 font-sans text-zinc-900">
      {/* HEADER */}
      <AnimatePresence>
        {!selected && (
          <motion.header 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="p-8 max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-end gap-6 border-b border-zinc-200"
          >
            <div>
              <h1 className="text-4xl font-black italic text-[#6B5E70] uppercase tracking-tighter">
                {activeFilter === 'TODOS' ? 'Inventario' : activeFilter}
              </h1>
              <p className="text-[#6B5E70]/60 italic text-sm mt-1 border-l-2 border-[#6B5E70]/20 pl-4">
                Total de registros: {filtered.length}
              </p>
            </div>

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
          </motion.header>
        )}
      </AnimatePresence>

      {/* GRID PRINCIPAL */}
      <main className="p-8 max-w-[1600px] mx-auto">
        {loading ? (
          <div className="text-center py-20 font-black uppercase text-[#6B5E70] animate-pulse">Sincronizando...</div>
        ) : (
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {filtered.map(item => (
              <motion.div 
                key={item.id} 
                layout 
                onClick={() => setSelected(item)} 
                className="char-card group bg-white relative cursor-pointer overflow-hidden border-t-4 border-[#6B5E70]/20 hover:border-[#6B5E70] transition-all duration-500"
              >
                {/* CONTENEDOR DE IMAGEN CON DEGRADADO (Estilo Personajes) */}
                <div className="relative aspect-[4/5] overflow-hidden">
                   <img 
                    src={item.imagen_url} 
                    className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700 ease-out mix-blend-multiply" 
                    style={{
                      maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
                      WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)'
                    }}
                    alt={item.nombre} 
                   />
                   
                   {/* Overlay de degradado inferior para el texto */}
                   <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80" />
                </div>

                {/* INFO DE LA CARD */}
                <div className="absolute bottom-0 left-0 w-full p-4 z-10">
                  <span className="text-[9px] font-black uppercase text-[#6B5E70]/50 tracking-[0.2em]">
                    {item.categoria}
                  </span>
                  <h3 className="text-sm font-black uppercase italic text-zinc-800 leading-tight truncate">
                    {item.nombre}
                  </h3>
                </div>

                {/* Badge flotante que aparece al hacer hover */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-2 h-2 rounded-full bg-[#6B5E70] animate-ping" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* LORE PANEL (Solo se muestra al seleccionar) */}
      <AnimatePresence>
        {selected && (
          <motion.div 
            initial={{ opacity: 0, x: 100 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: 100 }} 
            className="lore-panel"
          >
            <div className="lore-panel-layout">
              <button onClick={() => setSelected(null)} className="btn-close-panel"><X size={24} /></button>
              <div className="lore-image-container bg-white flex items-center justify-center">
                <img src={selected.imagen_url} className="mix-blend-multiply object-contain p-12 max-h-[500px]" alt={selected.nombre} />
              </div>
              <div className="lore-content">
                <span className="badge-reino !bg-[#6B5E70] !text-white uppercase">{selected.categoria}</span>
                <h2 className="text-6xl md:text-8xl font-black uppercase italic mt-4 tracking-tighter leading-none">{selected.nombre}</h2>
                <p className="lore-description mt-8">{selected.descripcion || "Sin descripción adicional."}</p>
                <div className="mt-12 pt-6 border-t border-zinc-200 opacity-40 text-[10px] font-black uppercase tracking-widest">
                  Registro: {new Date(selected.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}