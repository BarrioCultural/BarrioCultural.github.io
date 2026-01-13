"use client";

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useLightbox } from "@/components/recursos/boxes/lightbox"; 
import { GalleryGrid, GalleryItem } from "@/components/recursos/display/gallery";
import { supabase } from '@/lib/supabase';
import Newsletter from "@/components/recursos/boxes/newsletter";
import { Footprints } from 'lucide-react';

const Criaturas = () => {
  const { openLightbox } = useLightbox();
  
  const [criaturas, setCriaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos');

  useEffect(() => {
    const fetchCriaturas = async () => {
      try {
        setLoading(true);
        // Traemos los datos de tu tabla 'criaturas'
        const { data, error } = await supabase
          .from('criaturas')
          .select('id, imagen_url, nombre, tipo, descripcion') 
          .order('nombre', { ascending: true });

        if (error) throw error;
        setCriaturas(data || []);
      } catch (err) {
        console.error("Error cargando el bestiario:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCriaturas();
  }, []);

  // Filtramos por tipo (ej: Terrestre, Volador, Legendario)
  const criaturasFiltradas = useMemo(() => (
    filtro === 'todos' 
      ? criaturas 
      : criaturas.filter(c => c.tipo === filtro)
  ), [criaturas, filtro]);

  // Formato para el Lightbox
  const imagenesParaLightbox = useMemo(() => (
    criaturasFiltradas.map(c => ({
      src: c.imagen_url,
      alt: c.nombre,
      description: c.descripcion // Si tu lightbox soporta descripción
    }))
  ), [criaturasFiltradas]);

  const handleOpenLightbox = useCallback((index) => {
    openLightbox(index, imagenesParaLightbox);
  }, [openLightbox, imagenesParaLightbox]);

  // Categorías basadas en los tipos de criaturas que tengas
  const categorias = ['todos', 'terrestre', 'acuatico', 'volador', 'legendario'];

  return (
    <main className="min-h-screen bg-bg-main pt-20">
      <header className="mb-10 px-4 text-center">
        <div className="flex justify-center mb-4">
            <div className="p-3 bg-[#6B5E70]/5 rounded-full border border-[#6B5E70]/10 text-[#6B5E70]">
                <Footprints size={32} />
            </div>
        </div>
        <h1 className="text-4xl font-black italic tracking-tighter text-[#6B5E70] uppercase">Bestiario</h1>
        <p className="mt-2 text-[#6B5E70]/60 font-medium italic">Criaturas y entidades descubiertas</p>
      </header>

      {/* 🔘 Botones de Filtro por Tipo */}
      <div className="flex justify-center gap-2 mb-12 px-4 flex-wrap">
        {categorias.map(cat => (
          <button
            key={cat}
            onClick={() => setFiltro(cat)}
            className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${
              filtro === cat 
              ? 'bg-[#6B5E70] text-white border-[#6B5E70] shadow-lg scale-105' 
              : 'bg-white/40 text-[#6B5E70]/40 border-[#6B5E70]/10 hover:border-[#6B5E70]/30'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-60 gap-4">
          <div className="w-8 h-8 border-4 border-[#6B5E70]/20 border-t-[#6B5E70] rounded-full animate-spin"></div>
          <p className="text-[#6B5E70]/50 animate-pulse text-xs font-black uppercase tracking-widest">Rastreando huellas...</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6">
          <GalleryGrid>
            {criaturasFiltradas.length > 0 ? (
              criaturasFiltradas.map((criatura, index) => (
                <div key={criatura.id} className="group relative">
                    <GalleryItem 
                      src={criatura.imagen_url}
                      alt={criatura.nombre}
                      onClick={() => handleOpenLightbox(index)} 
                    />
                    {/* Overlay con el nombre de la criatura */}
                    <div className="absolute bottom-4 left-4 right-4 pointer-events-none transition-all duration-500 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                        <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-[#6B5E70]/10 shadow-xl">
                            <p className="text-[10px] font-black text-[#6B5E70] uppercase tracking-widest leading-none mb-1">
                                {criatura.tipo}
                            </p>
                            <h3 className="text-sm font-black text-[#6B5E70] uppercase italic tracking-tighter">
                                {criatura.nombre}
                            </h3>
                        </div>
                    </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-[#6B5E70]/40 font-black uppercase text-[10px] tracking-[0.3em]">
                  No se han avistado criaturas en esta región.
                </p>
              </div>
            )}
          </GalleryGrid>
        </div>
      )}

      <div className="mt-20">
        <Newsletter />
      </div>

      <div className="h-24"></div>
    </main>
  );
};

export default Criaturas;