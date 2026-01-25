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
    <div className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden rounded-[3rem] border-4 border-[#6B5E70]/5 shadow-2xl bg-[#f8f5f2]">
      
      {/* CONTENEDOR DE ZOOM: 
          'enforceBounds={false}' permite que el usuario mueva el mapa con más libertad.
      */}
      <QuickPinchZoom 
        onUpdate={onUpdate} 
        maxZoom={5} 
        minZoom={0.8}
        enforceBounds={false} 
      >
        <div ref={mapRef} className="w-full h-full origin-top-left">
          <div 
            className="relative cursor-grab active:cursor-grabbing inline-block" 
            onClick={handleMapClick}
            style={{ width: '100%', height: 'auto' }}
          >
            {/* Usamos una etiqueta img normal o Image con un wrapper 
                para asegurar que el contenedor crezca con la imagen.
            */}
            <img 
              src="/dibujos/fanart/01.jpg" 
              alt="Mapa"
              className="w-full h-auto block pointer-events-none select-none"
              onLoad={() => {
                // Esto ayuda a que el componente de zoom recalcule el tamaño al cargar
                window.dispatchEvent(new Event('resize'));
              }}
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

      {/* TARJETA DE REINO (DISEÑO HORIZONTAL) */}
      <AnimatePresence>
        {puntoSeleccionado && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="absolute bottom-6 left-6 right-6 md:left-1/2 md:-translate-x-1/2 md:w-[680px] bg-white border border-[#6B5E70]/20 rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(107,94,112,0.5)] z-50 overflow-hidden"
          >
            <div className="flex flex-col md:flex-row min-h-[220px]">
              
              {/* IMAGEN IZQUIERDA */}
              <div className="w-full md:w-2/5 h-40 md:h-auto bg-[#6B5E70]/10 relative">
                {puntoSeleccionado.mapa_url ? (
                  <img src={puntoSeleccionado.mapa_url} className="w-full h-full object-cover" alt="Reino" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center opacity-20">
                    <Compass size={32} />
                  </div>
                )}
              </div>

              {/* INFO DERECHA */}
              <div className="w-full md:w-3/5 p-8 relative flex flex-col justify-center">
                <button onClick={() => setPuntoSeleccionado(null)} className="absolute top-4 right-4 text-[#6B5E70]/30 hover:text-[#6B5E70]">
                  <X size={20} />
                </button>

                <span className="text-[9px] font-black text-[#6B5E70]/40 uppercase tracking-widest mb-1 block">Reino Registrado</span>
                <h3 className="text-[#6B5E70] font-black text-3xl uppercase tracking-tighter mb-2">{puntoSeleccionado.nombre}</h3>
                <p className="text-[#6B5E70]/80 text-xs md:text-sm italic leading-relaxed mb-6">"{puntoSeleccionado.descripcion}"</p>
                
                <button className="w-fit bg-[#6B5E70] text-white text-[10px] font-black uppercase py-3 px-8 rounded-2xl flex items-center gap-3 hover:bg-[#5a4e5f] transition-all active:scale-95 shadow-lg shadow-[#6B5E70]/20">
                  Explorar Reino <ChevronRight size={14} />
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-6 left-6 pointer-events-none hidden md:block">
        <div className="bg-[#6B5E70] text-white text-[10px] font-black px-4 py-2 rounded-full shadow-xl opacity-80 uppercase tracking-widest">
          Modo Exploración
        </div>
      </div>
    </div>
  );
}