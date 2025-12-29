"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const PureGridLore = () => {
  const [personajes, setPersonajes] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchLore = async () => {
      const { data } = await supabase
        .from('lore_personajes')
        .select('*')
        .order('nombre', { ascending: true });
      if (data) setPersonajes(data);
    };
    fetchLore();
  }, []);

  const handleSelect = (p) => {
    if (selected?.nombre === p.nombre) {
      setSelected(null);
    } else {
      setSelected(p);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#EBEBEB] font-sans pb-10">
      
      {/* HEADER SIMPLE */}
      <header className="p-8">
        <h1 className="text-4xl font-black tracking-tighter italic text-zinc-900">
          Personajes 
        </h1>
        <div className="h-1 w-12 bg-zinc-900 mt-2" />
      </header>

      {/* PANEL DE INFORMACIÓN (EMPUJA EL GRID) */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0 }}
            className="bg-white overflow-hidden shadow-xl border-b border-zinc-300"
          >
            <div className="p-6 md:p-12 max-w-6xl mx-auto flex flex-col md:flex-row gap-10 items-center">
              
              {/* Imagen Grande en el Info */}
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full md:w-80 aspect-square rounded-[2rem] overflow-hidden shadow-2xl shrink-0"
              >
                <img src={selected.img_url} className="w-full h-full object-cover" alt={selected.nombre} />
              </motion.div>

              {/* Texto */}
              <div className="flex-1 relative">
                <button 
                  onClick={() => setSelected(null)}
                  className="absolute -top-4 -right-4 md:top-0 md:right-0 p-2 text-zinc-400 hover:text-black"
                >
                  <X size={28} strokeWidth={1} />
                </button>
                
                <h2 className="text-6xl font-black uppercase italic tracking-tighter text-zinc-900 mb-6">
                  {selected.nombre}
                </h2>
                
                <p className="text-2xl text-zinc-500 font-light leading-snug italic border-l-4 border-zinc-900 pl-6">
                  {selected.sobre}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GRID DE CUADRADOS */}
      <main className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
        {personajes.map((p, i) => (
          <motion.div
            key={i}
            layout
            onClick={() => handleSelect(p)}
            whileTap={{ scale: 0.96 }}
            className={`
              relative aspect-square cursor-pointer overflow-hidden transition-all duration-500 rounded-lg
              ${selected?.nombre === p.nombre ? 'z-10 scale-[0.98]' : 'hover:rounded-[2rem]'}
            `}
          >
            <img 
              src={p.img_url} 
              className={`w-full h-full object-cover transition-all duration-700 
                ${selected && selected.nombre !== p.nombre ? 'grayscale opacity-30' : 'grayscale-0 opacity-100'}
              `} 
              alt={p.nombre}
            />
            
            {/* Overlay sutil para el nombre */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
            
            <div className="absolute bottom-3 left-3">
              <p className="text-white text-[10px] font-bold uppercase tracking-[0.2em]">
                {p.nombre}
              </p>
            </div>
          </motion.div>
        ))}
      </main>

      <style jsx global>{`
        body { background-color: #EBEBEB; margin: 0; }
      `}</style>
    </div>
  );
};

export default PureGridLore;