"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { GalleryGrid } from "@/components/recursos/display/gallery";
import { ArtCard } from "@/components/recursos/boxes/ArtCard"; // <--- Ruta actualizada
import DetalleMaestro from "@/components/recursos/boxes/detalles";

export default function Criaturas() {
  const [criaturas, setCriaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filtros, setFiltros] = useState({ habitat: "todos", pensamiento: "todos", alma: "todos" });
  const [opcionesFiltros, setOpcionesFiltros] = useState({ habitat: ["todos"], pensamiento: ["todos"], alma: ["todos"] });

  // 1. Carga de opciones para los botones de filtro
  useEffect(() => {
    const fetchOpciones = async () => {
      const { data } = await supabase.from("criaturas").select("habitat, pensamiento, alma");
      if (data) {
        const extraerUnicos = (campo) => ["todos", ...new Set(data.map(item => item[campo]).filter(Boolean))].sort();
        setOpcionesFiltros({
          habitat: extraerUnicos("habitat"),
          pensamiento: extraerUnicos("pensamiento"),
          alma: extraerUnicos("alma")
        });
      }
    };
    fetchOpciones();
  }, []);

  // 2. Carga de criaturas filtradas
  useEffect(() => {
    const fetchCriaturas = async () => {
      setLoading(true);
      let query = supabase.from("criaturas").select("*").order("nombre", { ascending: true });
      if (filtros.habitat !== "todos") query = query.eq("habitat", filtros.habitat);
      if (filtros.pensamiento !== "todos") query = query.eq("pensamiento", filtros.pensamiento);
      if (filtros.alma !== "todos") query = query.eq("alma", filtros.alma);

      const { data } = await query;
      setCriaturas(data || []);
      setLoading(false);
    };
    fetchCriaturas();
  }, [filtros]);

  const MiMenuBestiario = (
    <div className="pt-16">
      <header className="mb-12 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-primary uppercase leading-none">
          "Bestiario"
        </h1>
        <div className="h-1.5 w-24 bg-primary mx-auto mt-4 rounded-full opacity-20" />
      </header>
      <div className="max-w-5xl mx-auto mb-16 px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {Object.entries(opcionesFiltros).map(([grupo, opciones]) => (
          <div key={grupo} className="flex flex-col items-center space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 italic">{grupo}</span>
            <div className="flex flex-wrap justify-center gap-2">
              {opciones.map(opt => (
                <button
                  key={opt}
                  onClick={() => setFiltros(prev => ({ ...prev, [grupo]: opt }))}
                  className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all border ${
                    filtros[grupo] === opt 
                      ? "bg-primary text-white border-primary shadow-lg scale-105" 
                      : "bg-white/5 text-primary/60 border-white/10 hover:border-primary/30"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-bg-main pb-20 font-sans overflow-x-hidden">
      <DetalleMaestro 
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        data={selected}
        tags={[selected?.habitat, selected?.alma ? `Alma ${selected.alma}` : null]}
        mostrarMusica={!!selected?.canciones}
        listaCanciones={selected?.canciones || []}
      />

      {loading ? (
        <div className="py-20 text-center text-primary/30 font-black uppercase text-[10px] tracking-widest animate-pulse">
          "Sincronizando Archivos..."
        </div>
      ) : (
        <GalleryGrid isDetailOpen={!!selected} headerContent={MiMenuBestiario}>
          {criaturas.map(c => (
            <ArtCard 
              key={c.id} 
              src={c.imagen_url} 
              title={c.nombre}
              subtitle={`${c.habitat} • ${c.alma}`}
              onClick={() => {
                setSelected(c);
                window.scrollTo({ top: 0, behavior: "instant" });
              }}
            />
          ))}
        </GalleryGrid>
      )}
    </main>
  );
}