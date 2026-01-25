"use client";

import Image from 'next/image';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Loader2, ChevronRight, Compass } from 'lucide-react';
import QuickPinchZoom, { make3dTransformValue } from "react-quick-pinch-zoom";
import { supabase } from '@/lib/supabase';

const Marker = ({ x, y, info, onClick }) => (
  <div 
    className="absolute z-20 flex flex-col items-center" 
    style={{ top: `${y}%`, left: `${x}%`, transform: 'translate(-50%, -50%)' }}
  >
    <div className="mb-1 bg-[#6B5E70] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-lg whitespace-nowrap pointer-events-none border border-white/20 scale-90 group-hover:scale-100 transition-transform">
      {info}
    </div>

    <button 
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="relative flex items-center justify-center cursor-pointer outline-none group"
    >
      <div className="absolute w-5 h-5 bg-[#6B5E70]/20 rounded-full animate-ping" />
      <div className="w-4 h-4 bg-[#6B5E70] rounded-full border-2 border-white shadow-md group-hover:bg-white group-hover:border-[#6B5E70] transition-all flex items-center justify-center">
         <MapPin size={8} className="text-white group-hover:text-[#6B5E70]" />
      </div>
    </button>
  </div>
);

export default function MapaInteractivo() {
  const [reinos, setReinos] = useState([]);
  const [puntoSeleccionado, setPuntoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef();

  const onUpdate = useCallback(({ x, y, scale }) => {
    if (mapRef.current) {
      const value = make3dTransformValue({ x, y, scale });
      mapRef.current.style.setProperty("transform", value);
    }
  }, []);

  useEffect(() => {
    async function fetchReinos() {
      const { data, error } = await supabase.from('reinos').select('*');
      if (error) console.error("Error:", error);
      else setReinos(data);
      setLoading(false);
    }
    fetchReinos();
  }, []);

  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    console.log(`📍 X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}`);
    if (puntoSeleccionado) setPuntoSeleccionado(null);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 text-[#6B5E70]">
      <Loader2 className="animate-spin mb-2" />
      <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Trazando rutas...</span>
    </div>
  );

  return (
    <div className="relative w-full overflow-hidden rounded-[3rem] border-4 border-[#6B5E70]/5 shadow-2xl bg-white aspect-[4/3] md:aspect-video">
      
      {/* CAPA DE ZOOM */}
      <QuickPinchZoom onUpdate={onUpdate} maxZoom={5} enforceBounds={true}>
        <div ref={mapRef} className="relative w-full h-full origin-top-left">
          <div className="relative w-full h-full cursor-grab active:cursor-grabbing" onClick={handleMapClick}>
            <Image 
              src="/dibujos/fanart/01.jpg" 
              alt="Mapa"
              width={1920}
              height={1080}
              layout="responsive"
              priority
              className="pointer-events-none select-none"
            />
            {reinos.map((reino) => (
              <Marker key={reino.id} x={reino.coord_x} y={reino.coord_y} info={reino.nombre} onClick={() => setPuntoSeleccionado(reino)} />
            ))}
          </div>
        </div>
      </QuickPinchZoom>

      {/* TARJETA FLOTANTE REDISEÑADA */}
      <AnimatePresence>
        {puntoSeleccionado && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="absolute bottom-6 left-6 right-6 md:left-1/2 md:-translate-x-1/2 md:w-[650px] bg-white/95 backdrop-blur-md border border-[#6B5E70]/20 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(107,94,112,0.5)] z-50 overflow-hidden"
          >
            <div className="flex flex-col md:flex-row h-full">
              
              {/* Lado Izquierdo: Imagen con diseño de marco */}
              <div className="w-full md:w-2/5 h-48 md:h-auto relative bg-[#6B5E70]/10 overflow-hidden">
                {puntoSeleccionado.mapa_url ? (
                  <img src={puntoSeleccionado.mapa_url} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" alt="Reino" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center opacity-30">
                    <Compass size={40} className="mb-2 text-[#6B5E70]" />
                    <span className="text-[8px] font-black uppercase tracking-tighter">Territorio Desconocido</span>
                  </div>
                )}
                <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.1)] pointer-events-none" />
              </div>

              {/* Lado Derecho: Información Jerárquica */}
              <div className="w-full md:w-3/5 p-8 flex flex-col justify-center relative">
                <button 
                  onClick={() => setPuntoSeleccionado(null)}
                  className="absolute top-4 right-4 p-2 text-[#6B5E70]/20 hover:text-[#6B5E70] transition-colors"
                >
                  <X size={20} />
                </button>

                <div className="mb-1 flex items-center gap-2">
                   <div className="h-[2px] w-6 bg-[#6B5E70]/20" />
                   <span className="text-[9px] font-black text-[#6B5E70]/40 uppercase tracking-[0.2em]">Crónicas de Omnisia</span>
                </div>

                <h3 className="text-[#6B5E70] font-black text-3xl uppercase tracking-tighter leading-tight mb-3">
                  {puntoSeleccionado.nombre}
                </h3>

                <p className="text-[#6B5E70]/80 text-xs md:text-sm italic font-serif leading-relaxed mb-6 border-l-2 border-[#6B5E70]/10 pl-4">
                  "{puntoSeleccionado.descripcion}"
                </p>

                <div className="flex items-center gap-4">
                  <button className="flex-grow md:flex-none bg-[#6B5E70] text-white text-[10px] font-black uppercase py-3.5 px-8 rounded-2xl flex items-center justify-center gap-3 hover:bg-[#5a4e5f] transition-all active:scale-95 shadow-lg shadow-[#6B5E70]/20">
                    Explorar Reino <ChevronRight size={14} />
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guía visual */}
      <div className="absolute top-6 left-6 pointer-events-none">
        <div className="bg-[#6B5E70] text-white text-[10px] font-black px-4 py-2 rounded-full shadow-xl flex items-center gap-2 opacity-80">
          <Compass size={14} className="animate-spin-[10s]" />
          <span className="tracking-widest uppercase">Navegación Táctica</span>
        </div>
      </div>
    </div>
  );
}