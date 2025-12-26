"use client";

import React from 'react';
import { useLightbox } from "@/components/lightbox"; 
import { GalleryGrid, GalleryItem } from "@/components/gallery";
const Drawings = () => {
  const { openLightbox } = useLightbox();
  
  const dibujos = [
    // --- FANARTS ---
    { src: "/dibujos/fanart/01.jpg", alt: "Fanart 01" },
    { src: "/dibujos/fanart/02.png", alt: "Fanart 02" },
    { src: "/dibujos/fanart/03.jpg", alt: "Fanart 03" },
    { src: "/dibujos/fanart/04.jpg", alt: "Fanart 04" },
    { src: "/dibujos/fanart/05.jpg", alt: "Fanart 05" },
    { src: "/dibujos/fanart/06.jpg", alt: "Fanart 06" },
    { src: "/dibujos/fanart/07.jpg", alt: "Fanart 07" },
    { src: "/dibujos/fanart/08.jpg", alt: "Fanart 08" },
    { src: "/dibujos/fanart/09.jpg", alt: "Fanart 09" },
    { src: "/dibujos/fanart/10.png", alt: "Fanart 10" },
    { src: "/dibujos/fanart/11.jpg", alt: "Fanart 11" },
    { src: "/dibujos/fanart/12.jpg", alt: "Fanart 12" },
    { src: "/dibujos/fanart/13.png", alt: "Fanart 13" },
    { src: "/dibujos/fanart/14.jpg", alt: "Fanart 14" },
    { src: "/dibujos/fanart/15.jpg", alt: "Fanart 15" },
    { src: "/dibujos/fanart/16.jpg", alt: "Fanart 16" },
    { src: "/dibujos/fanart/17.jpg", alt: "Fanart 17" },

    // --- PERSONAJES (CUERPO COMPLETO) ---
    { src: "/dibujos/personajes/cuerpo-completo/frani-postsuicideparede.png", alt: "Frani" },
    { src: "/dibujos/personajes/cuerpo-completo/faker.png", alt: "Faker" },
    { src: "/dibujos/personajes/cuerpo-completo/pinkkiller.png", alt: "Pink Killer" },
    { src: "/dibujos/personajes/cuerpo-completo/dorian.png", alt: "Dorian" },
    { src: "/dibujos/personajes/cuerpo-completo/florgelida.png", alt: "Flor Gélida" },
    { src: "/dibujos/personajes/cuerpo-completo/abel.jpg", alt: "Abel" },
  ];

  return (
    <main className="min-h-screen bg-bg-main pt-10">
      <header className="mb-10 px-4 text-center">
        <h1 className="text-4xl font-bold text-primary tracking-tight">Dibujos</h1>
        <p className="mt-2 text-primary/60 italic">Fanarts y Personajes :D</p>
      </header>
<GalleryGrid>
  {dibujos.map((dibujo, index) => (
    <GalleryItem 
      key={index}
      src={dibujo.src}
      alt={dibujo.alt}
      // 🟢 Ahora enviamos el INDEX y la lista completa de DIBUJOS
      onClick={() => openLightbox(index, dibujos)} 
    />
  ))}
</GalleryGrid>

      {/* Espaciador final */}
      <div className="h-20"></div>
    </main>
  );
};

export default Drawings;