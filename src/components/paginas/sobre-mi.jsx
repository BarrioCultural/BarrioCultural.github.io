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
        
        {/* CABECERA */}
        <header className="mb-10 md:mb-20 text-center px-6">
          <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter text-[#6B5E70] uppercase leading-none drop-shadow-[0_2px_10px_rgba(107,94,112,0.1)]">
            Sobre Mi
          </h1>
          <div className="h-1.5 w-16 md:w-24 bg-gradient-to-r from-transparent via-[#D4C9DE] to-transparent mx-auto mt-6 rounded-full" />
        </header>

        <div className="max-w-4xl mx-auto px-4 md:px-6 space-y-12 md:space-y-20">
          
          {/* SECCIÓN 1: Mi Atelier - Morado Cálido */}
          <section className="space-y-6">
            <div className="bg-[#E2D9E8] rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-white/60">
              <h3 className="text-xs md:text-sm font-black text-[#6B5E70] uppercase tracking-[0.3em] flex items-center gap-2 mb-6">
                <Heart size={16} fill="#6B5E70" className="text-[#6B5E70]" /> Mi Atelier
              </h3>
              <p className="text-[#6B5E70] leading-relaxed text-lg md:text-2xl font-medium italic">
                Bienvenido a mi pequeño jardín digital.<br />
                Me encanta compartir mi arte y conectar con personas que disfrutan de este.
              </p>
            </div>
          </section>

          {/* SECCIÓN 2: Herramientas - Morado Diferente (Más Lavanda/Azulado) */}
          <section className="space-y-6">
            <div className="bg-[#D9E0EE] rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-white/60">
              <h3 className="text-xs md:text-sm font-black text-[#6B5E70] uppercase tracking-[0.3em] flex items-center gap-2 mb-8">
                <Palette size={16} className="text-[#6B5E70]" /> Herramientas
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { text: "Linux y Krita" },
                  { text: "Acuarelas y Acrílico" },
                  { text: "Mucha música" },
                ].map((item, idx) => (
                  <li key={idx} className="flex flex-col items-center justify-center gap-2 bg-white/40 border border-white/60 p-6 rounded-2xl text-[#6B5E70] font-bold uppercase italic tracking-tighter text-xs text-center transition-transform hover:scale-105">
                    <Sparkles size={16} className="text-[#6B5E70]/50" />
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* SECCIÓN 3: Garden of Sins - Diseño más Estético */}
          <section className="py-10 px-4 md:px-0 text-center md:text-left">
            <div className="relative inline-block mb-10">
              <h2 className="text-3xl md:text-5xl font-black uppercase italic text-[#6B5E70] tracking-tighter relative z-10">
                Garden of Sins
              </h2>
              <div className="absolute -bottom-2 left-0 w-full h-4 bg-[#E2D9E8] -z-10 rotate-[-1deg]" />
            </div>
            
            <div className="space-y-8 max-w-3xl">
              <div className="border-l-4 border-[#D4C9DE] pl-6 py-2">
                <p className="text-[#6B5E70]/80 text-lg md:text-xl italic leading-relaxed font-medium">
                  Más que un portafolio, es un espacio en constante crecimiento como un jardín real. Es mi proyecto de vida.
                </p>
              </div>
              
              <p className="text-[#6B5E70]/70 text-base md:text-lg italic leading-relaxed">
                Un reflejo de temas que considero importantes con personajes que se basan en personas que han dejado una marca en mí. Es un proyecto sin límites que irá creciendo a mi lado.
              </p>

              <div className="pt-4">
                <span className="inline-block bg-[#6B5E70] text-[#E2D9E8] px-6 py-3 rounded-full text-xs md:text-sm font-black uppercase tracking-widest italic shadow-lg shadow-[#6B5E70]/20">
                  Cada flor es una emoción que necesito soltar.
                </span>
              </div>
            </div>
          </section>

          {/* CONTACTO */}
          <section className="pt-6 md:pt-10">
            <div className="bg-gradient-to-br from-[#F4F1F6] to-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-16 border-[4px] border-white shadow-xl shadow-[#6B5E70]/5">
              {enviado ? (
                <div className="text-center py-10">
                  <p className="text-[#6B5E70] font-black text-xl md:text-2xl uppercase italic tracking-tighter mb-2">¡Mensaje enviado!</p>
                  <p className="text-[#6B5E70]/60 font-medium italic mb-8">Gracias por escribirme. ♡</p>
                  <button onClick={() => setEnviado(false)} className="px-8 py-3 rounded-full bg-[#E2D9E8] text-[#6B5E70] font-black uppercase text-[10px] tracking-widest">Enviar otro</button>
                </div>
              ) : (
                <>
                  <div className="mb-10 text-center md:text-left">
                    <h2 className="text-xl md:text-2xl font-black text-[#6B5E70] uppercase italic tracking-tighter flex items-center justify-center md:justify-start gap-3">
                      <Send size={20} className="text-[#B39BBD]" /> Envíame un mensajito
                    </h2>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" name="name" required placeholder="TU NOMBRE" className="w-full bg-white/80 border-2 border-transparent focus:border-[#D4C9DE] rounded-2xl px-6 py-4 text-[#6B5E70] placeholder:text-[#6B5E70]/30 font-bold outline-none transition-all" />
                      <input type="email" name="_replyto" required placeholder="TU@CORREO" className="w-full bg-white/80 border-2 border-transparent focus:border-[#D4C9DE] rounded-2xl px-6 py-4 text-[#6B5E70] placeholder:text-[#6B5E70]/30 font-bold outline-none transition-all" />
                    </div>
                    <textarea name="message" required placeholder="TU MENSAJE..." className="w-full bg-white/80 border-2 border-transparent focus:border-[#D4C9DE] rounded-[2rem] px-6 py-5 text-[#6B5E70] placeholder:text-[#6B5E70]/30 font-bold outline-none min-h-[150px] resize-none transition-all"></textarea>
                    <button type="submit" disabled={loading} className="w-full md:w-auto px-12 bg-[#6B5E70] text-white font-black uppercase italic tracking-widest py-5 rounded-2xl hover:brightness-110 transition-all text-xs">
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