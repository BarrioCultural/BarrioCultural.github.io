"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { GalleryGrid, GalleryItem } from "@/components/recursos/display/gallery";
import DetalleMaestro from "@/components/recursos/boxes/detalles";
import { ChevronDown } from 'lucide-react';

export default function LugaresHistoricos() {
  const [lugares, setLugares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  
  const [filtrosActivos, setFiltrosActivos] = useState({
    comuna: 'Todos',
    tipo: 'Todos',
    gestion: 'Todos',
    accesibilidad: 'Todos',
    estado: 'Todos'
  });

  useEffect(() => {
    const fetchLugares = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('lugares') 
          .select('*')
          .order('Nombre', { ascending: true });
        
        if (error) throw error;
        setLugares(data || []);
      } catch (error) {
        console.error("Error cargando lugares:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLugares();
  }, []);

  const configFiltros = useMemo(() => {
    const obtenerUnicos = (campo) => [
      'Todos', 
      ...new Set(lugares.map(l => l[campo]).filter(Boolean))
    ];

    return [
      { id: 'comuna', label: 'Comuna', opciones: obtenerUnicos('Comuna') },
      { id: 'tipo', label: 'Tipo', opciones: obtenerUnicos('Tipo') },
      { id: 'gestion', label: 'Gestión', opciones: obtenerUnicos('Gestión') },
      { id: 'accesibilidad', label: 'Acceso', opciones: obtenerUnicos('Accesibilidad') },
      { id: 'estado', label: 'Disponibilidad', opciones: obtenerUnicos('Estado') },
    ];
  }, [lugares]);

  const filtrados = useMemo(() => {
    return lugares.filter(lugar => (
      (filtrosActivos.comuna === 'Todos' || lugar.Comuna === filtrosActivos.comuna) &&
      (filtrosActivos.tipo === 'Todos' || lugar.Tipo === filtrosActivos.tipo) &&
      (filtrosActivos.gestion === 'Todos' || lugar.Gestión === filtrosActivos.gestion) &&
      (filtrosActivos.accesibilidad === 'Todos' || lugar.Accesibilidad === filtrosActivos.accesibilidad) &&
      (filtrosActivos.estado === 'Todos' || lugar.Estado === filtrosActivos.estado)
    ));
  }, [lugares, filtrosActivos]);

  const HeaderContent = (
    <header className="pt-16 pb-10 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
        <div>
          {/* Título cambiado a text-accent (Naranja) */}
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-accent uppercase leading-none">
            Lugares
          </h1>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 lg:flex lg:flex-wrap lg:justify-end">
          {configFiltros.map((filtro) => {
            const isActive = filtrosActivos[filtro.id] !== 'Todos';
            return (
              <div key={filtro.id} className="relative group min-w-[140px]">
                <select 
                  className={`
                    w-full appearance-none rounded-full px-5 py-3 text-[9px] font-black uppercase tracking-widest transition-all outline-none pr-10 cursor-pointer border
                    ${isActive 
                      ? "bg-accent text-white border-accent shadow-lg scale-105" 
                      : "bg-accent/10 text-accent/60 border-accent/20 hover:bg-accent/20"
                    }
                  `}
                  value={filtrosActivos[filtro.id]}
                  onChange={(e) => setFiltrosActivos(prev => ({ ...prev, [filtro.id]: e.target.value }))}
                >
                  <option value="Todos">{filtro.label}</option>
                  {filtro.opciones.filter(opt => opt !== 'Todos').map(opt => (
                    <option key={opt} value={opt} className="bg-white text-accent font-sans">
                      {opt}
                    </option>
                  ))}
                </select>
                <ChevronDown 
                  size={12} 
                  className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${isActive ? "text-white" : "text-accent/30"}`} 
                />
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );

  return (
    <main className="min-h-screen bg-[#fef9e7] pb-20 font-sans">
      <DetalleMaestro 
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        data={selected}
        description={selected?.Descripción}
        tags={[selected?.Tipo, selected?.Gestión, selected?.Estado]}
        mostrarMusica={false}
      />

      {loading ? (
        <div className="py-40 text-center opacity-40 font-black uppercase text-xs tracking-widest animate-pulse text-accent">
          "Sincronizando Archivos..."
        </div>
      ) : (
        <GalleryGrid 
          isDetailOpen={!!selected}
          headerContent={HeaderContent}
        >
          {filtrados.map(lugar => (
            <GalleryItem 
              key={lugar.id} 
              src={lugar.Imagen_url}
              alt={lugar.Nombre}
              /* Las cards sin imagen ahora tienen un toque naranja suave para armonizar */
              color={!lugar.Imagen_url ? "var(--accent)" : null}
              onClick={() => {
                setSelected(lugar);
                window.scrollTo({ top: 1, behavior: 'smooth' });
              }}
            >
              <div className="flex gap-2 mb-2">
                 {/* Badges de estado siempre en Naranja Accent */}
                 <span className="text-[7px] font-black bg-accent px-2 py-0.5 text-white uppercase rounded-sm shadow-md">
                   {lugar.Estado}
                 </span>
              </div>
              
              <p className="text-[8px] font-black text-white/70 uppercase tracking-widest mb-1">
                {lugar.Comuna} • {lugar.Tipo}
              </p>
              
              <h3 className="text-xl font-black text-white uppercase italic leading-none tracking-tighter">
                {lugar.Nombre}
              </h3>
            </GalleryItem>
          ))}
        </GalleryGrid>
      )}
    </main>
  );
}