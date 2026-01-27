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

  // --- OPTIMIZACIÓN: Variables de estilo ---
  const sectionTag = "text-[10px] font-bold uppercase tracking-[0.4em] flex items-center gap-3 mb-8 opacity-40 text-primary";

  return (
    <div className="w-full bg-bg-main min-h-screen text-primary selection:bg-primary/10">
      <main className="max-w-4xl mx-auto px-6 pb-32 pt-24 md:pt-40 font-sans">
        
        {/* CABECERA: Limpia y unificada */}
        <header className="mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-none"
          >
            Sobre <span className="font-serif font-light text-primary/60">Mi</span>
          </motion.h1>
          <div className="h-1.5 w-20 bg-primary mt-8 opacity-20 rounded-full" />
        </header>

        <div className="space-y-24">
          
          {/* SECCIÓN 1: MI ATELIER */}
          <section>
            <div className="card-main !bg-white p-8 md:p-16">
              <h3 className={sectionTag}>
                <Heart size={14} /> ¿Que somos?
              </h3>
              <p className="text-2xl md:text-3xl leading-snug font-light italic">
                No tengo idea
              </p>
            </div>
          </section>

          {/* SECCIÓN 2: HERRAMIENTAS (Uso de bg\-primary/5 para suavidad) */}
          <section className="space-y-10">
            <h3 className={sectionTag}>
              <Palette size={14} /> Planes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                "a",
                "e",
                "i"
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-4 p-8 bg-white border border-primary/5 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
                  <Sparkles size={16} className="text-primary/30" />
                  <span className="font-black text-[10px] uppercase tracking-[0.2em]">{item}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}