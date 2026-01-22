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
    <div className="w-full bg-[#F0F0F0] min-h-screen text-[#6B5E70]">
      <main className="w-full bg-[#F0F0F0] pb-20 pt-20 md:pt-32 font-sans overflow-x-hidden">
        
        {/* CABECERA */}
        <header className="max-w-4xl mx-auto mb-16 md:mb-24 text-center px-6">
          <h1 className="text-4xl md:text-6xl font-light italic tracking-widest uppercase">
            Sobre Mi
          </h1>
          <div className="h-px w-16 bg-[#6B5E70] mx-auto mt-6 opacity-40" />
        </header>

        <div className="max-w-4xl mx-auto px-4 md:px-6 space-y-16 md:space-y-24">
          
          {/* SECCIÓN 1: MI ATELIER - MORADO PASTEL */}
          <section className="w-full">
            <div className="bg-[#E2D9E8] rounded-[2.5rem] p-8 md:p-14 shadow-sm border border-white/50">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-2 mb-8 opacity-70">
                <Heart size={16} /> Mi Atelier
              </h3>
              <p className="text-lg md:text-2xl leading-relaxed font-medium">
                Bienvenido a mi pequeño jardín digital. Me encanta compartir mi arte y conectar con personas que disfrutan de este proceso creativo.
              </p>
            </div>
          </section>

          {/* SECCIÓN 2: HERRAMIENTAS - MORADO LAVANDA */}
          <section className="w-full">
            <div className="bg-[#D1C4DB] rounded-[2.5rem] p-8 md:p-14 shadow-sm border border-white/50">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-2 mb-8 opacity-70">
                <Palette size={16} /> Herramientas
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <li className="flex flex-col gap-2 bg-white/30 p-6 rounded-2xl border border-white/40">
                  <Sparkles size={16} className="opacity-50" />
                  <span className="font-bold text-sm uppercase tracking-tight">Linux y Krita</span>
                </li>
                <li className="flex flex-col gap-2 bg-white/30 p-6 rounded-2xl border border-white/40">
                  <Sparkles size={16} className="opacity-50" />
                  <span className="font-bold text-sm uppercase tracking-tight">Acuarelas y Acrílico</span>
                </li>
                <li className="flex flex-col gap-2 bg-white/30 p-6 rounded-2xl border border-white/40">
                  <Sparkles size={16} className="opacity-50" />
                  <span className="font-bold text-sm uppercase tracking-tight">Mucha música</span>
                </li>
              </ul>
            </div>
          </section>

          {/* SECCIÓN 3: GARDEN OF SINS - TEXTO NORMAL Y LIMPIO */}
          <section className="px-4 md:px-2 space-y-8">
            <div className="flex items-center gap-6 mb-10">
              <h2 className="text-3xl md:text-5xl font-light uppercase italic tracking-tighter shrink-0">
                Garden of Sins
              </h2>
              <div className="h-px w-full bg-[#6B5E70] opacity-20" />
            </div>
            
            <div className="max-w-3xl space-y-6 text-base md:text-xl leading-relaxed font-medium opacity-90">
              <p>
                Más que un portafolio, es un espacio en constante crecimiento, como un jardín real. Es mi proyecto de vida.
              </p>
              <p>
                Refleja temas que considero importantes a través de personajes basados en personas que han dejado una marca en mí. Es un proyecto sin límites que irá creciendo a mi lado mientras voy creciendo como persona y artista.
              </p>
              <p className="p-6 bg-[#E2D9E8]/50 rounded-2xl border-l-4 border-[#6B5E70] italic font-bold">
                Cada flor de este jardín está basada en una experiencia o una emoción que necesito quitarme de encima.
              </p>
            </div>
          </section>

          {/* SECCIÓN 4: CONTACTO - DISEÑO SÓLIDO */}
          <section className="pt-10">
            <div className="bg-white rounded-[3rem] p-8 md:p-16 border-[6px] border-[#E2D9E8] shadow-sm">
              {enviado ? (
                <div className="text-center py-12">
                  <Heart size={40} className="mx-auto text-[#6B5E70] mb-6 opacity-30" />
                  <p className="text-[#6B5E70] font-bold text-xl md:text-2xl uppercase tracking-widest mb-4 text-center">¡Mensaje enviado!</p>
                  <p className="text-[#6B5E70]/60 font-medium italic mb-10 text-center">Gracias por escribirme. ♡</p>
                  <button onClick={() => setEnviado(false)} className="px-8 py-3 bg-[#6B5E70] text-white rounded-xl font-bold uppercase text-[10px] tracking-widest transition-opacity hover:opacity-90">Enviar otro</button>
                </div>
              ) : (
                <>
                  <div className="mb-12 text-center md:text-left">
                    <h2 className="text-2xl md:text-3xl font-light text-[#6B5E70] uppercase tracking-widest flex items-center justify-center md:justify-start gap-4">
                      <Send size={24} className="opacity-40" /> Contacto
                    </h2>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold opacity-40 uppercase tracking-[0.2em] ml-2">Nombre</label>
                        <input type="text" name="name" required placeholder="Tu nombre..." className="w-full bg-[#F0F0F0] rounded-2xl px-6 py-4 text-[#6B5E70] font-medium outline-none focus:ring-2 focus:ring-[#E2D9E8] transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold opacity-40 uppercase tracking-[0.2em] ml-2">Email</label>
                        <input type="email" name="_replyto" required placeholder="tu@correo.com" className="w-full bg-[#F0F0F0] rounded-2xl px-6 py-4 text-[#6B5E70] font-medium outline-none focus:ring-2 focus:ring-[#E2D9E8] transition-all" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold opacity-40 uppercase tracking-[0.2em] ml-2">Mensaje</label>
                      <textarea name="message" required placeholder="Escribe aquí lo que quieras..." className="w-full bg-[#F0F0F0] rounded-[2rem] px-6 py-5 text-[#6B5E70] font-medium outline-none focus:ring-2 focus:ring-[#E2D9E8] min-h-[180px] resize-none transition-all"></textarea>
                    </div>
                    <button type="submit" disabled={loading} className="w-full md:w-auto px-12 bg-[#6B5E70] text-white font-bold uppercase italic tracking-widest py-5 rounded-2xl hover:opacity-90 active:scale-95 transition-all text-xs">
                      {loading ? 'Enviando...' : 'Enviar Mensaje'}
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