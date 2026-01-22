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

        <div className="max-w-4xl mx-auto px-4 md:px-6 space-y-12 md:space-y-24">
          
          {/* SECCIÓN 1: Mi Atelier - Más Moradito */}
          <section className="space-y-6">
            <div className="bg-[#E2D9E8] rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 shadow-sm border border-white/60 relative overflow-hidden group">
              <div className="absolute -top-4 -right-4 opacity-10 text-[#6B5E70] group-hover:rotate-12 transition-transform duration-700">
                <Heart size={140} fill="currentColor" />
              </div>
              <h3 className="text-sm md:text-lg font-black text-[#6B5E70] uppercase tracking-widest flex items-center gap-2 mb-4 relative z-10">
                <Heart size={18} fill="#6B5E70" className="text-[#6B5E70]" /> Mi Atelier
              </h3>
              <p className="text-[#6B5E70]/90 leading-relaxed text-base md:text-xl font-medium italic relative z-10">
                Bienvenido a mi pequeño jardín digital.<br />
                Me encanta compartir mi arte y conectar con personas que disfrutan de este.
              </p>
            </div>
          </section>

          {/* SECCIÓN 2: Herramientas - Ajuste Móvil */}
          <section className="space-y-6">
            <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 shadow-sm border-2 border-[#E2D9E8]">
              <h3 className="text-sm md:text-lg font-black text-[#6B5E70] uppercase tracking-widest flex items-center gap-2 mb-6">
                <Palette size={18} className="text-[#6B5E70]" /> Herramientas
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {[
                  { text: "Linux y Krita" },
                  { text: "Acuarelas y Acrílico" },
                  { text: "Mucha música" },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 bg-[#F4F1F6] border border-[#E2D9E8] p-4 rounded-xl md:rounded-2xl text-[#6B5E70] font-bold uppercase italic tracking-tighter text-xs md:text-sm">
                    <Sparkles size={14} className="text-[#B39BBD]" />
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* SECCIÓN 3: Garden of Sins */}
          <section className="space-y-6 md:space-y-8 px-2 md:px-0 relative">
            <div className="flex items-center space-x-4 mb-4">
              <h2 className="text-2xl md:text-4xl font-black uppercase italic text-[#6B5E70] tracking-tighter">
                ¿Qué es "Garden of Sins"?
              </h2>
              <div className="hidden md:block h-[2px] flex-1 bg-gradient-to-r from-[#D4C9DE] to-transparent" />
            </div>
            
            <div className="grid gap-5 md:gap-6 text-[#6B5E70]/80 text-base md:text-lg italic leading-relaxed font-medium">
              <p>Más que un portafolio, es un espacio en constante crecimiento (como un jardín real), es mi proyecto de vida.</p>
              <p>Un reflejo de temas que considero importantes con personajes que se basan en personas que han dejado una marca en mí. Es un proyecto sin límites que irá creciendo a mi lado.</p>
              <p className="text-[#6B5E70] font-black underline decoration-[#D4C9DE] decoration-4 underline-offset-4 md:underline-offset-8 bg-[#E2D9E8]/40 px-3 py-2 rounded-xl inline-block">
                Cada flor de este jardín está basada en una experiencia o una emoción que necesito quitarme de encima.
              </p>
            </div>
          </section>

          {/* CONTACTO: Ajustado para que no se comprima */}
          <section className="pt-6 md:pt-10">
            <div className="bg-gradient-to-br from-white to-[#F9F7FA] rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-16 border-[3px] md:border-[6px] border-white shadow-xl shadow-[#6B5E70]/5">
              {enviado ? (
                <div className="text-center py-10">
                  <p className="text-[#6B5E70] font-black text-xl md:text-2xl uppercase italic tracking-tighter mb-2">¡Mensaje enviado!</p>
                  <p className="text-[#6B5E70]/60 font-medium italic mb-8 text-sm md:text-base">Gracias por escribirme, te responderé pronto. ♡</p>
                  <button onClick={() => setEnviado(false)} className="px-8 py-3 rounded-full bg-[#E2D9E8] text-[#6B5E70] font-black uppercase text-[10px] tracking-widest">Enviar otro</button>
                </div>
              ) : (
                <>
                  <div className="mb-8 md:mb-12 text-center md:text-left">
                    <h2 className="text-xl md:text-2xl font-black text-[#6B5E70] uppercase italic tracking-tighter flex items-center justify-center md:justify-start gap-3">
                      <Send size={20} className="text-[#B39BBD]" /> Envíame un mensajito
                    </h2>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="space-y-2">
                        <label className="text-[9px] md:text-[10px] font-black text-[#6B5E70]/50 uppercase tracking-widest ml-2 md:ml-4">Nombre</label>
                        <input type="text" name="name" required placeholder="TU NOMBRE..." className="w-full bg-[#E2D9E8]/30 border-2 border-transparent focus:border-[#D4C9DE] rounded-xl md:rounded-2xl px-5 py-3.5 md:py-4 text-sm md:text-base text-[#6B5E70] placeholder:text-[#6B5E70]/30 font-bold outline-none transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] md:text-[10px] font-black text-[#6B5E70]/50 uppercase tracking-widest ml-2 md:ml-4">Email</label>
                        <input type="email" name="_replyto" required placeholder="TU@CORREO.COM" className="w-full bg-[#E2D9E8]/30 border-2 border-transparent focus:border-[#D4C9DE] rounded-xl md:rounded-2xl px-5 py-3.5 md:py-4 text-sm md:text-base text-[#6B5E70] placeholder:text-[#6B5E70]/30 font-bold outline-none transition-all" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] md:text-[10px] font-black text-[#6B5E70]/50 uppercase tracking-widest ml-2 md:ml-4">Mensaje</label>
                      <textarea name="message" required placeholder="ESCRIBE AQUÍ..." className="w-full bg-[#E2D9E8]/30 border-2 border-transparent focus:border-[#D4C9DE] rounded-[1.5rem] md:rounded-[2rem] px-5 py-4 md:py-5 text-sm md:text-base text-[#6B5E70] placeholder:text-[#6B5E70]/30 font-bold outline-none min-h-[120px] md:min-h-[150px] resize-none transition-all"></textarea>
                    </div>
                    <button type="submit" disabled={loading} className="w-full md:w-auto px-10 md:px-12 bg-[#6B5E70] text-white font-black uppercase italic tracking-[0.1em] md:tracking-[0.2em] py-4 md:py-5 rounded-xl md:rounded-2xl hover:brightness-110 shadow-lg shadow-[#6B5E70]/10 transition-all text-xs md:text-sm">
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