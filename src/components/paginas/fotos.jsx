"use client";

import React, { useEffect, useState } from 'react';
import { useLightbox } from "@/components/recursos/lightbox"; 
import { GalleryGrid, GalleryItem } from "@/components/recursos/gallery";
import { supabase } from '@/lib/supabase'; // Asegúrate de importar tu cliente

const Diario = () => {
  const { openLightbox } = useLightbox();
  
  // 1. Estados para los datos y la carga
  const [entradas, setEntradas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFotos = async () => {
      try {
        setLoading(true);
        // Traemos las fotos de la tabla diario_fotos
        const { data, error } = await supabase
          .from('diario_fotos')
          .select('*')
          .order('id', { ascending: false }); // Las más nuevas primero

        if (error) throw error;
        setEntradas(data || []);
      } catch (err) {
        console.error("Error cargando diario:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFotos();
  }, []);

  // 2. Preparamos la lista para el Lightbox (mapeando a src/alt)
  const fotosParaLightbox = entradas.map(e => ({ src: e.url_imagen, alt: e.fecha }));

  return (
    <main className="min-h-screen bg-bg-main pt-10">
      <header className="mb-10 px-4 text-center">
        <h1 className="text-4xl font-bold text-primary tracking-tight">Diario de Fotos</h1>
      </header>

      {loading ? (
        <div className="text-center py-20 text-primary animate-pulse">Cargando recuerdos... 🎞️</div>
      ) : (
        <GalleryGrid>
          {entradas.length > 0 ? (
            entradas.map((entrada, index) => (
              <div key={entrada.id} className="flex flex-col group">
                <GalleryItem 
                  src={entrada.url_imagen} 
                  alt={entrada.fecha} 
                  onClick={() => openLightbox(index, fotosParaLightbox)} 
                />
                <h3 className="mt-2 text-center text-[10px] md:text-xs font-bold text-primary uppercase opacity-70 group-hover:opacity-100 transition-opacity">
                  {entrada.fecha}
                </h3>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-primary/50 italic">Aún no hay fotos en el diario.</p>
          )}
        </GalleryGrid>
      )}

      <div className="h-20"></div>
    </main>
  );
};

export default Diario;