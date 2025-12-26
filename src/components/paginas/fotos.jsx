"use client";

import React from 'react';
// Usamos el alias @ para evitar errores de rutas movidas
import { useLightbox } from "@/components/lightbox"; 
import { GalleryGrid, GalleryItem } from "@/components/gallery";

const Diario = () => {
  const { openLightbox } = useLightbox();

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

  return (
    <main className="min-h-screen bg-bg-main pt-10">
      <header className="mb-10 px-4 text-center">
        <h1 className="text-4xl font-bold text-primary tracking-tight">Diario de Fotos</h1>
      </header>

      {/* Usamos GalleryGrid que ya tiene definida la cuadrícula responsive */}
      <GalleryGrid>
        {entradas.map((entrada, index) => (
          <div key={index} className="flex flex-col group">
            <GalleryItem 
              src={entrada.img} 
              alt={entrada.fecha} 
              onClick={() => openLightbox({ src: entrada.img, alt: entrada.fecha })}
            />
            {/* Texto de la fecha adaptado a Tailwind */}
            <h3 className="mt-2 text-center text-[10px] md:text-xs font-bold text-primary uppercase tracking-tighter opacity-80 group-hover:opacity-100 transition-opacity">
              {entrada.fecha}
            </h3>
            {/* Si tienes descripción opcional */}
            {entrada.desc && (
              <p className="mt-1 text-center text-[9px] text-primary/60">
                {entrada.desc}
              </p>
            )}
          </div>
        ))}
      </GalleryGrid>

      <div className="h-20"></div>
    </main>
  );
};

export default Diario;