"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { useLightbox } from "@/components/recursos/boxes/lightbox"; 
import { GalleryGrid, GalleryItem } from "@/components/recursos/display/gallery";
import { supabase } from '@/lib/supabase';
import FiltrosMaestros from "@/components/recursos/boxes/Filtros";

export default function RadarEventos() {
  const { openLightbox } = useLightbox();
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroComuna, setFiltroComuna] = useState('Todos');

  // Configuración de usuario
  const COMUNA_USUARIO = "Maipú"; 
  const comunasMenu = ['Todos', 'San Vicente', 'Rancagua', 'REQUEGUA YORK', 'San Fernando'];

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('eventos')
          .select('*')
          .order('fecha_inicio', { ascending: true });

        if (error) throw error;
        setEventos(data || []);
      } catch (err) {
        console.error("Error cargando eventos:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEventos();
  }, []);

  // Formateador de fecha ultra-seguro
  const renderFecha = (ev) => {
    if (!ev?.fecha_inicio) return "Fecha por definir";
    
    try {
      const opciones = { day: 'numeric', month: 'short', timeZone: 'UTC' };
      const fechaInicio = new Date(ev.fecha_inicio);
      const inicioStr = fechaInicio.toLocaleDateString('es-ES', opciones);
      
      if (ev.todo_el_dia) return `${inicioStr} • Todo el día`;
      
      if (ev.fecha_fin) {
        const finStr = new Date(ev.fecha_fin).toLocaleDateString('es-ES', opciones);
        return `${inicioStr} al ${finStr}`;
      }
      
      const hora = ev.hora_especifica ? ` • ${ev.hora_especifica.slice(0, 5)}` : '';
      return `${inicioStr}${hora}`;
    } catch (e) {
      return "Error en fecha";
    }
  };

  // Lógica de filtrado y orden por cercanía
  const filtradosYOrdenados = useMemo(() => {
    const lista = filtroComuna === 'todas' 
      ? eventos 
      : eventos.filter(e => e.comuna === filtroComuna);

    return [...lista].sort((a, b) => {
      if (a.comuna === COMUNA_USUARIO && b.comuna !== COMUNA_USUARIO) return -1;
      if (a.comuna !== COMUNA_USUARIO && b.comuna === COMUNA_USUARIO) return 1;
      return 0;
    });
  }, [eventos, filtroComuna]);

  const lbData = useMemo(() => filtradosYOrdenados.map(e => ({ 
    src: e.imagen_url || 'https://via.placeholder.com/800', 
    alt: e.titulo || 'Evento'
  })), [filtradosYOrdenados]);

  const Cabecera = (
    <header className="mb-16 text-center pt-10">
      <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-primary uppercase leading-none">
        "Eventos"
      </h1>
      <p className="text-[10px] font-bold text-primary/50 uppercase tracking-[0.3em] mt-2">
        "frase aestehic o bonita"
      </p>
      <div className="h-1.5 w-24 bg-primary mx-auto mt-6 rounded-full opacity-20 mb-12" />
      
      <FiltrosMaestros 
        config={{ categorías: comunasMenu }}
        filtrosActivos={{ categorías: filtroComuna }}
        onChange={(grupo, valor) => setFiltroComuna(valor)}
      />
    </header>
  );

  return (
    <main className="min-h-screen bg-bg-main py-10 px-4 md:px-8">
      {loading ? (
        <div className="py-40 text-center text-primary/30 font-black uppercase text-[10px] tracking-widest animate-pulse">
          "Revizando..."
        </div>
      ) : (
        <GalleryGrid headerContent={Cabecera}>
          {filtradosYOrdenados.map((e, i) => (
            <GalleryItem 
              key={e.id} 
              src={e.imagen_url || 'https://via.placeholder.com/400'} 
              onClick={() => openLightbox(i, lbData)}
            >
              <div className="flex justify-between items-start w-full">
                <p className="text-[8px] font-black text-white/50 uppercase tracking-widest mb-1">
                  {e.comuna || 'Zona General'}
                </p>
                {e.comuna === COMUNA_USUARIO && (
                  <span className="bg-primary text-bg-main text-[7px] px-2 py-0.5 font-bold rounded-full">
                    CERCA
                  </span>
                )}
              </div>
              <h3 className="text-lg font-black text-white uppercase italic tracking-tighter leading-none mt-1">
                {e.titulo || 'Sin Título'}
              </h3>
              <p className="text-[10px] font-bold text-primary uppercase mt-2">
                {renderFecha(e)}
              </p>
            </GalleryItem>
          ))}
          
          {filtradosYOrdenados.length === 0 && (
            <div className="col-span-full py-20 text-center text-primary/30 font-bold uppercase text-[10px] tracking-widest">
              "No hay eventos programados aquí"
            </div>
          )}
        </GalleryGrid>
      )}
    </main>
  );
}