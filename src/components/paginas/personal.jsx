"use client";
import React from 'react';
import { Sparkles, Footprints, ShieldCheck, Stars } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function Personal({ datos }) {
  // Si no hay datos, evitamos que la página rompa
  if (!datos) return null;

  return (
    <div className="flex flex-col gap-10 w-full max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-1000 px-4">
      
      {/* --- CABECERA DE PERFIL --- */}
      <section className="bg-[#E2D8E6]/40 border border-[#6B5E70]/10 rounded-[2.5rem] p-12 md:p-16 backdrop-blur-md shadow-sm flex flex-col items-center text-center relative overflow-hidden">
        <Stars className="absolute top-10 right-10 text-[#6B5E70]/5" size={100} />
        
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-full bg-white/50 border border-[#6B5E70]/10 flex items-center justify-center shadow-inner group">
            <Sparkles size={50} className="text-[#6B5E70]/40" />
          </div>
        </div>

        {/* Nombre: Franilover */}
        <h1 className="text-5xl font-black italic tracking-tighter text-[#6B5E70] uppercase leading-none">
          {datos.username}
        </h1>
        
        {/* Status: Explorador Novato (traído de tu tabla) */}
        <div className="mt-4 px-6 py-2 bg-[#6B5E70]/5 rounded-full border border-[#6B5E70]/5">
          <p className="text-[#6B5E70]/60 text-[11px] uppercase font-black tracking-[0.4em]">
            {datos.status || "Sin estado definido"}
          </p>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* --- SECCIÓN INVENTARIO --- */}
        <section className="bg-white/20 border border-[#6B5E70]/10 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-sm shadow-xl shadow-[#6B5E70]/5">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-[10px] font-black text-[#6B5E70] uppercase tracking-[0.3em] flex items-center gap-2">
              <ShieldCheck size={16} /> Inventario
            </h2>
            <div className="h-[1px] flex-1 bg-[#6B5E70]/10"></div>
          </div>
          
          <div className="space-y-4">
            {datos.inventario_usuario && datos.inventario_usuario.length > 0 ? (
              datos.inventario_usuario.map((slot, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "flex justify-between items-center p-6 rounded-3xl border transition-all duration-500",
                    slot.equipado 
                      ? 'bg-[#E2D8E6]/70 border-[#6B5E70]/30 shadow-md translate-x-1' 
                      : 'bg-[#E2D8E6]/10 border-[#6B5E70]/5 opacity-40'
                  )}
                >
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase text-[#6B5E70]/40 tracking-widest mb-1">
                      {slot.items.tipo}
                    </span>
                    <p className="text-[#6B5E70] font-bold text-sm uppercase italic tracking-tighter">
                      {slot.items.nombre}
                    </p>
                  </div>
                  {slot.equipado && (
                    <div className="flex items-center gap-2 bg-[#6B5E70] px-3 py-1 rounded-full">
                       <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                       <span className="text-[8px] text-white font-black uppercase tracking-tighter">Equipado</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-[#6B5E70]/30 text-xs italic text-center py-10 uppercase font-black">Mochila vacía</p>
            )}
          </div>
        </section>

        {/* --- SECCIÓN BESTIARIO --- */}
        <section className="bg-[#E2D8E6]/40 border border-[#6B5E70]/10 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-md shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-[10px] font-black text-[#6B5E70] uppercase tracking-[0.3em] flex items-center gap-2">
              <Footprints size={16} /> Bestiario
            </h2>
            <div className="h-[1px] flex-1 bg-[#6B5E70]/10"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {datos.descubrimientos && datos.descubrimientos.length > 0 ? (
              datos.descubrimientos.map((desc, i) => (
                <div 
                  key={i} 
                  className="group bg-white/40 border border-[#6B5E70]/5 p-6 rounded-[2.2rem] text-center hover:bg-white transition-all duration-500 shadow-sm"
                >
                  <div className="text-4xl mb-3">👾</div>
                  <h3 className="text-[10px] font-black text-[#6B5E70] uppercase tracking-widest leading-tight">
                    {desc.criaturas.nombre}
                  </h3>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-[#6B5E70]/30 text-xs italic text-center py-10 uppercase font-black">
                Sin avistamientos
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}