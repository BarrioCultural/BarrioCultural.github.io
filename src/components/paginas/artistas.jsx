"use client";

import React from 'react';
import { useLightbox } from "@/components/lightbox"; 
import { GalleryGrid, GalleryItem } from "@/components/gallery";

const Artistas = () => {
  const { openLightbox } = useLightbox();
  
  // Lista de artistas de la organización
  const artistas = [
    { 
      src: "/artistas/nombre-artista-01.jpg", 
      alt: "Artista 1",
      nombre: "Nombre del Artista" 
    },
    // Añade más aquí siguiendo el mismo formato
  ];

  return (
    <main className="min-h-screen bg-bg-main pt-10">
      <header className="mb-10 px-4 text-center">
        <h1 className="text-4xl font-bold text-primary tracking-tight">Artistas</h1>
        <p className="mt-2 text-primary/60 italic">Galería colectiva de Barrio Cultural</p>
      </header>

      <GalleryGrid>
        {artistas.map((artista, index) => (
          <GalleryItem 
            key={index}
            src={artista.src}
            alt={artista.alt}
            onClick={() => openLightbox(index, artistas)} 
          />
        ))}
      </GalleryGrid>

      {/* Espaciador final */}
      <div className="h-20"></div>
    </main>
  );
};

export default Artistas;