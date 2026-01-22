"use client";
import React, { useState } from 'react';
import { Palette, Heart, Sparkles, Send } from 'lucide-react';

export default function SobreMi() {
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);
  const FORMSPREE_ID = "xvzpjdgr"; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const data = new FormData(form);

    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        setEnviado(true);
        form.reset();
      } else {
        alert("Hubo un error al enviar el mensaje.");
      }
    } catch (error) {
      alert("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#F0F0F0] min-h-screen">
      <main className="w-full bg-[#F0F0F0] pb-20 pt-20 md:pt-32 font-sans overflow-x-hidden">
        
        {/* CABECERA - ESTILO BOLD */}
        <header className="mb-16 md:mb-24 text-center px-6">
          <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter text-[#6B5E70] uppercase leading-none">
            Sobre Mi
          </h1>
          <div className="h-2 w-20 bg-[#6B5E70] mx-auto mt-6 rounded-full" />
        </header>

        <div className="max-w-4xl mx-auto px-4 md:px-6 space-y-24 md:space-y-32">
          
          {/* SECCIÓN 1: MI ATELIER - MORADO PASTEL SÓLIDO */}
          <section className="relative">
            <div className="bg-[#E2D9E8] rounded-[2.5rem] p-8 md:p-14 border-2 border-[#6B5E70]/10 relative z-10">
              <h3 className="text-xs font-black text-[#6B5E70] uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                <Heart size={16} fill="#6B5E70" /> MI ATELIER
              </h3>
              <p className="text-[#6B5E70] text-2xl md:text-4xl font-black italic leading-[1.1] tracking-tighter uppercase">
                Bienvenido a mi pequeño jardín digital. compartir mi arte es mi forma de conectar con el mundo.
              </p>
            </div>
            {/* Elemento decorativo detrás */}
            <div className="absolute top-4 left-4 w-full h-full bg-[#6B5E70]/5 rounded-[2.5rem] -z-0" />
          </section>

          {/* SECCIÓN 2: HERRAMIENTAS - MORADO LAVANDA SÓLIDO */}
          <section className="bg-[#D1C4DB] rounded-[2.5rem] p-8 md:p-14 border-2 border-[#6B5E70]/10">
            <h3 className="text-xs font-black text-[#6B5E70] uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
              <Palette size={16} fill="#6B5E70" /> MIS HERRAMIENTAS
            </h3>
            <div className="flex flex-wrap gap-4">
              {["Linux y Krita", "Acuarelas y Acrílico", "Mucha música"].map((item, i) => (
                <div key={i} className="bg-[#6B5E70] text-[#E2D9E8] px-8 py-4 rounded-2xl text-sm md:text-base font-black uppercase italic tracking-widest flex items-center gap-3">
                  <Sparkles size={14} />
                  {item}
                </div>
              ))}
            </div>
          </section>

          {/* SECCIÓN 3: GARDEN OF SINS - ESTILO POSTER EDITORIAL */}
          <section className="relative py-10 flex flex-col md:flex-row gap-12 items-center md:items-start">
            <div className="bg-[#6B5E70] text-[#E2D9E8] p-10 md:p-16 rounded-[3rem] rotate-[-3deg] shadow-2xl flex-shrink-0">
              <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none text-center">
                Garden<br/>of Sins
              </h2>
            </div>
            
            <div className="flex-1 space-y-8 text-center md:text-left">
              <div className="space-y-4">
                <p className="text-[#6B5E70] text-xl md:text-2xl font-black uppercase italic leading-tight">
                  Más que un portafolio, es mi proyecto de vida en constante crecimiento.
                </p>
                <div className="h-1 w-full bg-[#6B5E70]" />
              </div>
              
              <p className="text-[#6B5E70]/70 text-lg md:text-xl font-bold italic leading-relaxed">
                Personajes basados en marcas que la vida ha dejado en mí. Un reflejo de temas importantes que evolucionan conmigo.
              </p>

              <div className="pt-4">
                <span className="inline-block border-4 border-[#6B5E70] text-[#6B5E70] px-8 py-4 rounded-full font-black text-sm md:text-base uppercase tracking-widest italic">
                  CADA FLOR ES UNA EMOCIÓN LIBERADA
                </span>
              </div>
            </div>
          </section>

          {/* SECCIÓN 4: CONTACTO - SÓLIDO Y LIMPIO */}
          <section className="pt-10">
            <div className="bg-white rounded-[3rem] p-8 md:p-16 border-[6px] border-[#E2D9E8] shadow-2xl shadow-[#6B5E70]/10">
              {enviado ? (
                <div className="text-center py-12">
                  <Heart size={48} className="mx-auto text-[#6B5E70] mb-6" fill="#6B5E70" />
                  <p className="text-[#6B5E70] font-black text-2xl md:text-3xl uppercase italic tracking-tighter mb-4">¡MENSAJE ENVIADO!</p>
                  <p className="text-[#6B5E70]/60 font-bold italic mb-10 uppercase tracking-widest">GRACIAS POR ESCRIBIRME. ♡</p>
                  <button onClick={() => setEnviado(false)} className="px-10 py-4 bg-[#6B5E70] text-white rounded-2xl font-black uppercase italic tracking-widest text-xs">ENVIAR OTRO</button>
                </div>
              ) : (
                <>
                  <div className="mb-12 text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-black text-[#6B5E70] uppercase italic tracking-tighter flex items-center justify-center md:justify-start gap-4">
                      <Send size={32} /> ESCRÍBEME
                    </h2>
                    <p className="text-[#6B5E70]/40 font-black uppercase tracking-[0.3em] mt-4 text-xs">DISEÑO, DUDAS O SOLO SALUDAR</p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-[#6B5E70] uppercase tracking-widest ml-4">NOMBRE</label>
                        <input type="text" name="name" required placeholder="TU NOMBRE" className="w-full bg-[#F0F0F0] border-4 border-transparent focus:border-[#6B5E70] rounded-2xl px-8 py-5 text-[#6B5E70] font-black outline-none transition-all placeholder:text-[#6B5E70]/20" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-[#6B5E70] uppercase tracking-widest ml-4">EMAIL</label>
                        <input type="email" name="_replyto" required placeholder="TU@CORREO.COM" className="w-full bg-[#F0F0F0] border-4 border-transparent focus:border-[#6B5E70] rounded-2xl px-8 py-5 text-[#6B5E70] font-black outline-none transition-all placeholder:text-[#6B5E70]/20" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-[#6B5E70] uppercase tracking-widest ml-4">TU MENSAJE</label>
                      <textarea name="message" required placeholder="ESCRIBE AQUÍ..." className="w-full bg-[#F0F0F0] border-4 border-transparent focus:border-[#6B5E70] rounded-[2.5rem] px-8 py-6 text-[#6B5E70] font-black outline-none min-h-[200px] resize-none transition-all placeholder:text-[#6B5E70]/20"></textarea>
                    </div>
                    <button type="submit" disabled={loading} className="w-full md:w-auto px-16 bg-[#6B5E70] text-white font-black uppercase italic tracking-[0.2em] py-6 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#6B5E70]/30">
                      {loading ? 'ENVIANDO...' : 'ENVIAR MENSAJE'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}