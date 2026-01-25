"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Componente del Marcador (El punto en el mapa)
const Marker = ({ x, y, info, onClick }) => (
  <div 
    className="absolute group cursor-pointer z-10"
    style={{ top: `${y}%`, left: `${x}%`, transform: 'translate(-50%, -50%)' }}
    onClick={(e) => {
      e.stopPropagation(); // Evita que el clic del marcador active el detector de coordenadas del mapa
      onClick();
    }}
  >
    <div className="relative flex items-center justify-center">
      {/* Animación de pulso */}
      <div className="absolute w-8 h-8 bg-[#6B5E70]/30 rounded-full animate-ping" />
      <div className="w-5 h-5 bg-[#6B5E70] rounded-full border-2 border-white shadow-lg group-hover:scale-125 transition-transform flex items-center justify-center">
         <MapPin size={10} className="text-white" />
      </div>
    </div>
    
    {/* Tooltip (Nombre sobre el punto) */}
    <div className="hidden group-hover:block absolute bottom-8 left-1/2 -translate-x-1/2 bg-[#6B5E70] text-white text-[9px] font-black uppercase px-2 py-1 rounded shadow-xl whitespace-nowrap z-50">
      {info}
    </div>
  </div>
);

export default function MapaInteractivo() {
  const [reinos, setReinos] = useState([]);
  const [puntoSeleccionado, setPuntoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Cargar datos desde Supabase
  useEffect(() => {
    async function fetchReinos() {
      const { data, error } = await supabase
        .from('reinos')
        .select('*');
      
      if (error) {
        console.error("Error cargando reinos:", error);
      } else {
        setReinos(data);
      }
      setLoading(false);
    }
    fetchReinos();
  }, []);

  // 2. Función para detectar coordenadas (Para ayudarte a posicionar en la DB)
  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    console.log(`📍 Coordenadas para Supabase -> X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}`);
    // Opcional: Cerrar el modal si haces clic fuera de un punto
    setPuntoSeleccionado(null);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 text-[#6B5E70]">
      <Loader2 className="animate-spin mb-2" />
      <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Sincronizando Cartografía...</span>
    </div>
  );

  return (
    <div className="relative w-full overflow-hidden rounded-[2.5rem] border border-[#6B5E70]/10 shadow-2xl bg-white select-none">
      <div className="relative w-full h-full cursor-crosshair" onClick={handleMapClick}>
        
        {/* IMAGEN DEL MAPA (Tu dibujo principal) */}
        <Image 
          src="/dibujos/fanart/01.jpg" 
          alt="Mapa General"
          width={1920}
          height={1080}
          layout="responsive"
          priority
          className="block pointer-events-none"
        />

        {/* RENDERIZADO DE MARCADORES */}
        {reinos.map((reino) => (
          <Marker 
            key={reino.id} 
            x={reino.coord_x} 
            y={reino.coord_y} 
            info={reino.titulo} 
            onClick={() => setPuntoSeleccionado(reino)} 
          />
        ))}
      </div>

      {/* MODAL DE INFORMACIÓN (Aparece al tocar un punto) */}
      <AnimatePresence>
        {puntoSeleccionado && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="absolute bottom-6 left-6 right-6 md:left-8 md:right-8 bg-white/95 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-[#6B5E70]/20 shadow-2xl z-40"
          >
            <button 
              onClick={() => setPuntoSeleccionado(null)}
              className="absolute top-5 right-5 text-[#6B5E70]/30 hover:text-[#6B5E70] transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              
              {/* Espacio para el mini-mapa o dibujo del reino */}
              <div className="w-full md:w-56 h-40 bg-[#6B5E70]/5 rounded-3xl overflow-hidden border border-[#6B5E70]/10 flex-shrink-0 shadow-inner">
                 {puntoSeleccionado.mapa_url ? (
                   <img 
                    src={puntoSeleccionado.mapa_url} 
                    alt="Detalle del Reino" 
                    className="w-full h-full object-cover transition-transform hover:scale-110 duration-700"
                   />
                 ) : (
                   <div className="flex items-center justify-center h-full text-[9px] uppercase font-black opacity-20 text-[#6B5E70] tracking-tighter">Sin Mapa Detallado</div>
                 )}
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-2 mb-3">
                  <h3 className="text-[#6B5E70] font-black uppercase text-xl md:text-2xl tracking-tighter">
                    {puntoSeleccionado.titulo}
                  </h3>
                  <span className="text-[10px] bg-[#6B5E70] text-white px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                    Región
                  </span>
                </div>
                
                <p className="text-[#6B5E70]/80 text-sm md:text-base leading-relaxed italic font-serif">
                  "{puntoSeleccionado.descripcion}"
                </p>

                <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4">
                  <button className="group flex items-center gap-2 text-[11px] font-black bg-[#6B5E70] text-white px-6 py-3 rounded-2xl uppercase tracking-widest hover:bg-[#5a4e5f] transition-all shadow-lg active:scale-95">
                    Explorar Reino <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}