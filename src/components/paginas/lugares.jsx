"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { GalleryGrid, GalleryItem } from "@/components/recursos/display/gallery";
import DetalleMaestro from "@/components/recursos/boxes/detalles";
import { ChevronDown } from 'lucide-react';

export default function LugaresHistoricos() {
  const [lugares, setLugares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  
  const [filtrosActivos, setFiltrosActivos] = useState({
    epoca: 'Todos',
    comuna: 'Todos',
    tipo: 'Todos',
    gestion: 'Todos',
    accesibilidad: 'Todos',
    estado: 'Todos'
  });

  useEffect(() => {
    const fetchLugares = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('lugares') 
        .select('*')
        .order('Nombre', { ascending: true });
      setLugares(data || []);
      setLoading(false);
    };
    fetchLugares();
  }, []);

  const configFiltros = useMemo(() => {
    const obtenerUnicos = (campo) => [
      'Todos', 
      ...new Set(lugares.map(l => l[campo]).filter(Boolean))
    ];

    return [
      { id: 'epoca', label: 'Época', opciones: obtenerUnicos('Epoca') },
      { id: 'comuna', label: 'Comuna', opciones: obtenerUnicos('Comuna') },
      { id: 'tipo', label: 'Tipo', opciones: obtenerUnicos('Tipo') },
      { id: 'gestion', label: 'Gestión', opciones: obtenerUnicos('Gestión') },
      { id: 'accesibilidad', label: 'Acceso', opciones: obtenerUnicos('Accesibilidad') },
      { id: 'estado', label: 'Disponibilidad', opciones: obtenerUnicos('Estado') },
    ];
  }, [lugares]);

  const filtrados = useMemo(() => {
    return lugares.filter(lugar => (
      (filtrosActivos.epoca === 'Todos' || lugar.Epoca === filtrosActivos.epoca) &&
      (filtrosActivos.comuna === 'Todos' || lugar.Comuna === filtrosActivos.comuna) &&
      (filtrosActivos.tipo === 'Todos' || lugar.Tipo === filtrosActivos.tipo) &&
      (filtrosActivos.gestion === 'Todos' || lugar.Gestión === filtrosActivos.gestion) &&
      (filtrosActivos.accesibilidad === 'Todos' || lugar.Accesibilidad === filtrosActivos.accesibilidad) &&
      (filtrosActivos.estado === 'Todos' || lugar.Estado === filtrosActivos.estado)
    ));
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

      <header className="pt-16 pb-10 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div>
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-[#6B5E70] uppercase leading-none">
              Lugares<br/>Históricos
            </h1>
          </div>
          
          {/* Contenedor de Dropdowns con el color morado anterior */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 lg:flex lg:flex-wrap lg:justify-end">
            {configFiltros.map((filtro) => {
              const isActive = filtrosActivos[filtro.id] !== 'Todos';
              return (
                <div key={filtro.id} className="relative group min-w-[140px]">
                  <select 
                    className={`
                      w-full appearance-none rounded-full px-5 py-3 text-[9px] font-black uppercase tracking-widest transition-all outline-none pr-10 cursor-pointer
                      ${isActive 
                        ? "bg-[#6B5E70] text-white border-[#6B5E70]" 
                        : "bg-[#6B5E70]/5 text-[#6B5E70]/40 border-[#6B5E70]/10 hover:bg-[#6B5E70]/10"
                      }
                      border
                    `}
                    value={filtrosActivos[filtro.id]}
                    onChange={(e) => setFiltrosActivos(prev => ({ ...prev, [filtro.id]: e.target.value }))}
                  >
                    <option value="Todos">{filtro.label}</option>
                    {filtro.opciones.filter(opt => opt !== 'Todos').map(opt => (
                      <option key={opt} value={opt} className="bg-white text-[#6B5E70] font-sans">
                        {opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown 
                    size={12} 
                    className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${isActive ? "text-white" : "text-[#6B5E70]/30"}`} 
                  />
                </div>
              );
            })}
          </div>
        </div>
      </header>

      {loading ? (
        <div className="py-40 text-center opacity-40 font-black uppercase text-xs tracking-widest animate-pulse text-[#6B5E70]">
          "Sincronizando Archivos..."
        </div>
      ) : (
        <GalleryGrid isDetailOpen={!!selected}>
          {filtrados.map(lugar => (
            <GalleryItem 
              key={lugar.id} 
              src={lugar.Imagen_url} 
              onClick={() => {
                setSelected(lugar);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className="flex flex-col h-full justify-end p-4 bg-gradient-to-t from-black/90 via-black/20 to-transparent">
                <div className="flex gap-2 mb-2">
                   <span className="text-[7px] font-black bg-[#6B5E70] px-2 py-0.5 text-white uppercase rounded-sm">
                     {lugar.Estado}
                   </span>
                </div>
                <h3 className="text-xl font-black text-white uppercase italic leading-none tracking-tighter">
                  {lugar.Nombre}
                </h3>
                <p className="text-[10px] text-white/50 font-bold uppercase mt-1 tracking-wider">
                  {lugar.Comuna} • {lugar.Tipo}
                </p>
              </div>
            </GalleryItem>
          ))}
          
          {filtrados.length === 0 && (
            <div className="col-span-full py-32 text-center text-[#6B5E70]/20 font-black uppercase text-xs tracking-[0.3em]">
              "No se encontraron registros"
            </div>
          )}
        </GalleryGrid>
      )}
    </main>
  );
}