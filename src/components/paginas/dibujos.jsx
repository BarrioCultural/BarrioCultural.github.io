"use client"; // <--- ESTA LÍNEA ES LA CLAVE

import React from 'react';

// Importas el hook del archivo de componentes
import { useLightbox } from "../lightbox/lightbox";

const Drawings = () => {
  // 2. Extraemos la función openLightbox del contexto
  const { openLightbox } = useLightbox();
  
  const dibujos = [
    { src: "/dibujos/fanart/01.jpg", alt: "Frani" },
    { src: "/dibujos/fanart/02.png", alt: "Frani" },
    { src: "/dibujos/fanart/03.jpg", alt: "Frani" },
    { src: "/dibujos/fanart/04.jpg", alt: "Frani" },
    { src: "/dibujos/fanart/05.jpg", alt: "Frani" },
    { src: "/dibujos/fanart/06.jpg", alt: "Frani" },
    { src: "/dibujos/fanart/07.jpg", alt: "Frani" },
    { src: "/dibujos/fanart/08.jpg", alt: "Frani" },
    { src: "/dibujos/fanart/09.jpg", alt: "Frani" },
    { src: "/dibujos/fanart/10.png", alt: "Frani" },
    { src: "/dibujos/fanart/11.jpg", alt: "Frani" },
    { src: "/dibujos/fanart/12.jpg", alt: "Frani" },
    { src: "/dibujos/fanart/13.png", alt: "Frani" },
    { src: "/dibujos/fanart/14.jpg", alt: "Frani" },
    { src: "/dibujos/fanart/15.jpg", alt: "Frani" },
    { src: "/dibujos/fanart/16.jpg", alt: "Frani" },
    { src: "/dibujos/fanart/17.jpg", alt: "Frani" },

    { src: "/dibujos/personajes/cuerpo-completo/frani-postsuicideparede.png", alt: "Frani" },
    { src: "/dibujos/personajes/cuerpo-completo/faker.png", alt: "Faker" },
    { src: "/dibujos/personajes/cuerpo-completo/pinkkiller.png", alt: "Pink Killer" },
    { src: "/dibujos/personajes/cuerpo-completo/dorian.png", alt: "Dorian" },
    { src: "/dibujos/personajes/cuerpo-completo/florgelida.png", alt: "Flor Gélida" },
    { src: "/dibujos/personajes/cuerpo-completo/abel.jpg", alt: "Abel" },
  ];

  return (
    <section className="galeria-cuadricula">
      {dibujos.map((dibujo, index) => (
        <article key={index} className="targeta animate-on-scroll">
          <img 
            src={dibujo.src} 
            className="imagen" 
            alt={dibujo.alt} 
            // 3. Usamos la función del contexto aquí
            onClick={() => openLightbox(dibujo)} 
          />
        </article>
      ))}
    </section>
  );
};

export default Drawings;