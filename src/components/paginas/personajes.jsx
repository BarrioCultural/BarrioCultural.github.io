"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const PureGridLore = () => {
  const [personajes, setPersonajes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLore = async () => {
      setLoading(true);
      try {
        // Conexión a la tabla 'personajes' (Segunda captura)
        const { data, error } = await supabase
          .from('personajes')
          .select('*')
          .order('id', { ascending: true });
        
        if (data) setPersonajes(data);
        if (error) console.error("Error cargando personajes:", error.message);
      } catch (err) {
        console.error("Error de sistema:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLore();
  }, []);

  const handleSelect = (p) => {
    if (selected?.id === p.id) {
      setSelected(null);
    } else {
      setSelected(p);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#EBEBEB] font-sans pb-20">
      
      {/* HEADER */}
      <header className="p-6 md:p-8 sticky top-0 z-40 bg-[#EBEBEB]/90 backdrop-blur-md border-b border-zinc-200">
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter italic text-zinc-900 uppercase">
          {selected ? `Explorando / ${selected.nombre}` : "Personajes"}
        </h1>
      </header>

      {/* PANEL DE INFORMACIÓN */}
      <AnimatePresence mode="wait">
        {selected && (
          <motion.div
            key="info-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white overflow-hidden shadow-2xl border-b border-zinc-300 relative"
          >
            <div className="p-6 md:p-12 max-w-7xl mx-auto flex flex-col md:flex-row gap-8 md:gap-16 items-center">
              
              {/* IMAGEN GRANDE - Usando img_url según tu captura */}
              <motion.div 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="w-full md:w-[500px] aspect-square rounded-[2rem] overflow-hidden shadow-2xl shrink-0 bg-zinc-100"
              >
                {selected.img_url ? (
                  <img src={selected.img_url} className="w-full h-full object-cover" alt={selected.nombre} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-300 font-bold uppercase tracking-widest bg-zinc-50 italic text-xs">
                    Visual_Data_Missing
                  </div>
                )}
              </motion.div>

              {/* TEXTO DE LA HISTORIA */}
              <div className="flex-1 relative w-full">
                <button 
                  onClick={() => setSelected(null)}
                  className="absolute -top-12 right-0 md:top-0 md:right-0 p-3 bg-zinc-100 rounded-full text-zinc-500 hover:text-black transition-colors"
                >
                  <X size={24} />
                </button>
                
                <h2 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter text-zinc-900 mb-6 leading-none">
                  {selected.nombre}
                </h2>
                
                {/* Usando columna 'sobre' para la descripción larga */}
                <p className="text-xl md:text-3xl text-zinc-700 font-medium leading-tight border-l-8 border-zinc-900 pl-8">
                  {selected.sobre || "Cargando descripción del archivo..."}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GRID DE PERSONAJES */}
      <main className="p-4 md:p-8 max-w-[1600px] mx-auto">
        {loading ? (
          <div className="text-center py-20 font-black italic text-zinc-400 animate-pulse">SINCRONIZANDO...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {personajes.map((p) => (
              <motion.div
                key={p.id}
                layout
                onClick={() => handleSelect(p)}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative aspect-square cursor-pointer overflow-hidden transition-all duration-500
                  ${selected?.id === p.id 
                    ? 'rounded-[3rem] ring-8 ring-zinc-900 z-20 scale-95' 
                    : 'rounded-2xl grayscale hover:grayscale-0 hover:rounded-[2.5rem]'
                  }
                `}
              >
                {/* Usando img_url */}
                <img src={p.img_url} className="w-full h-full object-cover pointer-events-none" alt={p.nombre} />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60" />
                
                <div className="absolute bottom-4 left-4">
                  <p className="text-white text-[10px] font-black uppercase tracking-widest truncate">
                    {p.nombre}
                  </p>
                </div>

                {/* Línea de acento usando color_hex */}
                <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: p.color_hex }} />
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <style jsx global>{`
        body { background-color: #EBEBEB; margin: 0; }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default PureGridLore;