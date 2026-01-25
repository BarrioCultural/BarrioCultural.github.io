"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; 
import { GalleryGrid, GalleryItem } from "@/components/recursos/display/gallery";
import DetalleMaestro from "@/components/recursos/boxes/detalles";

export default function Criaturas({ initialData }) {
  // ✅ CARGA INSTANTÁNEA: El estado nace con los datos del servidor
  const [criaturas, setCriaturas] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  // Filtros dinámicos basados en lo que existe en la DB
  const [opcionesFiltros] = useState(() => {
    const extraerUnicos = (campo) => {
      const valores = initialData.map(item => item[campo]).filter(Boolean);
      return ['todos', ...new Set(valores)].sort();
    };
    return {
      habitat: extraerUnicos('habitat'),
      pensamiento: extraerUnicos('pensamiento'),
      alma: extraerUnicos('alma')
    };
  });

  const [filtros, setFiltros] = useState({
    habitat: 'todos',
    pensamiento: 'todos',
    alma: 'todos'
  });

  // ✅ OPTIMIZACIÓN: Solo pedimos a la DB si el usuario cambia un filtro
  useEffect(() => {
    const fetchFiltrado = async () => {
      if (filtros.habitat === 'todos' && filtros.pensamiento === 'todos' && filtros.alma === 'todos') {
        setCriaturas(initialData);
        return;
      }

      setLoading(true);
      let query = supabase.from('criaturas').select('*').order('nombre', { ascending: true });
      
      if (filtros.habitat !== 'todos') query = query.eq('habitat', filtros.habitat);
      if (filtros.pensamiento !== 'todos') query = query.eq('pensamiento', filtros.pensamiento);
      if (filtros.alma !== 'todos') query = query.eq('alma', filtros.alma);

      const { data } = await query;
      setCriaturas(data || []);
      setLoading(false);
    };

    fetchFiltrado();
  }, [filtros, initialData]);

  const updateFiltro = (grupo, valor) => setFiltros(prev => ({ ...prev, [grupo]: valor }));

  const handleSelect = (c) => {
    setSelected(c);
    // Un toque sutil para la experiencia de usuario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ✅ INTERFAZ DE USUARIO (UI)
  const MiMenuBestiario = (
    <div className="pt-16 px-4">
      <header className="mb-12 text-center">
        <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter text-primary uppercase leading-none">
          Bestiario
        </h1>
        <div className="h-1.5 w-24 bg-primary mx-auto mt-4 rounded-full opacity-20" />
      </header>

      <div className="max-w-5xl mx-auto mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white/5 p-8 rounded-3xl backdrop-blur-sm">
          {Object.entries(opcionesFiltros).map(([grupo, opciones]) => (
            <div key={grupo} className="flex flex-col items-center space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 italic">
                {grupo}
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                {opciones.map(opt => (
                  <button
                    key={opt}
                    onClick={() => updateFiltro(grupo, opt)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all duration-300 border ${
                      filtros[grupo] === opt 
                        ? 'bg-primary text-white shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] scale-105 border-primary' 
                        : 'bg-black/20 text-primary/60 border-white/5 hover:border-primary/40'
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
      {/* El detalle se superpone elegantemente */}
      <DetalleMaestro 
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        data={selected}
        // Pasamos tags dinámicos basados en la criatura
        tags={selected ? [selected.habitat, `Alma ${selected.alma}`] : []}
        mostrarMusica={false}
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <span className="text-primary/30 font-black uppercase text-[10px] tracking-widest animate-pulse">
            Sincronizando Archivos...
          </span>
        </div>
      ) : (
        <GalleryGrid isDetailOpen={!!selected} headerContent={MiMenuBestiario}>
          {criaturas.map(c => (
            <GalleryItem 
              key={c.id} 
              src={c.imagen_url} 
              onClick={() => handleSelect(c)}
            >
              <div className="p-4 bg-gradient-to-t from-black/80 to-transparent w-full">
                <p className="text-[8px] font-black text-white/50 uppercase tracking-[0.2em] mb-1">
                  {c.habitat} • {c.alma}
                </p>
                <h3 className="text-xl font-black text-white uppercase italic leading-none tracking-tighter">
                  {c.nombre}
                </h3>
              </div>
            </GalleryItem>
          ))}
        </GalleryGrid>
      )}
    </main>
  );
}