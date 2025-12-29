import React from 'react';
import { cn } from "@/lib/utils";

export const FilaPersonaje = ({ nombre, img, descripcion, indice, onClick }) => {
  // Alternar dirección según el índice (par o impar)
  const esPar = indice % 2 === 0;

  // Mapeo de colores basado en tus variables de Sass
  const colores = {
    "frani": "text-frani",
    "faker": "text-faker",
    "pinkkiller": "text-pinkkiller",
    "dorian": "text-dorian",
    "florgelida": "text-florgelida",
    "abel": "text-abel",
    "yoa": "text-yoa"
  };

  // Buscamos el color (limpiando el nombre para que coincida)
  const colorClase = colores[nombre.toLowerCase().replace(/\s/g, '')] || "text-primary";

  return (
    <article className={cn(
      "flex items-center gap-6 w-full my-4 p-4 rounded-full transition-all duration-300 hover:bg-white/10",
      esPar ? "flex-row text-left" : "flex-row-reverse text-right"
    )}>
      {/* Imagen Circular con efecto de hover */}
      <img 
        src={img} 
        alt={nombre}
        onClick={onClick}
        className="w-[150px] h-[150px] min-w-[150px] rounded-full object-cover bg-white cursor-zoom-in shadow-md transition-transform duration-300 hover:scale-105 border-2 border-transparent hover:border-accent"
      />

      {/* Contenedor de Texto */}
      <div className="flex flex-col gap-2 italic">
        <h2 className={cn("text-2xl font-bold uppercase tracking-tight", colorClase)}>
          {nombre}
        </h2>
        <p className="text-primary/90 leading-relaxed text-sm md:text-base max-w-2xl">
          {descripcion}
        </p>
      </div>
    </article>
  );
};