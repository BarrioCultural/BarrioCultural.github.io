"use client";
import React from 'react';
import { Sparkles, Footprints, ShieldCheck, Stars } from 'lucide-react';
import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';

export default function Personal({ datos }) {
  if (!datos) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-10 w-full max-w-6xl mx-auto px-4 pb-20 pt-10"
    >
      
      {/* --- CABECERA DE PERFIL (Estilo Lore Panel) --- */}
      <section className="bg-white border border-zinc-200 rounded-[3rem] p-12 md:p-16 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
        <Stars className="absolute top-10 right-10 text-[#6B5E70]/5" size={120} />
        
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-full bg-[#EBEBEB] border-4 border-[#6B5E70]/10 flex items-center justify-center shadow-inner">
            <Sparkles size={50} className="text-[#6B5E70]/40" />
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-[#6B5E70] uppercase leading-none">
          {datos.username}
        </h1>
        
        <div className="mt-6">
          <span className="filter-pill filter-pill-active py-1 px-8 text-xs">
            {datos.status || "Sin estado definido"}
          </span>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* --- SECCIÓN INVENTARIO --- */}
        <section className="bg-white/40 border border-zinc-200 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-sm shadow-xl">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-[10px] font-black text-[#6B5E70] uppercase tracking-[0.3em] flex items-center gap-2">
              <ShieldCheck size={16} /> Inventario
            </h2>
            <div className="h-[1px] flex-1 bg-[#6B5E70]/10"></div>
          </div>
          
          <div className="space-y-3">
            {datos.inventario_usuario && datos.inventario_usuario.length > 0 ? (
              datos.inventario_usuario.map((slot, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "flex justify-between items-center p-5 rounded-2xl border transition-all",
                    slot.equipado 
                      ? 'bg-white border-[#6B5E70] shadow-lg scale-[1.02]' 
                      : 'bg-[#EBEBEB]/40 border-zinc-200 opacity-60'
                  )}
                >
                  <div>
                    <span className="text-[8px] font-black uppercase text-[#6B5E70]/40 tracking-widest block mb-1">
                      {slot.items.tipo}
                    </span>
                    <p className="text-[#6B5E70] font-black text-sm uppercase italic leading-none">
                      {slot.items.nombre}
                    </p>
                  </div>
                  {slot.equipado && (
                    <div className="flex items-center gap-2 bg-[#6B5E70] px-3 py-1 rounded-full">
                       <span className="text-[8px] text-white font-black uppercase tracking-tighter">Equipado</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-[#6B5E70]/30 text-[10px] italic text-center py-10 uppercase font-black tracking-widest">Mochila vacía</p>
            )}
          </div>
        </section>

        {/* --- SECCIÓN BESTIARIO --- */}
        <section className="bg-white/40 border border-zinc-200 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-sm shadow-xl">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-[10px] font-black text-[#6B5E70] uppercase tracking-[0.3em] flex items-center gap-2">
              <Footprints size={16} /> Avistamientos
            </h2>
            <div className="h-[1px] flex-1 bg-[#6B5E70]/10"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {datos.descubrimientos && datos.descubrimientos.length > 0 ? (
              datos.descubrimientos.map((desc, i) => (
                <div 
                  key={i} 
                  className="bg-white border border-zinc-200 p-6 rounded-[2rem] text-center hover:shadow-lg transition-all"
                >
                  <div className="text-3xl mb-2">👾</div>
                  <h3 className="text-[9px] font-black text-[#6B5E70] uppercase tracking-widest leading-tight">
                    {desc.criaturas.nombre}
                  </h3>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-[#6B5E70]/30 text-[10px] italic text-center py-10 uppercase font-black tracking-widest">
                Sin avistamientos registrados
              </div>
            )}
          </div>
        </section>
      </div>
    </motion.div>
  );
}