"use client"; // <--- ESTA LÍNEA ES LA CLAVE
import React from 'react';
// 1. Importamos el hook del contexto

import { useLightbox } from "../lightbox";

const Diario = () => {
  // 2. Extraemos la función para abrir el lightbox
  const { openLightbox } = useLightbox();

  const entradas = [
    { fecha: "20 de Enero 2025", img: "/fotos/2025-01-20_1.jpg" },
    { fecha: "19 de Nov. 2024", img: "/fotos/2024-11-19_1.jpg" },
    { fecha: "13 de Nov. 2024", img: "/fotos/2024-11-13_1.jpg" },
    { fecha: "11 de Nov. 2024", img: "/fotos/2024-11-11_2.jpg"},
    { fecha: "11 de Nov. 2024", img: "/fotos/2024-11-11_1.jpg"},
    { fecha: "28 de Oct. 2024", img: "/fotos/2024-10-28_1.jpg",},
    { fecha: "10 de Oct. 2024", img: "/fotos/2024-10-05_2.jpg",},
    { fecha: "21 de Sept. 2024", img: "/fotos/2024-09-21_1.jpg"},
    { fecha: "16 de Ago. 2024", img: "/fotos/2024-08-16_1.jpg"},
    { fecha: "27 de Jul. 2024", img: "/fotos/2024-07-27_1.jpg"},
  ];

  return (
    <section className="galeria-cuadricula">
      {entradas.map((entrada, index) => (
        <article key={index} className="targeta animate-on-scroll">
          {/* 3. Aplicamos el onClick a la imagen */}
          <img 
            src={entrada.img} 
            className="imagen" 
            alt={entrada.fecha} 
            onClick={() => openLightbox({ src: entrada.img, alt: entrada.fecha })}
            style={{ cursor: 'zoom-in' }}
          />
          <h3 className="targeta-nombre">{entrada.fecha}</h3>
          {entrada.desc && <p className="targeta-desc">{entrada.desc}</p>}
        </article>
      ))}
    </section>
  );
};

export default Diario;