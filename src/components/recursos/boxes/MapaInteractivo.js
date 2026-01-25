"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Loader2, ArrowRight, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const Marker = ({ x, y, info, onClick }) => (
  <div 
    className="absolute group z-10"
    style={{ top: `${y}%`, left: `${x}%`, transform: 'translate(-50%, -50%)' }}
  >
    <button 
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="relative flex items-center justify-center cursor-pointer outline-none transition-transform active:scale-90"
    >
      <div className="absolute w-6 h-6 bg-[#6B5E70]/20 rounded-full animate-ping" />
      <div className="w-5 h-5 bg-[#6B5E70] rounded-full border-2 border-white shadow-md group-hover:bg-white group-hover:border-[#6B5E70] transition-colors flex items-center justify-center">
         <MapPin size={10} className="text-white group-hover:text-[#6B5E70] transition-colors" />
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
    console.log(`📍 X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}`);
    if (puntoSeleccionado) setPuntoSeleccionado(null);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 text-[#6B5E70]">
      <Loader2 className="animate-spin mb-2" />
      <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Cargando Cartografía...</span>
    </div>
  );

  return (
    <div className="relative w-full max-w-6xl mx-auto rounded-[2.5rem] border-4 border-[#E2D8E6] shadow-2xl bg-white overflow-hidden font-sans">
      
      {/* CABECERA DEL MARCO (Como en tu imagen) */}
      <div className="bg-white border-b border-[#6B5E70]/5 px-8 py-4 flex justify-between items-center">
        <h2 className="text-[#6B5E70] font-black uppercase text-sm tracking-tighter flex items-center gap-2">
          Mapa Interactivo <span className="opacity-30">v1.0</span>
        </h2>
        <div className="w-8 h-8 rounded-full bg-[#6B5E70]/5 flex items-center justify-center text-[#6B5E70]/30">
          <X size={16} />
        </div>
      </div>

      <div className="relative overflow-hidden group">
        {/* ÁREA DEL MAPA */}
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

        {/* TARJETA FLOTANTE (Punto Seleccionado) */}
        <AnimatePresence>
          {puntoSeleccionado && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="absolute inset-x-4 bottom-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:bottom-10 w-auto md:min-w-[500px] bg-white border border-[#6B5E70]/10 rounded-[2rem] shadow-[0_15px_40px_-10px_rgba(107,94,112,0.4)] p-6 z-30"
            >
              <div className="flex flex-col md:flex-row gap-6 items-center">
                {/* Miniatura */}
                <div className="w-32 h-32 md:w-36 md:h-36 bg-[#6B5E70]/5 rounded-2xl overflow-hidden border border-[#6B5E70]/10 flex-shrink-0 relative">
                   {puntoSeleccionado.mapa_url ? (
                     <img src={puntoSeleccionado.mapa_url} className="w-full h-full object-cover" alt="Thumb" />
                   ) : (
                     <div className="flex items-center justify-center h-full text-[7px] font-black opacity-20 text-center px-2">MAPA NO DISPONIBLE</div>
                   )}
                </div>

                {/* Contenido */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-[#6B5E70]/40 uppercase tracking-widest">#{puntoSeleccionado.id || 'REINO'}</span>
                    <ChevronRight className="text-[#6B5E70]/20" size={16} />
                  </div>
                  
                  <h3 className="text-[#6B5E70] font-black text-xl uppercase tracking-tighter leading-none mb-2">
                    {puntoSeleccionado.titulo}
                  </h3>
                  
                  <p className="text-[#6B5E70]/60 text-xs italic leading-relaxed mb-4 line-clamp-2">
                    "{puntoSeleccionado.descripcion}"
                  </p>

                  <button className="w-full md:w-auto bg-[#6B5E70] text-white text-[10px] font-black uppercase py-3 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-[#5a4e5f] transition-all group/btn">
                    Explorar Reino 
                    <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Botón cerrar minúsculo pero elegante */}
              <button 
                onClick={() => setPuntoSeleccionado(null)}
                className="absolute -top-2 -right-2 w-8 h-8 bg-white border border-[#6B5E70]/10 rounded-full flex items-center justify-center text-[#6B5E70]/40 hover:text-[#6B5E70] shadow-sm transition-colors"
              >
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}