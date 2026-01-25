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
        const unicos = [];
        const nombresVistos = new Set();

        data.forEach(rel => {
          // Determinamos quién es la otra persona
          const esPersonaje1 = rel.personaje_1 === nombrePersonaje;
          const vinculadoCon = esPersonaje1 ? rel.personaje_2 : rel.personaje_1;

          /* LÓGICA NUEVA:
             Si tenemos dos filas, priorizamos la fila donde el personaje abierto 
             es el 'personaje_1', porque así el 'tipo_vinculo' describe al otro.
          */
          if (!nombresVistos.has(vinculadoCon) || esPersonaje1) {
            // Si ya lo vimos pero esta fila es la "correcta" (esPersonaje1), reemplazamos
            const index = unicos.findIndex(item => item.nombre === vinculadoCon);
            
            const nuevoDato = {
              id: rel.id,
              nombre: vinculadoCon,
              vinculo: rel.tipo_vinculo
            };

            if (index === -1) {
              unicos.push(nuevoDato);
              nombresVistos.add(vinculadoCon);
            } else if (esPersonaje1) {
              // Si ya existía pero esta fila es la que define al personaje 2, la actualizamos
              unicos[index] = nuevoDato;
            }
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