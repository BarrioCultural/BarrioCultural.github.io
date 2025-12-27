"use client";

import React from 'react';
import { useLightbox } from "@/components/lightbox";
import { FilaPersonaje } from "@/components/FilaPersonaje";

const Lugares = () => {
  const { openLightbox } = useLightbox();

  const lugares = [
    {
      nombre: "Museo de prueba",
      img: "/lugares/sede.jpg", // Asegúrate de subir esta imagen a /public/lugares/
      desc: "Fecha, horario, dirección, pagina, etc.",
      id: "frani", 
    },

  ];

  return (
    <main className="min-h-screen bg-bg-main py-12 px-4">
      <header className="mb-16 text-center">
        <h1 className="text-4xl font-bold text-primary uppercase tracking-[0.2em]">
          Espacios Culturales de Chile
        </h1>
      </header>

      <section className="mx-auto flex w-full max-w-container flex-col gap-8">
        {lugares.length > 0 ? (
          lugares.map((lugar, index) => (
            <FilaPersonaje 
              key={index}
              indice={index}
              nombre={lugar.nombre}
              img={lugar.img}
              descripcion={lugar.desc}
              colorId={lugar.id}
            />
          ))
        ) : (
          <p className="text-center text-primary/40">Próximamente se añadirán los lugares...</p>
        )}
      </section>

      <div className="h-20"></div>
    </main>
  );
};

export default Lugares;