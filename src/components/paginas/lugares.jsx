"use client";

import React from 'react';
import { useLightbox } from "@/components/lightbox";
import { FilaPersonaje } from "@/components/FilaPersonaje";

const Lugares = () => {
  const { openLightbox } = useLightbox();

  // Array limpio: Aquí irán las localizaciones de Barrio Cultural
  const lugares = [
    {
      nombre: "Sede Central",
      img: "/lugares/sede.jpg", // Asegúrate de subir esta imagen a /public/lugares/
      desc: "Descripción del espacio principal de la organización.",
      id: "frani", 
    },
    {
      nombre: "Espacio de Exposición",
      img: "/lugares/galeria.jpg",
      desc: "Área destinada a mostrar el trabajo de los artistas.",
      id: "pinkkiller",
    },
    // Puedes añadir más lugares aquí siguiendo este formato
  ];

  return (
    <main className="min-h-screen bg-bg-main py-12 px-4">
      <header className="mb-16 text-center">
        <h1 className="text-4xl font-bold text-primary uppercase tracking-[0.2em]">
          Lugares
        </h1>
        <div className="h-1 w-24 bg-accent mx-auto mt-4 rounded-full"></div>
        <p className="mt-4 text-primary/60 italic">
          Espacios y entornos de la organización
        </p>
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