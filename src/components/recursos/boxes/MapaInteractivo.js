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
    <div className="mb-1 bg-[#6B5E70] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-lg whitespace-nowrap pointer-events-none border border-white/20">
      {info}
    </div>
    <button 
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="relative flex items-center justify-center cursor-pointer outline-none group"
    >
      <div className="absolute w-5 h-5 bg-[#6B5E70]/20 rounded-full animate-ping" />
      <div className="w-4 h-4 bg-[#6B5E70] rounded-full border-2 border-white shadow-md group-hover:bg-white transition-all flex items-center justify-center">
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
      <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Desplegando Mapa...</span>
    </div>
  );

  return (
    /* Eliminado rounded, shadow y ajustado el bg para que no cree espacios extra */
    <div className="relative w-full h-auto min-h-[500px] overflow-hidden border-b border-[#6B5E70]/10 bg-white">
      
      <QuickPinchZoom 
        onUpdate={onUpdate} 
        maxZoom={5} 
        minZoom={0.5}
        enforceBounds={false} 
      >
        <div ref={mapRef} className="w-full h-full origin-top-left">
          <div 
            className="relative cursor-grab active:cursor-grabbing inline-block w-full h-full" 
            onClick={handleMapClick}
          >
            <img 
              src="/dibujos/fanart/01.jpg" 
              alt="Mapa"
              className="w-full h-auto block pointer-events-none select-none"
              onLoad={() => window.dispatchEvent(new Event('resize'))}
            />

            {reinos.map((reino) => (
              <Marker 
                key={reino.id} 
                x={reino.coord_x} 
                y={reino.coord_y} 
                info={reino.nombre} 
                onClick={() => setPuntoSeleccionado(reino)} 
              />
            ))}
          </div>
        </div>
      </QuickPinchZoom>

      {/* TARJETA DE REINO (Bordes rectos o mínimamente suavizados según el mapa) */}
      <AnimatePresence>
        {puntoSeleccionado && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="absolute bottom-0 left-0 right-0 md:bottom-10 md:left-1/2 md:-translate-x-1/2 md:w-[680px] bg-white border-t md:border border-[#6B5E70]/20 z-50 overflow-hidden shadow-2xl"
          >
            <div className="flex flex-col md:flex-row min-h-[220px]">
              
              {/* IMAGEN IZQUIERDA */}
              <div className="w-full md:w-2/5 h-48 md:h-auto bg-[#6B5E70]/5 relative">
                {puntoSeleccionado.mapa_url ? (
                  <img src={puntoSeleccionado.mapa_url} className="w-full h-full object-cover" alt="Reino" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center opacity-20 text-[#6B5E70]">
                    <Compass size={32} />
                  </div>
                )}
              </div>

              {/* INFO DERECHA */}
              <div className="w-full md:w-3/5 p-8 relative flex flex-col justify-center">
                <button onClick={() => setPuntoSeleccionado(null)} className="absolute top-4 right-4 text-[#6B5E70]/40 hover:text-[#6B5E70]">
                  <X size={20} />
                </button>

                <span className="text-[9px] font-black text-[#6B5E70]/40 uppercase tracking-widest mb-1 block">Registro de Exploración</span>
                <h3 className="text-[#6B5E70] font-black text-3xl uppercase tracking-tighter mb-2 leading-none">
                  {puntoSeleccionado.nombre}
                </h3>
                <p className="text-[#6B5E70]/80 text-xs md:text-sm italic leading-relaxed mb-6">
                  "{puntoSeleccionado.descripcion}"
                </p>
                
                <button className="w-fit bg-[#6B5E70] text-white text-[10px] font-black uppercase py-3 px-8 rounded-none flex items-center gap-3 hover:bg-[#5a4e5f] transition-all active:scale-95 shadow-lg">
                  Explorar Reino <ChevronRight size={14} />
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}