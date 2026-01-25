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
        // Buscamos donde el personaje abierto sea el "personaje_1"
        // para que el "tipo_vinculo" sea el que le corresponde al otro.
        .eq('personaje_1', nombrePersonaje);

      if (!error && data) {
        const formateados = data.map(rel => ({
          id: rel.id,
          nombre: rel.personaje_2,
          vinculo: rel.tipo_vinculo
        }));
        
        setLista(formateados);
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