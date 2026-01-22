"use client";
import React, { useState } from 'react';
import { Palette, Heart, Sparkles, Send, Music } from 'lucide-react';
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
        alert("Hubo un error.");
      }
    } catch (error) {
      alert("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] pb-32 pt-12 font-sans overflow-x-hidden">
      <div className="max-w-2xl mx-auto px-6 space-y-6">
        
        {/* TITULO PRINCIPAL */}
        <header className="mb-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-6xl font-black italic tracking-tighter text-[#6B5E70] uppercase"
          >
            Sobre Mi
          </motion.h1>
          <div className="h-1 w-12 bg-[#6B5E70]/20 mx-auto mt-2 rounded-full" />
        </header>

        {/* CONTENEDOR: MI ATELIER */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-white"
        >
          <h3 className="text-[11px] font-black text-[#6B5E70] uppercase tracking-[0.3em] flex items-center gap-3 mb-6 italic">
            <Heart size={16} className="text-[#6B5E70]/40" /> Mi Atelier
          </h3>
          <p className="text-[#6B5E70] leading-relaxed text-lg font-medium italic">
            Bienvenido a mi pequeño jardín digital. Me encanta compartir mi arte y conectar con personas que disfrutan de este.
          </p>
        </motion.section>

        {/* CONTENEDOR: HERRAMIENTAS */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#E8E4E9] rounded-[2.5rem] p-8 md:p-10 shadow-sm"
        >
          <h3 className="text-[11px] font-black text-[#6B5E70] uppercase tracking-[0.3em] flex items-center gap-3 mb-8 italic">
            <Palette size={16} className="text-[#6B5E70]/40" /> Herramientas
          </h3>
          <div className="flex flex-wrap gap-3">
            <span className="bg-white/60 backdrop-blur-sm px-5 py-2 rounded-2xl text-[10px] font-black text-[#6B5E70] uppercase italic flex items-center gap-2">
              <Sparkles size={12}/> Linux y Krita
            </span>
            <span className="bg-white/60 backdrop-blur-sm px-5 py-2 rounded-2xl text-[10px] font-black text-[#6B5E70] uppercase italic flex items-center gap-2">
              <Sparkles size={12}/> Acuarelas y Acrílico
            </span>
            <span className="bg-white/60 backdrop-blur-sm px-5 py-2 rounded-2xl text-[10px] font-black text-[#6B5E70] uppercase italic flex items-center gap-2">
              <Music size={12}/> Mucha música
            </span>
          </div>
        </motion.section>

        {/* CONTENEDOR: GARDEN OF SINS */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#6B5E70] rounded-[2.5rem] p-8 md:p-10 text-white shadow-xl shadow-[#6B5E70]/20"
        >
          <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-4">¿Qué es "Garden of Sins"?</h2>
          <p className="text-white/80 text-sm md:text-base italic leading-relaxed font-medium">
            Es un espacio en constante crecimiento, mi proyecto de vida. Un reflejo de temas importantes con personajes que han dejado marca en mí. Cada flor es una emoción que necesito soltar.
          </p>
        </motion.section>

        {/* CONTENEDOR: FORMULARIO */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#F9F7F9] rounded-[3rem] p-8 md:p-10 border border-[#6B5E70]/5"
        >
          <div className="flex items-center gap-3 mb-8">
            <Send size={18} className="text-[#6B5E70]/40" />
            <h2 className="text-lg font-black text-[#6B5E70] uppercase italic tracking-tighter">Envíame un mensajito</h2>
          </div>

          {enviado ? (
            <div className="text-center py-6">
              <p className="text-[#6B5E70] font-black italic">¡Enviado con éxito! ♡</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="text" 
                name="name" 
                placeholder="Nombre" 
                className="w-full bg-white rounded-2xl px-6 py-4 text-[#6B5E70] placeholder:text-[#6B5E70]/30 font-bold outline-none focus:ring-2 focus:ring-[#6B5E70]/10 transition-all"
              />
              <input 
                type="email" 
                name="_replyto" 
                placeholder="Correo" 
                className="w-full bg-white rounded-2xl px-6 py-4 text-[#6B5E70] placeholder:text-[#6B5E70]/30 font-bold outline-none focus:ring-2 focus:ring-[#6B5E70]/10 transition-all"
              />
              <textarea 
                name="message" 
                placeholder="Mensaje" 
                className="w-full bg-white rounded-3xl px-6 py-4 text-[#6B5E70] placeholder:text-[#6B5E70]/30 font-bold outline-none focus:ring-2 focus:ring-[#6B5E70]/10 transition-all min-h-[120px] resize-none"
              ></textarea>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#6B5E70] text-white font-black uppercase italic py-5 rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {loading ? '...' : 'Enviar Mensaje'} <Send size={14} />
              </button>
            </form>
          )}
        </motion.section>

      </div>
    </div>
  );
}