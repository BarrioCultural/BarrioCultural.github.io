"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { GalleryGrid, GalleryItem } from "@/components/recursos/display/gallery";
import DetalleMaestro from "@/components/recursos/boxes/detalles";

export default function Criaturas() {
  const [criaturas, setCriaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const [opcionesFiltros, setOpcionesFiltros] = useState({
    habitat: ['todos'],
    pensamiento: ['todos'],
    alma: ['todos']
  });

  const [filtros, setFiltros] = useState({
    habitat: 'todos',
    pensamiento: 'todos',
    alma: 'todos'
  });

  useEffect(() => {
    const fetchOpciones = async () => {
      const { data } = await supabase.from('criaturas').select('habitat, pensamiento, alma');
      if (data) {
        const extraerUnicos = (campo) => {
          const valores = data.map(item => item[campo]).filter(Boolean);
          return ['todos', ...new Set(valores)].sort();
        };
        setOpcionesFiltros({
          habitat: extraerUnicos('habitat'),
          pensamiento: extraerUnicos('pensamiento'),
          alma: extraerUnicos('alma')
        });
      }
    };
    fetchOpciones();
  }, []);

  useEffect(() => {
    const fetchCriaturas = async () => {
      setLoading(true);
      let query = supabase.from('criaturas').select('*').order('nombre', { ascending: true });
      if (filtros.habitat !== 'todos') query = query.eq('habitat', filtros.habitat);
      if (filtros.pensamiento !== 'todos') query = query.eq('pensamiento', filtros.pensamiento);
      if (filtros.alma !== 'todos') query = query.eq('alma', filtros.alma);

      const { data } = await query;
      setCriaturas(data || []);
      setLoading(false);
    };
    fetchCriaturas();
  }, [filtros]);

  const updateFiltro = (grupo, valor) => setFiltros(prev => ({ ...prev, [grupo]: valor }));

  // Selección optimizada
  const handleSelect = (c) => {
    setSelected(c);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // --- CABECERA Y FILTROS ---
  const MiMenuBestiario = (
    <div className="pt-16">
      <header className="mb-12 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-primary uppercase leading-none">
          Bestiario
        </h1>
        <div className="h-1.5 w-24 bg-primary mx-auto mt-4 rounded-full opacity-20" />
      </header>

      <div className="max-w-5xl mx-auto mb-16 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.entries(opcionesFiltros).map(([grupo, opciones]) => (
            <div key={grupo} className="flex flex-col items-center space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 italic">{grupo}</span>
              <div className="flex flex-wrap justify-center gap-2">
                {opciones.map(opt => (
                  <button
                    key={opt}
                    onClick={() => updateFiltro(grupo, opt)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all border ${
                      filtros[grupo] === opt ? 'bg-primary text-white shadow-lg scale-105' : 'bg-white/50 text-primary/60 border-transparent hover:border-primary/20'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-bg-main pb-20 font-sans overflow-x-hidden">
      
      {/* EL NUEVO DETALLE UNIFICADO */}
      <DetalleMaestro 
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        data={selected}
        tags={[selected?.habitat, selected?.alma ? `Alma ${selected.alma}` : null]}
        mostrarMusica={false} // Las criaturas no tienen música por ahora
      />

      {/* GRID MAESTRO */}
      {loading ? (
        <div className="py-20 text-center text-primary/30 font-black uppercase text-[10px] tracking-widest animate-pulse">
          Sincronizando Archivos...
        </div>
      ) : (
        <GalleryGrid 
          isDetailOpen={!!selected} 
          headerContent={MiMenuBestiario}
        >
          {criaturas.map(c => (
            <GalleryItem 
              key={c.id} 
              src={c.imagen_url} 
              onClick={() => handleSelect(c)}
            >
              <p className="text-[8px] font-black text-white/50 uppercase tracking-[0.2em] mb-1">
                {c.habitat} • {c.alma}
              </p>
              <h3 className="text-xl font-black text-white uppercase italic leading-none tracking-tighter">
                {c.nombre}
              </h3>
            </GalleryItem>
          ))}
        </GalleryGrid>
      )}
    </main>
  );
}