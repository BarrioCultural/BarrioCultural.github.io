"use client";
import React from 'react';
import { Sparkles, Footprints, ShieldCheck, Fingerprint } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function Personal({ datos }) {
  if (!datos) return null;

  return (
    <div className="flex flex-col gap-10 w-full max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-1000 px-4">
      
      {/* --- CABECERA DE IDENTIDAD --- */}
      <section className="bg-[#E2D8E6]/40 border border-[#6B5E70]/10 rounded-[2.5rem] p-10 md:p-14 backdrop-blur-md shadow-sm flex flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="w-28 h-28 rounded-full bg-white/50 border border-[#6B5E70]/10 flex items-center justify-center shadow-inner">
            <Sparkles size={45} className="text-[#6B5E70]/40" />
          </div>
        </div>

        {/* Nombre desde Supabase */}
        <h1 className="text-4xl font-black italic tracking-tighter text-[#6B5E70] uppercase">
          {datos.username}
        </h1>
        
        {/* Status desde Supabase */}
        <p className="text-[#6B5E70]/50 text-[10px] uppercase font-black tracking-[0.3em] mt-2">
          {datos.status}
        </p>
        
        {/* Especie desde Supabase */}
        <div className="mt-8 px-10 py-4 bg-white/40 border border-[#6B5E70]/10 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="flex flex-col items-center">
            <span className="text-[#6B5E70]/40 text-[9px] font-black uppercase tracking-widest mb-1">Especie</span>
            <span className="text-xl font-black text-[#6B5E70] uppercase tracking-tighter italic">
              {datos.especie}
            </span>
          </div>
          <Fingerprint className="text-[#6B5E70]/20" size={28} />
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* --- INVENTARIO DINÁMICO --- */}
        <section className="bg-white/20 border border-[#6B5E70]/10 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-sm shadow-xl shadow-[#6B5E70]/5">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-sm font-black text-[#6B5E70] uppercase tracking-[0.2em] flex items-center gap-2">
              <ShieldCheck size={18} /> Inventario
            </h2>
            <div className="h-[1px] flex-1 bg-[#6B5E70]/10"></div>
          </div>
          
          <div className="space-y-4">
            {datos.inventario_usuario?.map((slot, i) => (
              <div 
                key={i} 
                className={cn(
                  "flex justify-between items-center p-5 rounded-2xl border transition-all duration-500",
                  slot.equipado 
                    ? 'bg-[#E2D8E6]/60 border-[#6B5E70]/30 shadow-md' 
                    : 'bg-[#E2D8E6]/10 border-[#6B5E70]/5 opacity-40'
                )}
              >
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-[#6B5E70]/40 tracking-widest mb-1">
                    {slot.items.tipo}
                  </span>
                  <p className="text-[#6B5E70] font-bold text-sm uppercase italic tracking-tighter">
                    {slot.items.nombre}
                  </p>
                </div>
                {slot.equipado && (
                  <div className="flex items-center gap-1">
                     <div className="w-1.5 h-1.5 bg-[#6B5E70] rounded-full" />
                     <span className="text-[8px] text-[#6B5E70] font-black uppercase tracking-tighter">Equipado</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* --- BESTIARIO DINÁMICO --- */}
        <section className="bg-[#E2D8E6]/40 border border-[#6B5E70]/10 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-md shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-sm font-black text-[#6B5E70] uppercase tracking-[0.2em] flex items-center gap-2">
              <Footprints size={18} /> Bestiario
            </h2>
            <div className="h-[1px] flex-1 bg-[#6B5E70]/10"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {datos.descubrimientos?.map((desc, i) => (
              <div 
                key={i} 
                className="group bg-white/30 border border-[#6B5E70]/5 p-6 rounded-[2rem] text-center hover:bg-white/60 hover:border-[#6B5E70]/20 transition-all duration-500 shadow-sm"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-500">
                  👾
                </div>
                <h3 className="text-[10px] font-black text-[#6B5E70] uppercase tracking-widest">
                  {desc.criaturas.nombre}
                </h3>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}