"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Loader2, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const Marker = ({ x, y, info, onClick }) => (
  <div 
    className="absolute group z-10"
    style={{ top: `${y}%`, left: `${x}%`, transform: 'translate(-50%, -50%)' }}
  >
    {/* Nombre del reino siempre visible o al pasar el mouse */}
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#6B5E70] text-white text-[10px] font-black uppercase px-2 py-1 rounded shadow-lg whitespace-nowrap mb-1 opacity-90 group-hover:opacity-100 transition-opacity">
      {info}
    </div>

    <button 
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="relative flex items-center justify-center cursor-pointer outline-none"
    >
      <div className="absolute w-6 h-6 bg-[#6B5E70]/20 rounded-full animate-ping" />
      <div className="w-5 h-5 bg-[#6B5E70] rounded-full border-2 border-white shadow-md group-hover:scale-110 transition-transform flex items-center justify-center">
         <MapPin size={10} className="text-white" />
      </div>
    </button>
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
    if (puntoSeleccionado) setPuntoSeleccionado(null);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 text-[#6B5E70]">
      <Loader2 className="animate-spin mb-2" />
      <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Cargando Mapa...</span>
    </div>
  );

  return (
    <div className="relative w-full overflow-hidden rounded-[2.5rem] border border-[#6B5E70]/10 shadow-2xl bg-white">
      
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

        {/* TARJETA FLOTANTE (Solo cuando seleccionas un reino) */}
        <AnimatePresence>
          {puntoSeleccionado && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-6 left-6 right-6 md:left-1/2 md:-translate-x-1/2 md:w-[500px] bg-white border border-[#6B5E70]/10 rounded-[2rem] shadow-2xl p-6 z-30"
            >
              <div className="flex flex-col md:flex-row gap-6 items-center">
                {/* Miniatura del Reino */}
                <div className="w-28 h-28 bg-[#6B5E70]/5 rounded-2xl overflow-hidden flex-shrink-0 border border-[#6B5E70]/5">
                   {puntoSeleccionado.mapa_url ? (
                     <img src={puntoSeleccionado.mapa_url} className="w-full h-full object-cover" alt="Detalle" />
                   ) : (
                     <div className="flex items-center justify-center h-full text-[8px] font-black opacity-20 px-2 text-center">SIN MAPA</div>
                   )}
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-[#6B5E70] font-black text-xl uppercase tracking-tighter mb-1">
                    {puntoSeleccionado.titulo}
                  </h3>
                  <p className="text-[#6B5E70]/70 text-xs italic leading-relaxed mb-4">
                    "{puntoSeleccionado.descripcion}"
                  </p>
                  <button className="bg-[#6B5E70] text-white text-[10px] font-black uppercase py-2.5 px-6 rounded-xl flex items-center gap-2 mx-auto md:mx-0 hover:bg-[#5a4e5f] transition-colors">
                    Explorar Reino <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              <button 
                onClick={() => setPuntoSeleccionado(null)}
                className="absolute top-4 right-4 text-[#6B5E70]/20 hover:text-[#6B5E70]"
              >
                <X size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}