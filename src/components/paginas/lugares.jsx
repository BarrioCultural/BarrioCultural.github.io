"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { GalleryGrid, GalleryItem } from "@/components/recursos/display/gallery";
import DetalleMaestro from "@/components/recursos/boxes/detalles";
import FiltrosMaestros from "@/components/recursos/boxes/Filtros";

export default function LugaresHistoricos() {
  const [lugares, setLugares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  
  // Estado para todos los filtros (Ajustados a tu Excel)
  const [filtrosActivos, setFiltrosActivos] = useState({
    epoca: 'Todos',
    comuna: 'Todos',
    tipo: 'Todos',
    region: 'Todos',
    gestion: 'Todos',
    accesibilidad: 'Todos',
    estado: 'Todos'
  });

  useEffect(() => {
    const fetchLugares = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('lugares') 
        .select('*')
        .order('Nombre', { ascending: true });
      
      if (error) console.error("Error:", error.message);
      setLugares(data || []);
      setLoading(false);
    };
    fetchLugares();
  }, []);

  // Generación de filtros dinámicos basados en las columnas de tu CSV
  const configFiltros = useMemo(() => {
    const obtenerUnicos = (campo) => [
      'Todos', 
      ...new Set(lugares.map(l => l[campo]).filter(Boolean))
    ];

    return {
      época: obtenerUnicos('Epoca'),
      comuna: obtenerUnicos('Comuna'),
      tipo: obtenerUnicos('Tipo'),
      gestión: obtenerUnicos('Gestión'),
      acceso: obtenerUnicos('Accesibilidad'),
      disponibilidad: obtenerUnicos('Estado')
    };
  }, [lugares]);

  // Lógica de filtrado masivo
  const filtrados = useMemo(() => {
    return lugares.filter(lugar => {
      return (
        (filtrosActivos.epoca === 'Todos' || lugar.Epoca === filtrosActivos.epoca) &&
        (filtrosActivos.comuna === 'Todos' || lugar.Comuna === filtrosActivos.comuna) &&
        (filtrosActivos.tipo === 'Todos' || lugar.Tipo === filtrosActivos.tipo) &&
        (filtrosActivos.gestion === 'Todos' || lugar.Gestión === filtrosActivos.gestion) &&
        (filtrosActivos.accesibilidad === 'Todos' || lugar.Accesibilidad === filtrosActivos.accesibilidad) &&
        (filtrosActivos.estado === 'Todos' || lugar.Estado === filtrosActivos.estado)
      );
    });
  }, [lugares, filtrosActivos]);

  const handleFiltroChange = (grupo, valor) => {
    // Mapa para conectar el nombre del botón con la clave del estado
    const mapaNombres = { 
      'época': 'epoca', 
      'comuna': 'comuna', 
      'tipo': 'tipo', 
      'gestión': 'gestion', 
      'acceso': 'accesibilidad', 
      'disponibilidad': 'estado' 
    };
    const llave = mapaNombres[grupo] || grupo;
    
    setFiltrosActivos(prev => ({ ...prev, [llave]: valor }));
  };

  return (
    <main className="min-h-screen bg-bg-main pb-20 font-sans">
      <DetalleMaestro 
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        data={selected}
        // Usamos la columna Descripción del Excel para el cuerpo del detalle
        description={selected?.Descripción}
        tags={[selected?.Tipo, selected?.Gestión, selected?.Accesibilidad, selected?.Estado]}
        mostrarMusica={false}
      />

      {loading ? (
        <div className="py-40 text-center opacity-40 font-black uppercase text-xs tracking-widest animate-pulse">
          "Sincronizando Archivos..."
        </div>
      ) : (
        <GalleryGrid 
          isDetailOpen={!!selected} 
          headerContent={
            <header className="mb-16 text-center px-4 pt-10">
              <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter text-primary uppercase leading-none mb-8">
                Lugares Históricos
              </h1>
              <FiltrosMaestros 
                config={configFiltros}
                filtrosActivos={{
                  época: filtrosActivos.epoca,
                  comuna: filtrosActivos.comuna,
                  tipo: filtrosActivos.tipo,
                  gestión: filtrosActivos.gestion,
                  acceso: filtrosActivos.accesibilidad,
                  disponibilidad: filtrosActivos.estado
                }}
                onChange={handleFiltroChange}
              />
            </header>
          }
        >
          {filtrados.map(lugar => (
            <GalleryItem 
              key={lugar.id} 
              src={lugar.Imagen_url} 
              onClick={() => {
                setSelected(lugar);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className="flex flex-col h-full justify-end p-3 bg-gradient-to-t from-black/90 via-black/20 to-transparent">
                <div className="flex gap-2 mb-1">
                   <span className="text-[7px] font-black bg-primary px-1 text-white uppercase">{lugar.Estado}</span>
                   <span className="text-[7px] font-black bg-white/20 px-1 text-white uppercase">{lugar.Accesibilidad}</span>
                </div>
                <h3 className="text-lg font-black text-white uppercase italic leading-none tracking-tighter">
                  {lugar.Nombre}
                </h3>
                <p className="text-[9px] text-white/50 font-bold uppercase mt-1">
                  {lugar.Comuna} • {lugar.Tipo}
                </p>
              </div>
            </GalleryItem>
          ))}
        </GalleryGrid>
      )}
    </main>
  );
}