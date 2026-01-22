"use client";
import React, { useState } from 'react';
import { Palette, Heart, Sparkles, Send, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion'; // Necesitarás instalar framer-motion

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

  // Variantes para animaciones suaves
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="w-full bg-[#F5F5F5] min-h-screen text-[#4A3F4F] selection:bg-[#D1C4DB]">
      <main className="w-full pb-32 pt-24 md:pt-40 font-sans overflow-x-hidden">
        
        {/* CABECERA MINIMALISTA PERO IMPACTANTE */}
        <header className="max-w-5xl mx-auto mb-32 px-6 relative">
          <motion.span 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 0.4 }} 
            className="absolute -top-10 left-6 text-7xl md:text-9xl font-serif italic pointer-events-none"
          >
            01
          </motion.span>
          <h1 className="text-6xl md:text-[8rem] font-light leading-none tracking-tighter uppercase relative z-10">
            Sobre <br />
            <span className="ml-12 md:ml-24 italic font-serif text-[#6B5E70]">Mi</span>
          </h1>
          <div className="h-px w-32 bg-[#6B5E70] mt-12 opacity-30" />
        </header>

        <div className="max-w-5xl mx-auto px-6 space-y-32">
          
          {/* SECCIÓN 1: MI ATELIER - FOCO EN EL TEXTO */}
          <motion.section {...fadeInUp} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 bg-white p-10 md:p-20 rounded-tr-[5rem] rounded-bl-[5rem] shadow-sm border border-black/5">
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] flex items-center gap-3 mb-10 text-[#6B5E70]/50">
                <Heart size={14} /> El Concepto
              </h3>
              <p className="text-2xl md:text-4xl leading-tight font-light text-[#332D35]">
                "Un pequeño <span className="italic font-serif">jardín digital</span> donde las ideas florecen sin prisa."
              </p>
            </div>
          </motion.section>

          {/* SECCIÓN 2: HERRAMIENTAS - DISEÑO DE TARJETAS FLOTANTES */}
          <motion.section {...fadeInUp} className="space-y-12">
            <div className="flex items-baseline gap-4">
               <h2 className="text-4xl font-serif italic uppercase">Herramientas</h2>
               <div className="h-px flex-grow bg-[#6B5E70] opacity-10" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
              {[
                { title: "Linux & Krita", desc: "Software libre para mentes libres." },
                { title: "Tradicional", desc: "Acuarelas, acrílico y el tacto del papel." },
                { title: "Atmósfera", desc: "Música constante y café frío." }
              ].map((item, i) => (
                <div key={i} className="group p-8 bg-[#E2D9E8]/30 hover:bg-[#E2D9E8] transition-colors duration-500 rounded-3xl border border-white">
                  <Sparkles size={18} className="mb-6 opacity-30 group-hover:scale-125 transition-transform" />
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-2">{item.title}</h4>
                  <p className="text-sm opacity-70">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* SECCIÓN 3: GARDEN OF SINS - TEXTO EN COLUMNAS */}
          <motion.section {...fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div className="sticky top-10">
              <h2 className="text-5xl md:text-7xl font-serif italic leading-none text-[#6B5E70]">
                Garden <br /> of Sins
              </h2>
              <p className="mt-6 text-sm uppercase tracking-[0.3em] font-bold opacity-40">Proyecto de vida</p>
            </div>
            
            <div className="space-y-8 text-lg leading-relaxed font-light">
              <p>
                Este espacio es un organismo vivo. No busco la perfección, sino el reflejo de una evolución constante.
              </p>
              <p className="text-[#6B5E70] font-medium border-l-2 border-[#D1C4DB] pl-6 py-2 italic">
                "Cada flor de este jardín nace de una emoción que necesitaba encontrar su propio peso en el mundo."
              </p>
              <p>
                Mis personajes no son solo dibujos; son fragmentos de historias, personas que cruzaron mi camino y dejaron una esencia que solo el arte puede contener.
              </p>
            </div>
          </motion.section>

          {/* SECCIÓN 4: CONTACTO - LIMPIO Y MODERNO */}
          <motion.section {...fadeInUp} className="pt-20">
            <div className="bg-[#4A3F4F] rounded-[3rem] p-8 md:p-20 text-white relative overflow-hidden">
              {/* Decoración de fondo */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
              
              {enviado ? (
                <div className="text-center py-20 relative z-10">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Heart size={60} className="mx-auto text-[#D1C4DB] mb-8" />
                  </motion.div>
                  <h2 className="text-3xl font-serif italic mb-4">Mensaje recibido</h2>
                  <p className="opacity-70 mb-10 text-lg">Pronto nos pondremos en contacto.</p>
                  <button onClick={() => setEnviado(false)} className="text-xs uppercase tracking-[0.3em] border-b border-white pb-2 hover:opacity-50 transition-opacity">Volver a escribir</button>
                </div>
              ) : (
                <div className="relative z-10">
                  <div className="mb-16">
                    <h2 className="text-4xl md:text-5xl font-serif italic mb-4">¿Hablamos?</h2>
                    <p className="text-[#D1C4DB] tracking-wide font-light">Cuéntame sobre tu proyecto o simplemente di hola.</p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="group border-b border-white/20 focus-within:border-white transition-colors">
                        <label className="text-[10px] uppercase tracking-widest opacity-50 block mb-2">Nombre</label>
                        <input type="text" name="name" required className="w-full bg-transparent py-3 outline-none text-xl font-light placeholder:text-white/10" placeholder="Tu nombre..." />
                      </div>
                      <div className="group border-b border-white/20 focus-within:border-white transition-colors">
                        <label className="text-[10px] uppercase tracking-widest opacity-50 block mb-2">Email</label>
                        <input type="email" name="_replyto" required className="w-full bg-transparent py-3 outline-none text-xl font-light placeholder:text-white/10" placeholder="hola@ejemplo.com" />
                      </div>
                    </div>
                    <div className="group border-b border-white/20 focus-within:border-white transition-colors">
                      <label className="text-[10px] uppercase tracking-widest opacity-50 block mb-2">Tu mensaje</label>
                      <textarea name="message" required className="w-full bg-transparent py-4 outline-none text-xl font-light min-h-[150px] resize-none placeholder:text-white/10" placeholder="Escribe aquí..."></textarea>
                    </div>
                    
                    <button type="submit" disabled={loading} className="group flex items-center gap-4 text-sm font-bold uppercase tracking-[0.4em] pt-4 transition-all hover:gap-8">
                      {loading ? 'Enviando...' : (
                        <>
                          Enviar Mensaje <ArrowRight size={20} className="text-[#D1C4DB]" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
}