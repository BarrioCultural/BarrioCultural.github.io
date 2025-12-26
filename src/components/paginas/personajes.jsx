"use client";

import React from 'react';
import { useLightbox } from "@/components/lightbox";
// Asegúrate de crear este archivo en src/components/FilaPersonaje.jsx
import { FilaPersonaje } from "@/components/FilaPersonaje";

const Lore = () => {
  const { openLightbox } = useLightbox();

  const personajes = [
    {
      nombre: "Pink Killer",
      img: "/dibujos/personajes/cuerpo-completo/pinkkiller.png",
      desc: "Asesina principal del PF",
      id: "pinkkiller", // Clave para el color
    },
    {
      nombre: "Dorian",
      img: "/dibujos/personajes/rostros/dorian-cara.png",
      desc: "El lider del PF",
      id: "dorian",
    },
    {
      nombre: "Faker",
      img: "/dibujos/personajes/rostros/faker-cara.png",
      desc: "El mejor hacker del PF",
      id: "faker",
    },
    {
      nombre: "Frani",
      img: "/dibujos/personajes/rostros/frani-postsuicideparede-cara.png",
      desc: "El mejor investigador del PP",
      id: "frani",
    },
    {
      nombre: "Abel",
      img: "/dibujos/personajes/rostros/abel-cara.png",
      desc: "Heredero al trono del Reino Torres",
      id: "abel",
    },
    {
      nombre: "Quimera",
      img: "/dibujos/personajes/rostros/crazygirl-cara.png",
      desc: "Una joven rebelde que busca venganza",
      id: "yoa", // Usando el color de 'yoa' para Quimera si no tienes uno específico
    },
    {
      nombre: "Icarus",
      img: "/dibujos/personajes/rostros/icarus-cara.png",
      desc: "Inventor del Reino Torres",
      id: "florgelida", // Usando un color celeste para el inventor
    }
  ];

  return (
    <main className="min-h-screen bg-bg-main py-12 px-4">
      <header className="mb-16 text-center">
        <h1 className="text-4xl font-bold text-primary uppercase tracking-[0.2em]">
          Lore de Personajes
        </h1>
        <div className="h-1 w-24 bg-accent mx-auto mt-4 rounded-full"></div>
      </header>

      {/* Contenedor principal que reemplaza a .galeria-filas */}
      <section className="mx-auto flex w-full max-w-container flex-col gap-8">
        {personajes.map((p, index) => (
          <FilaPersonaje 
            key={index}
            indice={index} // Esto controla si el texto va a la derecha o izquierda
            nombre={p.nombre}
            img={p.img}
            descripcion={p.desc}
            colorId={p.id} // Para aplicar el color del personaje
            onClick={() => openLightbox({ src: p.img, alt: p.nombre })}
          />
        ))}
      </section>

      <div className="h-20"></div>
    </main>
  );
};

export default Lore;