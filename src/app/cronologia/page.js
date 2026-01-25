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
      
      if (!error) setEventos(data);
      setLoading(false);
    }
    fetchCronologia();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 text-[#6B5E70]">
      <Loader2 className="animate-spin mb-2" />
      <span className="text-[10px] font-black uppercase tracking-widest opacity-40 italic">"Consultando los Anales..."</span>
    </div>
  );

  return (
    <div className="bg-[#F8F5F2] min-h-screen py-12 md:py-20 px-4 md:px-6 font-sans overflow-x-hidden">
      <div className="max-w-4xl mx-auto">
        
        {/* CABECERA */}
        <div className="flex flex-col items-center mb-16 md:mb-24 text-center">
          <div className="mb-3 flex items-center gap-3">
            <div className="h-[1px] w-6 md:w-10 bg-[#6B5E70]/20" />
            <span className="text-[8px] md:text-[10px] font-black text-[#6B5E70]/40 uppercase tracking-[0.4em]">Registros Históricos</span>
            <div className="h-[1px] w-6 md:w-10 bg-[#6B5E70]/20" />
          </div>
          <h1 className="text-[#6B5E70] font-black text-3xl md:text-6xl uppercase tracking-tighter leading-tight">
            "Cronología de Omnisia"
          </h1>
        </div>

        {/* CONTENEDOR DE LA LÍNEA */}
        <div className="relative ml-4 md:ml-0">
          {/* La Línea Vertical Central (Solo se centra en PC) */}
          <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-[2px] bg-[#6B5E70]/10" />

          {eventos.map((evento, index) => {
            const esPar = index % 2 === 0;
            
            return (
              <motion.div 
                key={evento.id} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                className={`relative mb-12 md:mb-24 flex flex-col md:flex-row items-center w-full ${
                  esPar ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Espaciador invisible para mantener el zigzag en PC */}
                <div className="hidden md:block w-1/2" />

                {/* EL PUNTO (Nodo) */}
                <div className="absolute left-[-5px] md:left-1/2 md:-translate-x-1/2 top-6 md:top-8 w-3 h-3 md:w-4 md:h-4 bg-white border-2 border-[#6B5E70] rounded-full z-10 shadow-sm" />

                {/* TARJETA */}
                <div className={`w-full md:w-1/2 pl-8 md:pl-0 ${esPar ? 'md:pr-12' : 'md:pl-12'}`}>
                  <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-[#6B5E70]/10 shadow-[0_10px_40px_rgba(107,94,112,0.05)] hover:shadow-[0_20px_50px_rgba(107,94,112,0.1)] transition-all duration-500 group">
                    
                    <div className={`flex items-center gap-2 mb-4 ${esPar ? 'md:justify-end' : 'justify-start'}`}>
                      <Scroll size={12} className="text-[#6B5E70]/30" />
                      <span className="text-[8px] md:text-[9px] font-black text-[#6B5E70]/20 uppercase tracking-widest">Entrada #{evento.orden}</span>
                    </div>

                    <h3 className={`text-[#6B5E70] font-black text-xl md:text-2xl uppercase tracking-tight mb-3 leading-tight ${esPar ? 'md:text-right' : 'text-left'}`}>
                      {evento.titulo}
                    </h3>

                    <p className={`text-[#6B5E70]/70 text-sm md:text-base leading-relaxed italic font-medium break-words ${esPar ? 'md:text-right' : 'text-left'}`}>
                      "{evento.descripcion}"
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}