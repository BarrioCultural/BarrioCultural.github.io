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
  
  // Estado para filtros dinámicos
  const [filtrosActivos, setFiltrosActivos] = useState({
    epoca: 'Todos',
    comuna: 'Todos',
    tipo: 'Todos',
    region: 'Todos'
  });

  useEffect(() => {
    const fetchLugares = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('lugares') 
        .select('*')
        .order('nombre', { ascending: true });
      setLugares(data || []);
      setLoading(false);
    };
    fetchLugares();
  }, []);

  // Generación automática de opciones únicas para cada filtro basado en la data
  const configFiltros = useMemo(() => {
    const obtenerUnicos = (campo) => [
      'Todos', 
      ...new Set(lugares.map(l => l[campo]).filter(Boolean))
    ];

    return {
      época: obtenerUnicos('epoca'),
      comuna: obtenerUnicos('comuna'),
      tipo: obtenerUnicos('tipo'),
      región: obtenerUnicos('region')
    };
  }, [lugares]);

  // Lógica de filtrado múltiple
  const filtrados = useMemo(() => {
    return lugares.filter(lugar => {
      return (
        (filtrosActivos.epoca === 'Todos' || lugar.epoca === filtrosActivos.epoca) &&
        (filtrosActivos.comuna === 'Todos' || lugar.comuna === filtrosActivos.comuna) &&
        (filtrosActivos.tipo === 'Todos' || lugar.tipo === filtrosActivos.tipo) &&
        (filtrosActivos.region === 'Todos' || lugar.region === filtrosActivos.region)
      );
    });
  }, [lugares, filtrosActivos]);

  const handleFiltroChange = (grupo, valor) => {
    // Mapeamos el nombre visual del grupo al nombre de la propiedad en el estado
    const mapaNombres = { 'época': 'epoca', 'comuna': 'comuna', 'tipo': 'tipo', 'región': 'region' };
    const llave = mapaNombres[grupo] || grupo;
    
    setFiltrosActivos(prev => ({
      ...prev,
      [llave]: valor
    }));
  };

  const HeaderCultural = (
    <header className="mb-16 text-center px-4 pt-10">
      <span className="text-primary/60 font-black text-[10px] tracking-[0.3em] uppercase mb-2 block">
        "Explora el Patrimonio"
      </span>
      <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter text-primary uppercase leading-none">
        Lugares Históricos
      </h1>
      <div className="h-1.5 w-24 bg-primary mx-auto mt-4 rounded-full opacity-20 mb-12" />
      
      {/* FiltrosMaestros ahora recibe múltiples grupos de categorías */}
      <FiltrosMaestros 
        config={configFiltros}
        filtrosActivos={{
          época: filtrosActivos.epoca,
          comuna: filtrosActivos.comuna,
          tipo: filtrosActivos.tipo,
          región: filtrosActivos.region
        }}
        onChange={handleFiltroChange}
      />
    </header>
  );

  return (
    <main className="min-h-screen bg-bg-main pb-20 font-sans">
      <DetalleMaestro 
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        data={selected}
        tags={[selected?.epoca, selected?.tipo, selected?.comuna]}
        mostrarMusica={false}
      />

      {loading ? (
        <div className="py-40 text-center opacity-40 font-black uppercase text-xs tracking-widest animate-pulse">
          "Sincronizando Archivos..."
        </div>
      ) : (
        <GalleryGrid isDetailOpen={!!selected} headerContent={HeaderCultural}>
          {filtrados.map(lugar => (
            <GalleryItem 
              key={lugar.id} 
              src={lugar.imagen_url} 
              contain={false}
              onClick={() => {
                setSelected(lugar);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className="flex flex-col h-full justify-end p-2 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-[8px] font-black text-primary uppercase tracking-[0.2em] mb-1">
                  {lugar.tipo} • {lugar.epoca}
                </p>
                <h3 className="text-lg font-black text-white uppercase italic leading-none tracking-tighter">
                  {lugar.nombre}
                </h3>
              </div>
            </GalleryItem>
          ))}
          
          {filtrados.length === 0 && (
            <div className="col-span-full py-20 text-center text-primary/30 font-bold uppercase text-[10px]">
              "No hay lugares con esos criterios"
            </div>
          )}
        </GalleryGrid>
      )}
    </main>
  );
}