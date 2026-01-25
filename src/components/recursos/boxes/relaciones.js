"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Users } from 'lucide-react';

export default function Relaciones({ nombrePersonaje }) {
  const [lista, setLista] = useState([]);

  useEffect(() => {
    async function cargarRelaciones() {
      if (!nombrePersonaje) return;
      
      const { data, error } = await supabase
        .from('relaciones')
        .select('*')
        .or(`personaje_1.eq."${nombrePersonaje}",personaje_2.eq."${nombrePersonaje}"`);

      if (!error && data) {
        // --- FILTRO MÁGICO PARA DUPLICADOS ---
        const unicos = [];
        const nombresVistos = new Set();

        data.forEach(rel => {
          const vinculadoCon = rel.personaje_1 === nombrePersonaje ? rel.personaje_2 : rel.personaje_1;
          
          // Solo lo añadimos si no hemos procesado a este personaje todavía
          if (!nombresVistos.has(vinculadoCon)) {
            nombresVistos.add(vinculadoCon);
            unicos.push({
              id: rel.id,
              nombre: vinculadoCon,
              vinculo: rel.tipo_vinculo
            });
          }
        });
        
        setLista(unicos);
      }
    }
    cargarRelaciones();
  }, [nombrePersonaje]);

  if (lista.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 text-primary/30 mb-3">
        <Users size={14} />
        <span className="text-[10px] font-black uppercase tracking-widest">Vínculos conocidos</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {lista.map((rel) => (
          <div 
            key={rel.id} 
            className="bg-white border-2 border-primary/5 px-4 py-2 rounded-2xl flex flex-col shadow-sm"
          >
            <span className="text-xs font-black uppercase italic text-primary tracking-tighter">
              {rel.nombre}
            </span>
            <span className="text-[9px] font-bold uppercase text-primary/40 tracking-wider">
              {rel.vinculo}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}