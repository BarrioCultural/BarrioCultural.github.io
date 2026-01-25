"use client";

import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin } from 'lucide-react';

const Marker = ({ x, y, info, onClick }) => (
  <div 
    className="absolute group cursor-pointer z-10"
    style={{ top: `${y}%`, left: `${x}%`, transform: 'translate(-50%, -50%)' }}
    onClick={onClick} // <-- Ahora sí detecta el clic
  >
    {/* El punto visual con una pequeña animación de pulso */}
    <div className="relative">
      <div className="absolute inset-0 rounded-full bg-[#6B5E70] animate-ping opacity-20" />
      <div className="w-5 h-5 bg-[#6B5E70] rounded-full border-2 border-white shadow-lg group-hover:scale-110 transition-transform flex items-center justify-center">
         <MapPin size={10} className="text-white" />
      </div>
    </div>
    
    {/* Tooltip rápido al pasar el mouse */}
    <div className="hidden group-hover:block absolute bottom-7 left-1/2 -translate-x-1/2 bg-[#6B5E70] text-white text-[9px] font-black uppercase px-2 py-1 rounded shadow-xl z-50">
      {info}
    </div>
  </div>
);

export default function MapaInteractivo() {
  const [puntoSeleccionado, setPuntoSeleccionado] = useState(null);

  // Datos de ejemplo (Luego los traeremos de Supabase)
  const puntos = [
    { id: 1, x: 45, y: 30, titulo: "Bosque Encantado", lore: "Un lugar lleno de magia y misterio donde habitan las hadas.", imagen: "/dibujo-bosque.jpg" },
    { id: 2, x: 70, y: 55, titulo: "Ciudad de Cristal", lore: "La capital del reino, famosa por sus torres transparentes.", imagen: "/dibujo-ciudad.jpg" }
  ];

  return (
    <div className="relative w-full overflow-hidden rounded-[2rem] border border-[#6B5E70]/10 shadow-2xl bg-white">
      <div className="relative w-full h-full">
        <Image 
          src="/dibujos/fanart/01.jpg" 
          alt="Mapa"
          width={1920}
          height={1080}
          layout="responsive"
          priority
        />

        {puntos.map((p) => (
          <Marker 
            key={p.id} 
            x={p.x} 
            y={p.y} 
            info={p.titulo} 
            onClick={() => setPuntoSeleccionado(p)} // <-- Guarda el punto al hacer clic
          />
        ))}
      </div>

      {/* MODAL DE INFORMACIÓN */}
      <AnimatePresence>
        {puntoSeleccionado && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-6 rounded-[1.5rem] border border-[#6B5E70]/20 shadow-2xl z-40"
          >
            <button 
              onClick={() => setPuntoSeleccionado(null)}
              className="absolute top-4 right-4 text-[#6B5E70]/40 hover:text-[#6B5E70]"
            >
              <X size={20} />
            </button>
            
            <div className="flex flex-col md:flex-row gap-4">
              {/* Aquí iría la imagen de tu dibujo de ese lugar específico */}
              <div className="w-full md:w-32 h-32 bg-[#6B5E70]/10 rounded-xl overflow-hidden">
                 {/* <img src={puntoSeleccionado.imagen} className="object-cover w-full h-full" /> */}
              </div>
              
              <div className="flex-1">
                <h3 className="text-[#6B5E70] font-black uppercase text-sm tracking-widest mb-1">
                  {puntoSeleccionado.titulo}
                </h3>
                <p className="text-[#6B5E70]/70 text-[12px] leading-relaxed italic">
                  "{puntoSeleccionado.lore}"
                </p>
                <button className="mt-3 text-[10px] font-black text-[#6B5E70] underline uppercase tracking-tighter">
                  Ver más en la Wiki →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}