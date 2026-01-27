"use client";
import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import DetalleMaestro from "@/components/recursos/boxes/detalles";
import { ChevronDown } from "lucide-react";

/* ─────────────────────────────
   GALERÍA (TODO AQUÍ MISMO)
───────────────────────────── */

function GalleryGrid({ children, isDetailOpen }) {
  return (
    <section
      className={`
        max-w-7xl mx-auto px-6
        grid gap-6
        grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        transition-opacity
        ${isDetailOpen ? "opacity-40 pointer-events-none" : ""}
      `}
    >
      {children}
    </section>
  );
}

function GalleryItem({ src, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        relative
        w-full
        aspect-[3/4]
        rounded-3xl
        overflow-hidden
        bg-black
        cursor-pointer
        group
      "
    >
      {/* Imagen */}
      <img
        src={src}
        alt=""
        className="
          absolute inset-0
          w-full h-full
          object-cover
          transition-transform duration-500
          group-hover:scale-105
        "
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

      {/* Contenido */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </button>
  );
}

/* ─────────────────────────────
   PÁGINA
───────────────────────────── */

export default function LugaresHistoricos() {
  const [lugares, setLugares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const [filtrosActivos, setFiltrosActivos] = useState({
    comuna: "Todos",
    tipo: "Todos",
    gestion: "Todos",
    accesibilidad: "Todos",
    estado: "Todos",
  });

  useEffect(() => {
    const fetchLugares = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("lugares")
        .select("*")
        .order("Nombre", { ascending: true });

      setLugares(data || []);
      setLoading(false);
    };

    fetchLugares();
  }, []);

  const configFiltros = useMemo(() => {
    const obtenerUnicos = (campo) => [
      "Todos",
      ...new Set(lugares.map((l) => l[campo]).filter(Boolean)),
    ];

    return [
      { id: "comuna", label: "Comuna", opciones: obtenerUnicos("Comuna") },
      { id: "tipo", label: "Tipo", opciones: obtenerUnicos("Tipo") },
      { id: "gestion", label: "Gestión", opciones: obtenerUnicos("Gestión") },
      { id: "accesibilidad", label: "Acceso", opciones: obtenerUnicos("Accesibilidad") },
      { id: "estado", label: "Disponibilidad", opciones: obtenerUnicos("Estado") },
    ];
  }, [lugares]);

  const filtrados = useMemo(() => {
    return lugares.filter(
      (lugar) =>
        (filtrosActivos.comuna === "Todos" || lugar.Comuna === filtrosActivos.comuna) &&
        (filtrosActivos.tipo === "Todos" || lugar.Tipo === filtrosActivos.tipo) &&
        (filtrosActivos.gestion === "Todos" || lugar.Gestión === filtrosActivos.gestion) &&
        (filtrosActivos.accesibilidad === "Todos" || lugar.Accesibilidad === filtrosActivos.accesibilidad) &&
        (filtrosActivos.estado === "Todos" || lugar.Estado === filtrosActivos.estado)
    );
  }, [lugares, filtrosActivos]);

  return (
    <main className="min-h-screen bg-bg-main pb-20 font-sans">
      <DetalleMaestro
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        data={selected}
        description={selected?.Descripción}
        tags={[selected?.Tipo, selected?.Gestión, selected?.Estado]}
        mostrarMusica={false}
      />

      {/* HEADER */}
      <header className="pt-16 pb-10 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-[#6B5E70] uppercase leading-none">
            Lugares
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 lg:flex lg:flex-wrap lg:justify-end">
            {configFiltros.map((filtro) => (
              <div key={filtro.id} className="relative min-w-[140px]">
                <select
                  className={`
                    w-full appearance-none rounded-full px-5 py-3
                    text-[9px] font-black uppercase tracking-widest
                    outline-none border cursor-pointer transition-all
                    ${
                      filtrosActivos[filtro.id] !== "Todos"
                        ? "bg-[#6B5E70] text-white border-[#6B5E70]"
                        : "bg-[#6B5E70]/5 text-[#6B5E70]/40 border-[#6B5E70]/10"
                    }
                  `}
                  value={filtrosActivos[filtro.id]}
                  onChange={(e) =>
                    setFiltrosActivos((prev) => ({
                      ...prev,
                      [filtro.id]: e.target.value,
                    }))
                  }
                >
                  <option value="Todos">{filtro.label}</option>
                  {filtro.opciones
                    .filter((opt) => opt !== "Todos")
                    .map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                </select>
                <ChevronDown
                  size={12}
                  className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-30"
                />
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* CONTENIDO */}
      {loading ? (
        <div className="py-40 text-center opacity-40 font-black uppercase text-xs tracking-widest animate-pulse text-[#6B5E70]">
          Sincronizando Archivos…
        </div>
      ) : (
        <GalleryGrid isDetailOpen={!!selected}>
          {filtrados.map((lugar) => (
            <GalleryItem
              key={lugar.id}
              src={lugar.Imagen_url}
              onClick={() => {
                setSelected(lugar);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <div className="flex flex-col h-full justify-end p-6">
                <div className="flex gap-2 mb-2">
                  <span className="text-[7px] font-black bg-[#6B5E70] px-2 py-0.5 text-white uppercase rounded-sm">
                    {lugar.Estado}
                  </span>
                </div>

                <h3 className="text-xl font-black text-white uppercase italic leading-none tracking-tighter">
                  {lugar.Nombre}
                </h3>

                <p className="text-[10px] text-white/70 font-bold uppercase mt-1 tracking-wider">
                  {lugar.Comuna} • {lugar.Tipo}
                </p>
              </div>
            </GalleryItem>
          ))}
        </GalleryGrid>
      )}
    </main>
  );
}
