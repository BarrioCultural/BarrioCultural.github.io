"use client";
import React, { useState } from 'react';
import { Palette, Heart, Sparkles, Send, ArrowRight, ExternalLink } from 'lucide-react';
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

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  return (
    <div className="w-full bg-[#F8F7F4] min-h-screen text-[#3D363F] selection:bg-[#E2D9E8]">
      <main className="max-w-6xl mx-auto px-6 pb-32 pt-24 md:pt-44 font-sans">
        
        {/* CABECERA: Limpia y Editorial */}
        <header className="mb-32 relative">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col border-l border-[#6B5E70]/20 pl-8"
          >
            <span className="text-[10px] uppercase tracking-[0.5em] text-[#6B5E70]/60 mb-4 font-bold">Artist Portfolio</span>
            <h1 className="text-7xl md:text-9xl font-light tracking-tighter leading-[0.85]">
              SOBRE <br />
              <span className="italic font-serif text-[#6B5E70] ml-4 md:ml-12">MI.</span>
            </h1>
          </motion.div>
        </header>

        <div className="space-y-40">
          
          {/* SECCIÓN 1: INTRODUCCIÓN ASIMÉTRICA */}
          <motion.section {...fadeInUp} className="flex justify-end">
            <div className="w-full md:w-2/3 relative">
              <div className="absolute -left-4 md:-left-12 top-0 text-5xl md:text-7xl text-[#E2D9E8] font-serif italic">“</div>
              <p className="text-2xl md:text-4xl leading-snug font-light text-balance pl-6">
                Bienvenido a mi <span className="bg-[#E2D9E8]/40 px-2 italic">jardín digital</span>. Un espacio donde el proceso creativo es tan valioso como el resultado final.
              </p>
              <div className="mt-8 flex items-center gap-4 text-[#6B5E70]/40 uppercase text-[10px] tracking-widest font-black">
                <Heart size={14} /> El concepto de mi Atelier
              </div>
            </div>
          </motion.section>

          {/* SECCIÓN 2: HERRAMIENTAS - GRID ELEGANTE */}
          <motion.section {...fadeInUp} className="space-y-16">
            <h2 className="text-xs uppercase tracking-[0.4em] font-bold text-center opacity-40">Methodology & Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#6B5E70]/10 border border-[#6B5E70]/10">
              {[
                { title: "Digital Art", tech: "Linux + Krita", desc: "La libertad del software libre para crear sin límites técnicos." },
                { title: "Traditional", tech: "Mixed Media", desc: "Acuarelas y acrílicos para mantener el contacto con lo tangible." },
                { title: "Ambience", tech: "Music & Focus", desc: "Una atmósfera sonora cuidadosamente curada para cada pieza." }
              ].map((item, i) => (
                <div key={i} className="bg-[#F8F7F4] p-12 hover:bg-white transition-all duration-500 group">
                  <div className="h-10 w-10 rounded-full border border-[#6B5E70]/20 flex items-center justify-center mb-8 group-hover:bg-[#E2D9E8] group-hover:border-transparent transition-colors">
                    <Sparkles size={16} className="text-[#6B5E70]/40 group-hover:text-[#6B5E70]" />
                  </div>
                  <h4 className="text-[10px] uppercase tracking-widest text-[#6B5E70]/50 mb-1">{item.title}</h4>
                  <h3 className="text-xl font-medium mb-4 italic font-serif">{item.tech}</h3>
                  <p className="text-sm leading-relaxed opacity-70">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* SECCIÓN 3: GARDEN OF SINS - TEXTO EN DOS COLUMNAS */}
          <motion.section {...fadeInUp} className="grid grid-cols-1 md:grid-cols-12 gap-12 border-t border-[#6B5E70]/10 pt-16">
            <div className="md:col-span-5">
              <h2 className="text-4xl md:text-6xl font-serif italic text-[#6B5E70] leading-none">Garden <br /> of Sins</h2>
            </div>
            <div className="md:col-span-7 space-y-6">
              <p className="text-xl md:text-2xl font-light leading-relaxed">
                Este proyecto refleja temas que considero vitales a través de personajes basados en personas que han dejado una huella en mí.
              </p>
              <div className="h-px w-20 bg-[#6B5E70]/20 my-8" />
              <p className="text-base opacity-70 leading-relaxed max-w-lg">
                Es un organismo vivo que crece conmigo. Cada "flor" en este jardín nace de una experiencia o emoción que necesitaba ser liberada. No es solo un portafolio, es un mapa de mi crecimiento personal y artístico.
              </p>
            </div>
          </motion.section>

          {/* SECCIÓN 4: CONTACTO - MINIMALISMO OSCURO */}
          <motion.section {...fadeInUp} className="pt-20">
            <div className="bg-[#332D35] rounded-[3rem] p-10 md:p-24 text-[#F8F7F4] shadow-2xl">
              {enviado ? (
                <div className="text-center py-20">
                  <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
                    <Heart size={48} className="mx-auto text-[#D1C4DB] mb-6" />
                    <h2 className="text-3xl font-serif italic mb-2">Gracias por conectar</h2>
                    <p className="opacity-50 text-sm tracking-widest uppercase mb-8">Mensaje enviado con éxito</p>
                    <button onClick={() => setEnviado(false)} className="px-8 py-3 border border-white/20 rounded-full text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all">Escribir otro</button>
                  </motion.div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                  <div>
                    <h2 className="text-5xl md:text-6xl font-serif italic mb-8">Contacto</h2>
                    <p className="text-[#D1C4DB]/60 text-lg font-light leading-relaxed">
                      ¿Tienes una idea en mente o quieres colaborar en algo especial? Mi jardín siempre está abierto a nuevas conexiones.
                    </p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6">
                      <div className="border-b border-white/10 focus-within:border-[#D1C4DB] transition-colors py-2">
                        <input type="text" name="name" required placeholder="Nombre" className="w-full bg-transparent outline-none text-xl font-light placeholder:text-white/20" />
                      </div>
                      <div className="border-b border-white/10 focus-within:border-[#D1C4DB] transition-colors py-2">
                        <input type="email" name="_replyto" required placeholder="Email" className="w-full bg-transparent outline-none text-xl font-light placeholder:text-white/20" />
                      </div>
                      <div className="border-b border-white/10 focus-within:border-[#D1C4DB] transition-colors py-2">
                        <textarea name="message" required placeholder="¿En qué estás pensando?" className="w-full bg-transparent outline-none text-xl font-light min-h-[120px] resize-none placeholder:text-white/20"></textarea>
                      </div>
                    </div>
                    
                    <button type="submit" disabled={loading} className="group flex items-center gap-3 bg-[#E2D9E8] text-[#332D35] px-10 py-5 rounded-full font-bold uppercase text-[10px] tracking-[0.3em] hover:bg-white transition-all active:scale-95">
                      {loading ? 'Enviando...' : (
                        <>
                          Enviar Mensaje <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
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
      
      {/* FOOTER SIMPLE */}
      <footer className="py-20 text-center border-t border-[#6B5E70]/5">
        <p className="text-[10px] uppercase tracking-[0.5em] opacity-30">© 2026 Garden of Sins</p>
      </footer>
    </div>
  );
}