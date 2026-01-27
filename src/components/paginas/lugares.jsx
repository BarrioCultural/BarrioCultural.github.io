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
  
  // Estado para filtros ajustado a los nombres del Excel
  const [filtrosActivos, setFiltrosActivos] = useState({
    epoca: 'Todos',
    comuna: 'Todos',
    tipo: 'Todos',
    region: 'Todos'
  });

  useEffect(() => {
    const fetchLugares = async () => {
      setLoading(true);
      // Usamos 'Nombre' con mayúscula para el ordenamiento según tu archivo
      const { data, error } = await supabase
        .from('lugares') 
        .select('*')
        .order('Nombre', { ascending: true });
      
      if (error) console.error("Error al cargar:", error.message);
      
      setLugares(data || []);
      setLoading(false);
    };
    fetchLugares();
  }, []);

  // Mapeo automático usando las columnas reales de tu tabla
  const configFiltros = useMemo(() => {
    const obtenerUnicos = (campo) => [
      'Todos', 
      ...new Set(lugares.map(l => l[campo]).filter(Boolean))
    ];

    return {
      época: obtenerUnicos('Epoca'),   // Columna 'Epoca'
      comuna: obtenerUnicos('Comuna'), // Columna 'Comuna'
      tipo: obtenerUnicos('Tipo'),     // Columna 'Tipo'
      región: obtenerUnicos('Región')  // Columna 'Región' (con tilde)
    };
  }, [lugares]);

  // Lógica de filtrado combinada
  const filtrados = useMemo(() => {
    return lugares.filter(lugar => {
      return (
        (filtrosActivos.epoca === 'Todos' || lugar.Epoca === filtrosActivos.epoca) &&
        (filtrosActivos.comuna === 'Todos' || lugar.Comuna === filtrosActivos.comuna) &&
        (filtrosActivos.tipo === 'Todos' || lugar.Tipo === filtrosActivos.tipo) &&
        (filtrosActivos.region === 'Todos' || lugar.Región === filtrosActivos.region)
      );
    });
  }, [lugares, filtrosActivos]);

  const handleFiltroChange = (grupo, valor) => {
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
        "Explora el Patrimonio Regional"
      </span>
      <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter text-primary uppercase leading-none">
        Lugares Históricos
      </h1>
      <div className="h-1.5 w-24 bg-primary mx-auto mt-4 rounded-full opacity-20 mb-12" />
      
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
        // Usamos las etiquetas con los nombres de columna del Excel
        tags={[selected?.Tipo, selected?.Epoca, selected?.Comuna]}
        mostrarMusica={false}
      />

      {loading ? (
        <div className="py-40 text-center opacity-40 font-black uppercase text-xs tracking-widest animate-pulse">
          "Recuperando Crónicas..."
        </div>
      ) : (
        <GalleryGrid isDetailOpen={!!selected} headerContent={HeaderCultural}>
          {filtrados.map(lugar => (
            <GalleryItem 
              key={lugar.id} 
              src={lugar.Imagen_url} // Columna 'Imagen_url'
              contain={false}
              onClick={() => {
                setSelected(lugar);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className="flex flex-col h-full justify-end p-3 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                <p className="text-[8px] font-black text-primary uppercase tracking-[0.2em] mb-1">
                  {lugar.Tipo} • {lugar.Epoca}
                </p>
                <h3 className="text-lg font-black text-white uppercase italic leading-none tracking-tighter">
                  {lugar.Nombre}
                </h3>
                <p className="text-[9px] text-white/50 font-bold uppercase mt-1 tracking-widest">
                  {lugar.Comuna}
                </p>
              </div>
            </GalleryItem>
          ))}
          
          {filtrados.length === 0 && (
            <div className="col-span-full py-20 text-center text-primary/30 font-bold uppercase text-[10px]">
              "No hay registros para esta selección"
            </div>
          )}
        </GalleryGrid>
      )}
    </main>
  );
}