"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Loader2, Scroll } from 'lucide-react';

export default function Cronologia() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCronologia() {
      // Llamada a tu tabla 'cronologia'
      const { data, error } = await supabase
        .from('cronologia')
        .select('*')
        .order('orden', { ascending: true });
      
      if (!error) {
        setEventos(data);
      } else {
        console.error("Error al obtener los anales:", error);
      }
      setLoading(false);
    }
    fetchCronologia();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 text-[#6B5E70]">
      <Loader2 className="animate-spin mb-2" />
      <span className="text-[10px] font-black uppercase tracking-widest opacity-40 italic">
        "Consultando los Anales..."
      </span>
    </div>
  );

  return (
    <div className="bg-[#F8F5F2] min-h-screen py-20 px-6 font-sans selection:bg-[#6B5E70]/20">
      <div className="max-w-4xl mx-auto">
        
        {/* CABECERA: Siguiendo la estética de tu Mapa */}
        <div className="flex flex-col items-center mb-24">
          <div className="mb-3 flex items-center gap-3">
            <div className="h-[1px] w-10 bg-[#6B5E70]/20" />
            <span className="text-[10px] font-black text-[#6B5E70]/40 uppercase tracking-[0.4em]">
              Línea del Tiempo
            </span>
            <div className="h-[1px] w-10 bg-[#6B5E70]/20" />
          </div>
          <h1 className="text-[#6B5E70] font-black text-4xl md:text-6xl uppercase tracking-tighter leading-none text-center">
            "Crónicas de Omnisia"
          </h1>
        </div>

        {/* CONTENEDOR DE LA LÍNEA */}
        <div className="relative border-l-2 border-[#6B5E70]/10 ml-4 md:ml-0 md:left-1/2">
          {eventos.map((evento, index) => {
            const esPar = index % 2 === 0;
            
            return (
              <motion.div 
                key={evento.id}
                initial={{ opacity: 0, x: esPar ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`relative mb-20 md:w-1/2 ${esPar ? 'md:pr-14 md:text-right md:ml-auto' : 'md:pl-14 md:mr-auto'}`}
              >
                {/* EL NODO (Estilo Marker de tu mapa) */}
                <div 
                  className={`absolute top-2 w-4 h-4 bg-white border-2 border-[#6B5E70] rounded-full z-10 shadow-sm transition-transform group-hover:scale-125
                    ${esPar ? 'left-[-9px] md:left-auto md:right-[-9px]' : 'left-[-9px]'}`}
                />

                {/* TARJETA DE EVENTO */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-[#6B5E70]/5 shadow-[0_15px_45px_rgba(107,94,112,0.04)] hover:shadow-[0_20px_60px_rgba(107,94,112,0.08)] transition-all duration-500">
                  <div className={`flex items-center gap-2 mb-4 ${esPar ? 'md:justify-end' : ''}`}>
                    <Scroll size={12} className="text-[#6B5E70]/30" />
                    <span className="text-[9px] font-black text-[#6B5E70]/20 uppercase tracking-widest">
                      Registro #{evento.orden}
                    </span>
                  </div>

                  <h3 className="text-[#6B5E70] font-black text-2xl uppercase tracking-tight mb-4 leading-tight">
                    {evento.titulo}
                  </h3>

                  <p className="text-[#6B5E70]/60 text-sm md:text-base leading-relaxed italic font-medium">
                    "{evento.descripcion}"
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}