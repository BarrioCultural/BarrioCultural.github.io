import Image from 'next/image';
import { useState } from 'react';

const Marker = ({ x, y, info }) => (
  <div 
    className="absolute group cursor-pointer"
    style={{ top: `${y}%`, left: `${x}%`, transform: 'translate(-50%, -50%)' }}
  >
    <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg group-hover:scale-125 transition-transform" />
    
    <div className="hidden group-hover:block absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs p-2 rounded whitespace-nowrap">
      {info}
    </div>
  </div>
);

export default function MapaInteractivo() {
  return (
    <section className="max-w-4xl mx-auto my-10">
      <h2 className="text-2xl font-bold mb-4 text-center">"Mapa de mi Historia"</h2>
      
      <div className="relative w-full border-4 border-amber-900 rounded-lg overflow-hidden shadow-2xl">
        <Image 
          src="/dibujos/fanart/01.jpg" 
          alt="Mapa del mundo"
          layout="responsive"
          width={1920}
          height={1080}
        />

        {/* Aquí colocas tus puntos manualmente o los traes de Supabase con un .map() */}
        <Marker x={45} y={30} info="Bosque Encantado" />
        <Marker x={70} y={55} info="Ciudad de Cristal" />
        <Marker x={20} y={80} info="Puerto de los Dibujos" />
      </div>
    </section>
  );
}