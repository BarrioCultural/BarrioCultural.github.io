"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const Marker = ({ x, y, info, onClick }) => (
  <div 
    className="absolute group z-20"
    style={{ top: `${y}%`, left: `${x}%`, transform: 'translate(-50%, -50%)' }}
  >
    <button 
      onClick={(e) => {
        e.stopPropagation(); 
        onClick();
      }}
      className="relative flex items-center justify-center cursor-pointer outline-none active:scale-90 transition-transform"
    >
      <div className="absolute w-8 h-8 bg-[#6B5E70]/30 rounded-full animate-ping" />
      <div className="w-5 h-5 bg-[#6B5E70] rounded-full border-2 border-white shadow-lg group-hover:scale-125 transition-transform flex items-center justify-center">
         <MapPin size={10} className="text-white" />
      </div>
    </button>
    <div className="hidden group-hover:block absolute bottom-8 left-1/2 -translate-x-1/2 bg-[#6B5E70] text-white text-[9px] font-black uppercase px-2 py-1 rounded shadow-xl whitespace-nowrap pointer-events-none">
      {info}
    </div>
  </div>
);

export default function MapaInteractivo() {
  const [reinos, setReinos] = useState([]);
  const [puntoSeleccionado, setPuntoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReinos() {
      const { data, error } = await supabase.from('reinos').select('*');
      if (error) console.error(error);
      else setReinos(data);
      setLoading(false);
    }
    fetchReinos();
  }, []);

  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    console.log(`📍 Coordenadas -> X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}`);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 text-[#6B5E70]">
      <Loader2 className="animate-spin mb-2" />
      <span className="text-[10px] font-black uppercase opacity-50">Cargando Mundo...</span>
    </div>
  );

  return (
    <div className="relative w-full overflow-hidden rounded-[2.5rem] border border-[#6B5E70]/10 shadow-2xl bg-white">
      
      {/* MAPA Y MARCADORES */}
      <div className="relative w-full h-full cursor-crosshair" onClick={handleMapClick}>
        <Image 
          src="/dibujos/fanart/01.jpg" 
          alt="Mapa General"
          width={1920}
          height={1080}
          layout="responsive"
          priority
          className="pointer-events-none select-none"
        />

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

      {/* MODAL FIJO (Aparece sobre toda la pantalla) */}
      <AnimatePresence>
        {puntoSeleccionado && (
          <>
            {/* Capa oscura de fondo */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPuntoSeleccionado(null)}
              className="fixed inset-0 bg-[#6B5E70]/30 backdrop-blur-sm z-[9998]"
            />

            {/* Cuadro de Información */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20, x: "-50%", y: "-50%" }}
              animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
              exit={{ opacity: 0, scale: 0.9, x: "-50%", y: "-50%" }}
              className="fixed top-1/2 left-1/2 w-[90%] md:w-[600px] bg-white p-6 md:p-10 rounded-[2.5rem] border border-[#6B5E70]/20 shadow-[0_25px_50px_-12px_rgba(107,94,112,0.5)] z-[9999]"
            >
              <button 
                onClick={() => setPuntoSeleccionado(null)}
                className="absolute top-6 right-6 p-2 text-[#6B5E70]/40 hover:text-[#6B5E70] transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* Imagen/Mapa del Reino */}
                <div className="w-full md:w-52 h-40 bg-[#6B5E70]/5 rounded-[2rem] overflow-hidden border border-[#6B5E70]/10 flex-shrink-0 shadow-inner">
                   {puntoSeleccionado.mapa_url ? (
                     <img 
                      src={puntoSeleccionado.mapa_url} 
                      className="w-full h-full object-cover" 
                      alt="Mapa Detalle" 
                     />
                   ) : (
                     <div className="flex items-center justify-center h-full text-[8px] font-black opacity-20 text-[#6B5E70]">MAPA NO DISPONIBLE</div>
                   )}
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-[#6B5E70] font-black uppercase text-2xl tracking-tighter mb-2">
                    {puntoSeleccionado.titulo}
                  </h3>
                  <p className="text-[#6B5E70]/80 text-sm md:text-base italic leading-relaxed mb-6">
                    "{puntoSeleccionado.descripcion}"
                  </p>
                  <button className="flex items-center gap-3 text-[11px] font-black bg-[#6B5E70] text-white px-8 py-3.5 rounded-2xl uppercase tracking-widest mx-auto md:mx-0 shadow-lg hover:bg-[#5a4e5f] transition-all active:scale-95">
                    Explorar Reino <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}