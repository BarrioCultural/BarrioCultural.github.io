"use client";
import React from 'react';
import { Sword, Sparkles, Footprints, ShieldCheck } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function Personal({ datos }) {
  
  if (!datos) {
    return (
      <div className="text-[#6B5E70]/50 italic text-center py-20 font-bold uppercase tracking-widest text-xs">
        No se encontraron registros de este aventurero...
      </div>
    );
  }

  // Lógica de juego: Sumamos la habilidad de los items EQUIPADOS
  const habilidadTotal = datos.inventario_usuario
    ?.filter(item => item.equipado)
    .reduce((acc, actual) => acc + (actual.items?.habilidad || 0), 0);

  return (
    <div className="flex flex-col gap-10 w-full max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-1000 px-4">
      
      {/* --- HEADER DEL PERSONAJE (Estilo Sobre Mí) --- */}
      <section className="bg-[#E2D8E6]/40 border border-[#6B5E70]/10 rounded-[2.5rem] p-10 md:p-14 backdrop-blur-md shadow-sm flex flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="w-28 h-28 rounded-full bg-white/50 border border-[#6B5E70]/10 flex items-center justify-center shadow-inner">
            <Sparkles size={45} className="text-[#6B5E70]/40" />
          </div>
          {/* Badge de Nivel o Poder */}
          <div className="absolute -bottom-2 -right-2 bg-[#6B5E70] text-[#E2D8E6] text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
            LVL 01
          </div>
        </div>

        <h1 className="text-4xl font-black italic tracking-tighter text-[#6B5E70] uppercase">
          {datos.username}
        </h1>
        <p className="text-[#6B5E70]/50 text-[10px] uppercase font-black tracking-[0.3em] mt-2">
          Status: Explorador de Leyendas
        </p>
        
        {/* Badge de Habilidad Total (Estilo Botón de Enviar) */}
        <div className="mt-8 px-8 py-4 bg-white/40 border border-[#6B5E70]/10 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="flex flex-col items-start">
            <span className="text-[#6B5E70]/40 text-[9px] font-black uppercase tracking-widest">Poder de Habilidad</span>
            <span className="text-3xl font-black text-[#6B5E70] leading-none">{habilidadTotal}</span>
          </div>
          <Sword className="text-[#6B5E70]/20" size={32} />
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* --- SECCIÓN: EQUIPAMIENTO (Estilo Formulario) --- */}
        <section className="bg-white/20 border border-[#6B5E70]/10 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-sm shadow-xl shadow-[#6B5E70]/5">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-sm font-black text-[#6B5E70] uppercase tracking-[0.2em] flex items-center gap-2">
              <ShieldCheck size={18} /> Equipamiento
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
                    : 'bg-[#E2D8E6]/10 border-[#6B5E70]/5 opacity-50 grayscale'
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
                <div className="text-right">
                  <span className="text-lg font-black text-[#6B5E70]">+{slot.items.habilidad}</span>
                  {slot.equipado && (
                    <div className="flex items-center gap-1 justify-end mt-1">
                       <div className="w-1.5 h-1.5 bg-[#6B5E70] rounded-full animate-pulse" />
                       <span className="text-[8px] text-[#6B5E70] font-black uppercase tracking-tighter">Activo</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- SECCIÓN: BESTIARIO (Estilo Herramientas) --- */}
        <section className="bg-[#E2D8E6]/40 border border-[#6B5E70]/10 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-md shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-sm font-black text-[#6B5E70] uppercase tracking-[0.2em] flex items-center gap-2">
              <Footprints size={18} /> Avistamientos
            </h2>
            <div className="h-[1px] flex-1 bg-[#6B5E70]/10"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {datos.descubrimientos?.map((desc, i) => (
              <div 
                key={i} 
                className="group bg-white/30 border border-[#6B5E70]/5 p-6 rounded-[2rem] text-center hover:bg-white/60 hover:border-[#6B5E70]/20 transition-all duration-500 cursor-help shadow-sm"
              >
                <div className="text-4xl mb-3 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500 drop-shadow-sm">
                  👾
                </div>
                <h3 className="text-[10px] font-black text-[#6B5E70] uppercase tracking-widest">
                  {desc.criaturas.nombre}
                </h3>
                <div className="h-[1px] w-4 bg-[#6B5E70]/20 mx-auto mt-2 group-hover:w-8 transition-all" />
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}