"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { GalleryGrid, GalleryItem } from "@/components/recursos/display/gallery";
import { motion, AnimatePresence } from 'framer-motion';
import { X, Music } from 'lucide-react';

export default function PersonajesGrid() {
  const [personajes, setPersonajes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para filtros
  const [filtroReino, setFiltroReino] = useState('todos');
  const [filtroEspecie, setFiltroEspecie] = useState('todos');

  useEffect(() => {
    const fetchChars = async () => {
      setLoading(true);
      const { data } = await supabase.from('personajes').select('*').order('id', { ascending: true });
      setPersonajes(data || []);
      setLoading(false);
    };
    fetchChars();
  }, []);

  // Lógica de filtrado
  const reinos = useMemo(() => ['todos', ...new Set(personajes.map(p => p.reino))], [personajes]);
  const especies = useMemo(() => ['todos', ...new Set(personajes.map(p => p.especie))], [personajes]);

  const filtrados = useMemo(() => {
    return personajes.filter(p => {
      const matchReino = filtroReino === 'todos' || p.reino === filtroReino;
      const matchEspecie = filtroEspecie === 'todos' || p.especie === filtroEspecie;
      return matchReino && matchEspecie;
    });
  }, [personajes, filtroReino, filtroEspecie]);

  const btnStyle = (isActive) => `
    px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all border 
    ${isActive ? 'bg-primary text-white border-primary shadow-lg scale-105' : 'bg-white/50 text-primary/60 border-transparent hover:border-primary/20'}
  `;

  // --- EL MENU DE FILTROS ---
  const MiMenuDeFiltros = (
    <header className="mb-16 text-center px-4">
      <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter text-primary uppercase leading-none mb-12">
        Personajes
      </h1>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col items-center space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-primary/30 italic">Reinos</span>
          <div className="flex flex-wrap justify-center gap-2">
            {reinos.map(r => (
              <button key={r} onClick={() => setFiltroReino(r)} className={btnStyle(filtroReino === r)}>{r}</button>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-primary/30 italic">Especies</span>
          <div className="flex flex-wrap justify-center gap-2">
            {especies.map(e => (
              <button key={e} onClick={() => setFiltroEspecie(e)} className={btnStyle(filtroEspecie === e)}>{e}</button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );

  return (
    <main className="min-h-screen bg-bg-main py-20 px-4 md:px-8">
      
      {/* DETALLE DEL PERSONAJE (Aparece arriba si hay uno seleccionado) */}
      <AnimatePresence mode="wait">
        {selected && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-7xl mx-auto mb-20 relative"
          >
            <div className="bg-white rounded-[3rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl min-h-[600px]">
              <button 
                onClick={() => setSelected(null)} 
                className="absolute top-8 right-8 z-50 p-3 bg-bg-main text-primary rounded-full hover:bg-primary hover:text-white transition-all shadow-lg"
              >
                <X size={24} />
              </button>
              
              <div className="w-full lg:w-1/2 aspect-square lg:aspect-auto">
                <img src={selected.img_url} className="w-full h-full object-cover" alt={selected.nombre} />
              </div>

              <div className="w-full lg:w-1/2 p-10 md:p-20 flex flex-col justify-center">
                <div className="flex gap-3 mb-6">
                  <span className="px-4 py-1 bg-primary text-white text-[10px] font-black uppercase rounded-full tracking-widest">
                    {selected.reino}
                  </span>
                  <span className="px-4 py-1 border border-primary text-primary text-[10px] font-black uppercase rounded-full tracking-widest">
                    {selected.especie}
                  </span>
                </div>
                
                <h2 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter text-primary leading-none mb-8">
                  {selected.nombre}
                </h2>
                
                <p className="text-primary/70 text-xl italic font-medium border-l-4 border-primary pl-6 mb-12">
                  {selected.sobre}
                </p>

                {/* CANCIONES DESDE SUPABASE */}
                {(selected.cancion_nombre || selected.cancion_url) && (
                  <div className="bg-bg-main/10 p-8 rounded-[2rem] border border-primary/10">
                    <div className="flex items-center gap-3 mb-4 text-primary">
                      <Music size={20} />
                      <span className="text-xs font-black uppercase tracking-widest">Tema Musical</span>
                    </div>
                    <h4 className="text-2xl font-black text-primary uppercase italic mb-4">
                      {selected.cancion_nombre || "Desconocido"}
                    </h4>
                    {selected.cancion_url && (
                      <audio controls className="w-full mix-blend-multiply opacity-80">
                        <source src={selected.cancion_url} type="audio/mpeg" />
                      </audio>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REJILLA UNIFICADA (Maneja el menú automáticamente) */}
      {loading ? (
        <div className="text-center font-black uppercase text-[10px] tracking-widest opacity-20 py-40">Indexando...</div>
      ) : (
        <GalleryGrid 
          isDetailOpen={!!selected} 
          headerContent={MiMenuDeFiltros}
        >
          {filtrados.map(p => (
            <GalleryItem 
              key={p.id} 
              src={p.img_url} 
              color={p.color_hex} 
              onClick={() => { setSelected(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              <p className="text-[8px] font-black text-white/50 uppercase tracking-widest mb-1">
                {p.reino} • {p.especie}
              </p>
              <h3 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">
                {p.nombre}
              </h3>
            </GalleryItem>
          ))}
        </GalleryGrid>
      )}
    </main>
  );
}