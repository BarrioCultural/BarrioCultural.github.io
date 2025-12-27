"use client";

import React from 'react';
import { useLightbox } from "@/components/lightbox"; 
import { GalleryGrid, GalleryItem } from "@/components/gallery";

const Diario = () => {
  const { openLightbox } = useLightbox();

  // 1. Definimos los datos
  const entradas = [
    { fecha: "20 de Enero 2025", img: "/fotos/2025-01-20_1.jpg" },
    { fecha: "19 de Nov. 2024", img: "/fotos/2024-11-19_1.jpg" },
    { fecha: "13 de Nov. 2024", img: "/fotos/2024-11-13_1.jpg" },
    { fecha: "11 de Nov. 2024", img: "/fotos/2024-11-11_2.jpg"},
    { fecha: "11 de Nov. 2024", img: "/fotos/2024-11-11_1.jpg"},
    { fecha: "28 de Oct. 2024", img: "/fotos/2024-10-28_1.jpg"},
    { fecha: "10 de Oct. 2024", img: "/fotos/2024-10-05_2.jpg"},
    { fecha: "21 de Sept. 2024", img: "/fotos/2024-09-21_1.jpg"},
    { fecha: "16 de Ago. 2024", img: "/fotos/2024-08-16_1.jpg"},
    { fecha: "27 de Jul. 2024", img: "/fotos/2024-07-27_1.jpg"},
  ];

  // 2. Preparamos la lista para el Lightbox (mapeando a src/alt)
  const fotosParaLightbox = entradas.map(e => ({ src: e.img, alt: e.fecha }));

  return (
    <main className="min-h-screen bg-bg-main pt-10">
      <header className="mb-10 px-4 text-center">
        <h1 className="text-4xl font-bold text-primary tracking-tight">Diario de Fotos</h1>
      </header>

      <GalleryGrid>
        {entradas.map((entrada, index) => (
          <div key={index} className="flex flex-col group">
            <GalleryItem 
              src={entrada.img} 
              alt={entrada.fecha} 
              onClick={() => openLightbox(index, fotosParaLightbox)} 
            />
            <h3 className="mt-2 text-center text-[10px] md:text-xs font-bold text-primary uppercase opacity-70 group-hover:opacity-100 transition-opacity">
              {entrada.fecha}
            </h3>
          </div>
        ))}
      </GalleryGrid>

      <div className="h-20"></div>
    </main>
  );
};

export default Diario;