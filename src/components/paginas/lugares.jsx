"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { GalleryGrid, GalleryItem } from "@/components/recursos/display/gallery";
import DetalleMaestro from "@/components/recursos/boxes/detalles";
import FiltrosMaestros from "@/components/recursos/boxes/Filtros";

export default function LugaresHistoricos() {
  const [lugares, setLugares] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtroEpoca, setFiltroEpoca] = useState('TODAS LAS ÉPOCAS');

  useEffect(() => {
    const fetchLugares = async () => {
      setLoading(true);
      // Asumiendo que tu tabla ahora se llama 'lugares_culturales'
      const { data } = await supabase
        .from('lugares_culturales') 
        .select('*')
        .order('nombre', { ascending: true });
      setLugares(data || []);
      setLoading(false);
    };
    fetchLugares();
  }, []);

  // Cambiamos 'categoria' por 'epoca' o 'tipo' para darle el toque histórico
  const epocas = useMemo(() => 
    ['TODAS LAS ÉPOCAS', ...new Set(lugares.map(l => l.epoca))], 
    [lugares]
  );

  const filtrados = useMemo(() => 
    filtroEpoca === 'TODAS LAS ÉPOCAS' 
      ? lugares 
      : lugares.filter(l => l.epoca === filtroEpoca), 
    [lugares, filtroEpoca]
  );

  const handleSelect = (lugar) => {
    setSelected(lugar);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const HeaderCultural = (
    <header className="mb-16 text-center px-4 pt-10">
      <span className="text-primary/60 font-black text-[10px] tracking-[0.3em] uppercase mb-2 block">
        "Explora el Patrimonio"
      </span>
      <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter text-primary uppercase leading-none">
        "Crónicas Urbanas"
      </h1>
      <div className="h-2 w-32 bg-primary mx-auto mt-6 mb-12" />
      
      <FiltrosMaestros 
        config={{ categorías: epocas }}
        filtrosActivos={{ categorías: filtroEpoca }}
        onChange={(grupo, valor) => setFiltroEpoca(valor)}
      />
    </header>
  );

  return (
    <main className="min-h-screen bg-bg-main pb-20 font-sans">
      
      <DetalleMaestro 
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        data={selected}
        // Pasamos la época y la ubicación como tags
        tags={[selected?.epoca, selected?.ubicacion]}
        mostrarMusica={false}
      />

      {loading ? (
        <div className="py-40 text-center opacity-40 font-black uppercase text-xs tracking-widest animate-pulse">
          "Recuperando Archivos Históricos..."
        </div>
      ) : (
        <GalleryGrid 
          isDetailOpen={!!selected} 
          headerContent={HeaderCultural}
        >
          {filtrados.map(lugar => (
            <GalleryItem 
              key={lugar.id} 
              src={lugar.imagen_url} 
              contain={false} // Cambiado a false para que la foto del lugar llene el cuadro
              onClick={() => handleSelect(lugar)}
            >
              <div className="flex flex-col h-full justify-end p-2">
                <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1 bg-white/10 w-fit px-2 py-0.5">
                  {lugar.epoca}
                </p>
                <h3 className="text-xl font-black text-white uppercase italic leading-tight tracking-tighter drop-shadow-lg">
                  {lugar.nombre}
                </h3>
                <p className="text-[10px] text-white/70 font-medium uppercase mt-1">
                  {lugar.ubicacion}
                </p>
              </div>
            </GalleryItem>
          ))}
          
          {filtrados.length === 0 && (
            <div className="col-span-full py-20 text-center text-primary/30 font-bold uppercase text-[10px] tracking-widest">
              "No se encontraron registros"
            </div>
          )}
        </GalleryGrid>
      )}
    </main>
  );
}