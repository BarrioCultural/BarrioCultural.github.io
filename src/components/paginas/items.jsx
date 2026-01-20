"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package } from 'lucide-react'; // Usamos Package para representar Items

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
        const [itemsRes, catRes] = await Promise.all([
          supabase
            .from('items') 
            .select('*')
            .order('id', { ascending: true }),
          supabase
            .from('categorias_items') 
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

  // Lógica de filtrado
  useEffect(() => {
    setFiltered(activeFilter === 'TODOS' 
      ? items 
      : items.filter(i => i.categoria === activeFilter)
    );
  }, [activeFilter, items]);

  const currentCategoria = categoriasData.find(c => c.nombre === activeFilter);

  const handleSelect = (i) => {
    setSelected(i);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#EBEBEB] pb-20 font-sans">
      {/* HEADER DINÁMICO */}
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
                    ? `Objetos registrados: ${items.length}` 
                    : currentCategoria?.descripcion || "Explorando registros de equipo..."}
                </motion.p>
              </div>

              {/* FILTROS ORDENADOS - Estilo pill de PureGridLore */}
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

      {/* PANEL DE DETALLE - Adaptado de Lore Panel */}
      <AnimatePresence mode="wait">
        {selected && (
          <motion.div 
            key="panel" 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: "auto", opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }} 
            className="lore-panel"
          >
            <div className="lore-panel-layout">
              <button onClick={() => setSelected(null)} className="btn-close-panel">
                <X size={24} />
              </button>
              
              <div className="lore-image-container bg-zinc-100">
                <img 
                  src={selected.imagen_url} 
                  alt={selected.nombre} 
                  className="mix-blend-multiply" // Ideal para items con fondo blanco
                />
              </div>

              <div className="lore-content">
                <div className="flex items-center gap-3">
                  <span className="px-4 py-1 bg-[#6B5E70] text-white text-[10px] font-black uppercase rounded-full tracking-widest">
                    {selected.categoria}
                  </span>
                  <span className="text-[10px] font-bold text-[#6B5E70]/50 tracking-widest uppercase">
                    ID: #{selected.id}
                  </span>
                </div>

                <h2 className="text-5xl md:text-8xl font-black uppercase italic text-zinc-900 mt-4 leading-none tracking-tighter">
                  {selected.nombre}
                </h2>
                
                <p className="lore-description">
                  {selected.descripcion}
                </p>

                {/* Info adicional estilo PureGridLore */}
                <div className="flex gap-6 mt-8 pt-6 border-t border-zinc-100">
                   <div>
                      <p className="text-[10px] font-black text-[#6B5E70]/40 uppercase tracking-widest">Estado</p>
                      <p className="text-sm font-bold text-zinc-800 uppercase">{selected.estado || 'Activo'}</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-[#6B5E70]/40 uppercase tracking-widest">Rareza</p>
                      <p className="text-sm font-bold uppercase" style={{ color: selected.color_hex || '#6B5E70' }}>
                        {selected.rareza || 'Estándar'}
                      </p>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GRID DE TARJETAS - Usando clases char-card de PureGridLore */}
      <main className="p-8 max-w-[1600px] mx-auto">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center gap-4">
             <div className="w-10 h-10 border-4 border-[#6B5E70]/20 border-t-[#6B5E70] rounded-full animate-spin"></div>
             <p className="text-[#6B5E70] font-black uppercase text-xs tracking-widest animate-pulse">Sincronizando Inventario...</p>
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
                {/* Contenedor de imagen para items (contain suele ser mejor que cover para objetos) */}
                <div className="w-full h-full p-4 flex items-center justify-center overflow-hidden">
                   <img 
                    src={item.imagen_url} 
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
                    alt={item.nombre} 
                   />
                </div>

                <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="badge-reino uppercase">{item.categoria}</span>
                </div>

                {/* Gradiente sutil para legibilidad del nombre */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-100/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <p className="absolute bottom-4 left-4 text-[#6B5E70] text-[11px] font-black uppercase tracking-wider">
                  {item.nombre}
                </p>

                {/* Línea superior dinámica */}
                <div 
                  className="absolute top-0 w-full h-1" 
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