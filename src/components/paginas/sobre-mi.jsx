"use client";
import React, { useState } from 'react';
import { Palette, Heart, Sparkles, Send, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <div className="w-full bg-[#F5F5F5] min-h-screen text-[#4A3F4F] selection:bg-[#E2D9E8]">
      <main className="max-w-4xl mx-auto px-6 pb-32 pt-24 md:pt-40 font-sans">
        
        {/* CABECERA: Simple y tipográfica */}
        <header className="mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-light tracking-tighter uppercase leading-none"
          >
            Sobre <span className="italic font-serif text-[#6B5E70]">Mi</span>
          </motion.h1>
          <div className="h-px w-20 bg-[#6B5E70] mt-8 opacity-20" />
        </header>

        <div className="space-y-24">
          
          {/* SECCIÓN 1: MI ATELIER */}
          <section className="relative">
            <div className="bg-white border border-[#6B5E70]/5 p-8 md:p-16 rounded-[2rem] shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] flex items-center gap-3 mb-8 opacity-40">
                <Heart size={14} /> Mi Atelier
              </h3>
              <p className="text-2xl md:text-3xl leading-snug font-light">
                Bienvenido a mi pequeño <span className="italic">jardín digital</span>. Me encanta compartir mi arte y conectar con personas que disfrutan de este proceso creativo.
              </p>
            </div>
          </section>

          {/* SECCIÓN 2: HERRAMIENTAS */}
          <section className="space-y-10">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] flex items-center gap-3 opacity-40">
              <Palette size={14} /> Herramientas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                "Linux y Krita",
                "Acuarelas y Acrílico",
                "Mucha música"
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-4 p-8 bg-[#E2D9E8]/30 rounded-2xl border border-white/50">
                  <Sparkles size={16} className="opacity-30" />
                  <span className="font-bold text-xs uppercase tracking-widest">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* SECCIÓN 3: GARDEN OF SINS */}
          <section className="space-y-8 border-t border-[#6B5E70]/10 pt-16">
            <h2 className="text-4xl md:text-6xl font-serif italic text-[#6B5E70]">Garden of Sins</h2>
            
            <div className="max-w-2xl space-y-6 text-lg md:text-xl leading-relaxed font-light opacity-90">
              <p>
                Este refleja temas que considero importantes a través de personajes basados en personas que han dejado una marca en mí.
              </p>
              <div className="p-8 bg-[#E2D9E8]/40 rounded-3xl border-l-4 border-[#6B5E70]">
                <p className="italic font-medium text-[#4A3F4F]">
                  "Cada flor de este jardín está basada en una experiencia o emoción que necesito quitarme de encima."
                </p>
              </div>
            </div>
          </section>

          {/* SECCIÓN 4: CONTACTO */}
          <section className="pt-10">
            <div className="bg-[#6f5a78] rounded-[3rem] p-8 md:p-16 text-white shadow-xl">
              {enviado ? (
                <div className="text-center py-10">
                  <Heart size={40} className="mx-auto text-[#D1C4DB] mb-6" />
                  <p className="font-serif italic text-2xl mb-4">¡Mensaje enviado!</p>
                  <button onClick={() => setEnviado(false)} className="text-[10px] uppercase tracking-widest border-b border-white/30 pb-1">Enviar otro</button>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-serif italic mb-12 flex items-center gap-4">
                    <Send size={24} className="opacity-30" /> Contacto
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="border-b border-white/10 focus-within:border-white transition-colors">
                        <input type="text" name="name" required placeholder="Nombre" className="w-full bg-transparent py-3 outline-none placeholder:text-white/20 font-light" />
                      </div>
                      <div className="border-b border-white/10 focus-within:border-white transition-colors">
                        <input type="email" name="_replyto" required placeholder="Email" className="w-full bg-transparent py-3 outline-none placeholder:text-white/20 font-light" />
                      </div>
                    </div>
                    <div className="border-b border-white/10 focus-within:border-white transition-colors">
                      <textarea name="message" required placeholder="Escribe aquí lo que quieras..." className="w-full bg-transparent py-3 outline-none min-h-[120px] resize-none placeholder:text-white/20 font-light"></textarea>
                    </div>
                    <button type="submit" disabled={loading} className="group flex items-center gap-3 bg-white text-[#4A3F4F] px-8 py-4 rounded-full font-bold uppercase text-[10px] tracking-widest hover:bg-[#D1C4DB] transition-all">
                      {loading ? 'Enviando...' : (
                        <>Enviar Mensaje <ArrowRight size={14} /></>
                      )}
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