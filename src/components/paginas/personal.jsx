"use client";

// Recibimos "datos" como prop desde el server component (page.js)
export default function Personal({ datos }) {
  
  // Si por alguna razón no hay datos, mostramos un estado vacío pero limpio
  if (!datos) {
    return (
      <div className="text-white/50 italic text-center py-20">
        No se encontraron registros de este aventurero...
      </div>
    );
  }

  // Lógica de juego: Sumamos la habilidad solo de los items que están EQUIPADOS
  const habilidadTotal = datos.inventario_usuario
    ?.filter(item => item.equipado)
    .reduce((acc, actual) => acc + (actual.items?.habilidad || 0), 0);

  return (
    <div className="w-full max-w-5xl space-y-12">
      
      {/* --- HEADER DEL PERSONAJE --- */}
      <section className="flex flex-col items-center border-b border-white/10 pb-10">
        <div className="relative">
          {/* Un círculo decorativo detrás del nombre para que parezca un avatar */}
          <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
          <h1 className="relative text-5xl font-extrabold text-white tracking-tighter">
            {datos.username.toUpperCase()}
          </h1>
        </div>
        <p className="text-blue-400 font-mono mt-2 tracking-widest uppercase text-sm">
          Status: Explorador de Leyendas
        </p>
        
        {/* Badge de Habilidad Total */}
        <div className="mt-6 px-6 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-3">
          <span className="text-gray-400 text-sm uppercase tracking-wider">Poder de Habilidad</span>
          <span className="text-2xl font-bold text-blue-400">{habilidadTotal}</span>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-12">
        
        {/* --- SECCIÓN: INVENTARIO (ARMAS/ITEMS) --- */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-tight">Equipamiento</h2>
            <div className="h-[1px] flex-1 bg-white/10"></div>
          </div>
          
          <div className="space-y-3">
            {datos.inventario_usuario?.map((slot, i) => (
              <div 
                key={i} 
                className={`flex justify-between items-center p-4 rounded-xl border transition-all ${
                  slot.equipado 
                    ? 'bg-blue-500/10 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                    : 'bg-white/5 border-white/5 opacity-60'
                }`}
              >
                <div>
                  <p className="text-white font-medium">{slot.items.nombre}</p>
                  <p className="text-xs text-gray-500 uppercase">{slot.items.tipo}</p>
                </div>
                <div className="text-right">
                  <span className="text-blue-400 font-bold">+{slot.items.habilidad}</span>
                  {slot.equipado && (
                    <p className="text-[10px] text-blue-300 font-bold uppercase mt-1">Equipado</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- SECCIÓN: BESTIARIO (CRIATURAS) --- */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-tight">Criaturas</h2>
            <div className="h-[1px] flex-1 bg-white/10"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {datos.descubrimientos?.map((desc, i) => (
              <div 
                key={i} 
                className="group relative bg-white/5 border border-white/5 p-6 rounded-2xl text-center hover:bg-white/10 hover:border-white/20 transition-all cursor-default"
              >
                <div className="text-4xl mb-3 grayscale group-hover:grayscale-0 transition-all duration-500">
                  👾
                </div>
                <h3 className="text-sm font-bold text-white/80 group-hover:text-white">
                  {desc.criaturas.nombre}
                </h3>
                <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-tighter">
                  Avistado
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}