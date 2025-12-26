"use client"; // <--- ESTA LÍNEA ES LA CLAVE
import React from 'react';
// 1. Importamos el hook del contexto

import { useLightbox } from "../lightbox";

const Lore = () => {
  // 2. Extraemos la función openLightbox
  const { openLightbox } = useLightbox();

  const personajes = [
    {
      nombre: "Pink Killer",
      img: "/dibujos/personajes/cuerpo-completo/pinkkiller.png",
      desc: "Asesina principal del PF",
      personaje: "pink-killer",
      posicion: "texto-derecha"
    },
    {
      nombre: "Dorian",
      img: "/dibujos/personajes/rostros/dorian-cara.png",
      desc: "El lider del PF",
      personaje: "dorian",
      posicion: "texto-izquierda"
    },
    {
      nombre: "Faker",
      img: "/dibujos/personajes/rostros/faker-cara.png",
      desc: "El mejor hacker del PF",
      personaje: "faker",
      posicion: "texto-derecha"
    },
    {
      nombre: "Frani",
      img: "/dibujos/personajes/rostros/frani-postsuicideparede-cara.png",
      desc: "El mejor investigador del PP",
      personaje: "frani",
      posicion: "texto-izquierda"
    },
    {
      nombre: "Abel",
      img: "/dibujos/personajes/rostros/abel-cara.png",
      desc: "Heredero al trono del Reino Torres",
      personaje: "abel",
      posicion: "texto-derecha"
    },
    {
      nombre: "Quimera",
      img: "/dibujos/personajes/rostros/crazygirl-cara.png",
      desc: "Una joven rebelde que busca venganza",
      personaje: "quimera",
      posicion: "texto-izquierda"
    },
    {
      nombre: "Icarus",
      img: "/dibujos/personajes/rostros/icarus-cara.png",
      desc: "Inventor del Reino Torres",
      personaje: "icarus",
      posicion: "texto-derecha"
    }
  ];

  return (
    <section className="galeria-filas">
      {personajes.map((p, index) => (
        <article 
          key={index} 
          className={`targeta ${p.posicion} animate-on-scroll ${p.personaje}`}
        >
          {/* 3. Usamos openLightbox con el objeto correcto */}
          <img 
            src={p.img} 
            className="imagen" 
            alt={p.nombre} 
            onClick={() => openLightbox({ src: p.img, alt: p.nombre })} 
            style={{ cursor: 'zoom-in' }} 
          />
          <div className="targeta-info">
            <h2 className="targeta-nombre">{p.nombre}</h2>
            <p className="targeta-desc">{p.desc}</p>
          </div>
        </article>
      ))}
    </section>
  );
};

export default Lore;