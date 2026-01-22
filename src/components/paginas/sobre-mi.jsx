"use client";
import React, { useState } from 'react';
import { Palette, Heart, Sparkles, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    /* He añadido w-full y relativo para asegurar que el fondo cubra todo */
    <main className="relative min-h-screen w-full bg-[#F0F0F0] pb-20 pt-16 font-sans overflow-x-hidden">
      
      {/* CABECERA */}
      <header className="mb-20 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-[#6B5E70] uppercase leading-none">
          Sobre Mi
        </h1>
        <div className="h-1 w-24 bg-[#6B5E70] mx-auto mt-4 rounded-full opacity-10" />
      </header>

      <div className="max-w-4xl mx-auto px-6 space-y-24">
        
        {/* SECCIÓN 1: Herramientas */}
        <section className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <h3 className="text-lg font-black text-[#6B5E70] uppercase tracking-widest flex items-center gap-2">
              <Heart size={18} className="opacity-50" /> Mi Atelier
            </h3>
            <p className="text-[#6B5E70] leading-relaxed text-base font-medium italic">
              Bienvenido a mi pequeño jardín digital.<br />
              Me encanta compartir mi arte y conectar con personas que disfrutan de este.
            </p>
          </div>

          <div className="space-y-6 border-l border-[#6B5E70]/10 pl-8">
            <h3 className="text-lg font-black text-[#6B5E70] uppercase tracking-widest flex items-center gap-2">
              <Palette size={18} className="opacity-50" /> Herramientas
            </h3>
            <ul className="text-sm text-[#6B5E70]/80 space-y-3 font-bold uppercase italic tracking-tighter">
              <li className="flex items-center gap-2"><Sparkles size={12}/> Linux y Krita</li>
              <li className="flex items-center gap-2"><Sparkles size={12}/> Acuarelas y Acrílico</li>
              <li className="flex items-center gap-2"><Sparkles size={12}/> Mucha música</li>
            </ul>
          </div>
        </section>

        {/* SECCIÓN 2: Garden of Sins */}
        <section className="space-y-8 text-center md:text-left">
          <div className="flex items-center space-x-4 mb-4">
            <h2 className="text-3xl md:text-4xl font-black uppercase italic text-[#6B5E70] tracking-tighter">
              ¿Qué es "Garden of Sins"?
            </h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[#6B5E70]/20 to-transparent" />
          </div>
          
          <div className="grid gap-6 text-[#6B5E70]/70 text-lg italic leading-relaxed font-medium max-w-3xl">
            <p>Más que un portafolio, es un espacio en constante crecimiento (como un jardín real), es mi proyecto de vida.</p>
            <p>Un reflejo de temas que considero importantes con personajes que se basan en personas que han dejado una marca en mí. Es un proyecto sin límites que irá creciendo a mi lado mientras voy creciendo como persona y artista.</p>
            <p className="text-[#6B5E70] font-black underline decoration-[#6B5E70]/20 underline-offset-8">
              Cada flor de este jardín está basada en una experiencia o una emoción que necesito quitarme de encima.
            </p>
          </div>
        </section>

        {/* SECCIÓN 3: Contacto */}
        <section className="pt-10">
          {/* He subido la opacidad del fondo blanco para que bloquee el fondo rosa totalmente */}
          <div className="bg-white/80 backdrop-blur-md rounded-[3rem] p-8 md:p-16 border border-white shadow-sm">
            {enviado ? (
              <div className="text-center py-10">
                <p className="text-[#6B5E70] font-black text-2xl uppercase italic tracking-tighter mb-2">¡Mensaje enviado!</p>
                <p className="text-[#6B5E70]/60 font-medium italic mb-8">Gracias por escribirme, te responderé pronto. ♡</p>
                <button onClick={() => setEnviado(false)} className="text-[10px] font-black uppercase tracking-widest text-[#6B5E70] border-b border-[#6B5E70] pb-1">Enviar otro</button>
              </div>
            ) : (
              <>
                <div className="mb-12 text-center md:text-left">
                  <h2 className="text-2xl font-black text-[#6B5E70] uppercase italic tracking-tighter flex items-center justify-center md:justify-start gap-3">
                    <Send size={20} className="opacity-40" /> Envíame un mensajito
                  </h2>
                  <p className="text-[#6B5E70]/50 text-xs italic font-bold uppercase tracking-widest mt-2">
                    ¿Dudas, sugerencias o solo quieres saludar? (´｡• ᵕ •｡`) ♡
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6B5E70]/60 ml-4">Nombre</label>
                      <input type="text" name="name" required placeholder="Tu nombre..." className="w-full bg-[#F5F5F5] border-none rounded-2xl px-6 py-4 text-[#6B5E70] placeholder:text-[#6B5E70]/30 font-bold focus:ring-2 focus:ring-[#6B5E70]/10 transition-all outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6B5E70]/60 ml-4">Correo</label>
                      <input type="email" name="_replyto" required placeholder="tu@correo.com" className="w-full bg-[#F5F5F5] border-none rounded-2xl px-6 py-4 text-[#6B5E70] placeholder:text-[#6B5E70]/30 font-bold focus:ring-2 focus:ring-[#6B5E70]/10 transition-all outline-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6B5E70]/60 ml-4">Mensaje</label>
                    <textarea name="message" required placeholder="Escribe aquí..." className="w-full bg-[#F5F5F5] border-none rounded-[2rem] px-6 py-5 text-[#6B5E70] placeholder:text-[#6B5E70]/30 font-bold focus:ring-2 focus:ring-[#6B5E70]/10 transition-all outline-none min-h-[150px] resize-none"></textarea>
                  </div>

                  <input type="hidden" name="_subject" value="¡Nuevo mensaje desde Franilover!" />

                  <button type="submit" disabled={loading} className="w-full md:w-auto px-12 bg-[#6B5E70] text-white font-black uppercase italic tracking-widest py-5 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#6B5E70]/20">
                    {loading ? 'Sincronizando...' : 'Enviar Mensaje'}
                  </button>
                </form>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}