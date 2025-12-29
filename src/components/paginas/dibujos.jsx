"use client";

import React, { useEffect, useState } from 'react';
import { useLightbox } from "@/components/recursos/lightbox"; 
import { GalleryGrid, GalleryItem } from "@/components/recursos/gallery";
import { supabase } from '@/lib/supabase';
import Newsletter from "@/components/recursos/newsletter";

const Drawings = () => {
  const { openLightbox } = useLightbox();
  
  const [dibujos, setDibujos] = useState([]);
  const [loading, setLoading] = useState(true);
  // 🟢 Nuevo estado para la categoría seleccionada
  const [filtro, setFiltro] = useState('todos');

  useEffect(() => {
    const fetchDibujos = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('dibujos')
          .select('*') // Traemos todo (incluyendo la categoría)
          .order('id', { ascending: false });

        if (error) throw error;
        
        setDibujos(data || []);
      } catch (err) {
        console.error("Error cargando dibujos:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDibujos();
  }, []);

  // 🟢 Lógica de filtrado en tiempo real
  const dibujosFiltrados = filtro === 'todos' 
    ? dibujos 
    : dibujos.filter(d => d.categoria === filtro);

  // Formateamos los datos filtrados para el Lightbox
  const imagenesParaLightbox = dibujosFiltrados.map(d => ({
    src: d.url_imagen,
    alt: d.titulo
  }));

  const categorias = ['todos', 'fanart', 'original', 'bocetos'];

  return (
    <main className="min-h-screen bg-bg-main pt-10">
      <header className="mb-10 px-4 text-center">
        <h1 className="text-4xl font-bold text-primary tracking-tight">Dibujos</h1>
        <p className="mt-2 text-primary/60 italic">Fanarts y Personajes :D</p>
      </header>

      <Newsletter />

      {/* 🔘 Botones de Filtro */}
      <div className="flex justify-center gap-2 mb-8 px-4 flex-wrap">
        {categorias.map(cat => (
          <button
            key={cat}
            onClick={() => setFiltro(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
              filtro === cat 
              ? 'bg-primary text-white border-primary' 
              : 'bg-transparent text-primary/40 border-primary/10 hover:border-primary/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-primary animate-pulse text-lg">Cargando arte... 🎨</p>
        </div>
      ) : (
        <div className="px-4">
          <GalleryGrid>
            {dibujosFiltrados.length > 0 ? (
              dibujosFiltrados.map((dibujo, index) => (
                <GalleryItem 
                  key={dibujo.id}
                  src={dibujo.url_imagen}
                  alt={dibujo.titulo}
                  // Pasamos la lista filtrada para que el lightbox solo muestre la categoría actual
                  onClick={() => openLightbox(index, imagenesParaLightbox)} 
                />
              ))
            ) : (
              <p className="text-center col-span-full text-primary/50 italic py-10">
                No hay dibujos en la categoría "{filtro}".
              </p>
            )}
          </GalleryGrid>
        </div>
      )}

      <div className="h-24"></div>
    </main>
  );
};

export default Drawings;