"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase'; 
import { GalleryGrid, GalleryItem } from "@/components/recursos/display/gallery";
import DetalleMaestro from "@/components/recursos/boxes/detalles";

export default function Criaturas({ initialData = [] }) {
  // ✅ SIN DEMORA: El estado inicia con los datos que ya trajo el servidor
  const [criaturas, setCriaturas] = useState(initialData);
  const [selected, setSelected] = useState(null);
  const [filtros, setFiltros] = useState({ habitat: 'todos', alma: 'todos' });

  // Sincronización: Si initialData cambia, actualizamos (por si acaso)
  useEffect(() => {
    if (initialData?.length > 0) {
      setCriaturas(initialData);
    }
  }, [initialData]);

  // ✅ FILTROS INSTANTÁNEOS (Sin llamar a la DB de nuevo si no es necesario)
  const filtrados = useMemo(() => {
    return criaturas.filter(c => {
      const matchHabitat = filtros.habitat === 'todos' || c.habitat === filtros.habitat;
      const matchAlma = filtros.alma === 'todos' || c.alma === filtros.alma;
      return matchHabitat && matchAlma;
    });
  }, [criaturas, filtros]);

  // Generar opciones de botones automáticamente
  const opciones = useMemo(() => ({
    habitat: ['todos', ...new Set(criaturas.map(c => c.habitat))].filter(Boolean),
    alma: ['todos', ...new Set(criaturas.map(c => c.alma))].filter(Boolean)
  }), [criaturas]);

  const handleSelect = (c) => {
    setSelected(c);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const MiMenu = (
    <div className="pt-16 px-4 max-w-5xl mx-auto mb-12">
      <header className="mb-12 text-center">
        <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter text-primary uppercase leading-none">
          Bestiario
        </h1>
        <div className="h-1.5 w-24 bg-primary mx-auto mt-4 rounded-full opacity-20" />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/5 p-8 rounded-3xl backdrop-blur-sm">
        {Object.entries(opciones).map(([grupo, opts]) => (
          <div key={grupo} className="flex flex-col items-center space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 italic">{grupo}</span>
            <div className="flex flex-wrap justify-center gap-2">
              {opts.map(o => (
                <button
                  key={o}
                  onClick={() => setFiltros(f => ({ ...f, [grupo]: o }))}
                  className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all border ${
                    filtros[grupo] === o 
                    ? 'bg-primary text-white shadow-lg scale-105' 
                    : 'bg-black/20 text-primary/60 border-transparent hover:border-primary/20'
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-bg-main pb-20 font-sans overflow-x-hidden">
      <DetalleMaestro 
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        data={selected}
        tags={selected ? [selected.habitat, `Alma ${selected.alma}`] : []}
        mostrarMusica={false}
      />

      <GalleryGrid headerContent={MiMenu}>
        {filtrados.map(c => (
          <GalleryItem key={c.id} src={c.imagen_url} onClick={() => handleSelect(c)}>
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

      {/* Si no hay nada, un mensaje sutil */}
      {!criaturas.length && (
        <div className="py-20 text-center text-primary/20 font-black uppercase text-[10px] tracking-widest">
          Sincronizando Archivos...
        </div>
      )}
    </main>
  );
}