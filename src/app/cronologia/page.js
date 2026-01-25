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
        "Consultando..."
      </span>
    </div>
  );

  return (
    /* overflow-x-hidden es clave para que no baile la pantalla */
    <div className="bg-[#F8F5F2] min-h-screen py-12 md:py-20 px-4 md:px-6 font-sans selection:bg-[#6B5E70]/20 overflow-x-hidden">
      <div className="max-w-4xl mx-auto">
        
        {/* CABECERA */}
        <div className="flex flex-col items-center mb-16 md:mb-24 text-center">
          <div className="mb-3 flex items-center gap-3">
            <div className="h-[1px] w-8 md:w-10 bg-[#6B5E70]/20" />
            <span className="text-[9px] md:text-[10px] font-black text-[#6B5E70]/40 uppercase tracking-[0.4em]">
              Línea del Tiempo
            </span>
            <div className="h-[1px] w-8 md:w-10 bg-[#6B5E70]/20" />
          </div>
          <h1 className="text-[#6B5E70] font-black text-3xl md:text-6xl uppercase tracking-tighter leading-tight">
            "Crónicas del Jardin"
          </h1>
        </div>

        {/* CONTENEDOR DE LA LÍNEA: ml-6 para dejar espacio al punto en móvil */}
        <div className="relative border-l-2 border-[#6B5E70]/10 ml-6 md:ml-0 md:left-1/2">
          {eventos.map((evento, index) => {
            const esPar = index % 2 === 0;
            
            return (
              <motion.div 
                key={evento.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6 }}
                /* w-full en móvil, md:w-1/2 en PC */
                className={`relative mb-12 md:mb-20 w-full md:w-1/2 ${
                  esPar ? 'md:pr-14 md:text-right md:ml-auto' : 'md:pl-14 md:mr-auto'
                }`}
              >
                {/* EL NODO: Ajustado para que no se mueva de la línea en móvil */}
                <div 
                  className={`absolute top-6 md:top-2 w-4 h-4 bg-white border-2 border-[#6B5E70] rounded-full z-10 shadow-sm
                    left-[-33px] md:left-auto ${esPar ? 'md:right-[-9px]' : 'md:left-[-9px]'}`}
                />

                {/* TARJETA DE EVENTO: padding reducido en móvil y break-words */}
                <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-[#6B5E70]/5 shadow-[0_15px_45px_rgba(107,94,112,0.04)] hover:shadow-[0_20px_60px_rgba(107,94,112,0.08)] transition-all duration-500">
                  <div className={`flex items-center gap-2 mb-4 ${esPar ? 'md:justify-end' : ''}`}>
                    <Scroll size={12} className="text-[#6B5E70]/30" />
                    <span className="text-[8px] md:text-[9px] font-black text-[#6B5E70]/20 uppercase tracking-widest">
                      Registro #{evento.orden}
                    </span>
                  </div>

                  <h3 className="text-[#6B5E70] font-black text-xl md:text-2xl uppercase tracking-tight mb-3 md:mb-4 leading-tight break-words">
                    {evento.titulo}
                  </h3>

                  <p className="text-[#6B5E70]/60 text-sm md:text-base leading-relaxed italic font-medium break-words">
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