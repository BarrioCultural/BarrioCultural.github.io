"use client";

import React, { useEffect, useState } from 'react';
import { useLightbox } from "@/components/lightbox"; 
import { GalleryGrid, GalleryItem } from "@/components/gallery";
import { supabase } from '@/lib/supabase'; // Tu conexión
import Newsletter from "@/components/newsletter"; // Importamos el componente de suscripción

const Drawings = () => {
  const { openLightbox } = useLightbox();
  
  // Estados para los datos y la carga
  const [dibujos, setDibujos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para traer los dibujos desde Supabase
  useEffect(() => {
    const fetchDibujos = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('dibujos')
          .select('*')
          .order('id', { ascending: false }); // Los últimos subidos aparecen primero

        if (error) throw error;
        
        // Formateamos para que coincida con lo que espera tu GalleryItem
        const formattedData = data.map(d => ({
          src: d.url_imagen,
          alt: d.titulo
        }));

        setDibujos(formattedData);
      } catch (err) {
        console.error("Error cargando dibujos:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDibujos();
  }, []);

  return (
    <main className="min-h-screen bg-bg-main pt-10">
      {/* Título de la página */}
      <header className="mb-10 px-4 text-center">
        <h1 className="text-4xl font-bold text-primary tracking-tight">Dibujos</h1>
        <p className="mt-2 text-primary/60 italic">Fanarts y Personajes :D</p>
      </header>

      {/* 🟢 Formulario de Suscripción Arriba */}
      <Newsletter />

      {/* 🖼️ Galería de Dibujos */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-primary animate-pulse text-lg">Cargando arte... 🎨</p>
        </div>
      ) : (
        <div className="px-4">
          <GalleryGrid>
            {dibujos.length > 0 ? (
              dibujos.map((dibujo, index) => (
                <GalleryItem 
                  key={index}
                  src={dibujo.src}
                  alt={dibujo.alt}
                  // Enviamos el index y la lista completa para el lightbox
                  onClick={() => openLightbox(index, dibujos)} 
                />
              ))
            ) : (
              <p className="text-center col-span-full text-primary/50">
                No hay dibujos disponibles todavía.
              </p>
            )}
          </GalleryGrid>
        </div>
      )}

      {/* Espaciador final para que no quede pegado al borde */}
      <div className="h-24"></div>
    </main>
  );
};

export default Drawings;