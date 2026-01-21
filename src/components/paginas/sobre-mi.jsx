"use client";
import React, { useState } from 'react';
import { Palette, Heart, Sparkles, Send, X } from 'lucide-react';
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
    <main className="min-h-screen bg-[#F0F0F0] pb-20 pt-16 font-sans overflow-x-hidden">
      
      {/* CABECERA ESTILO LORE */}
      <header className="mb-12 md:mb-20 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-[#6B5E70] uppercase leading-none break-words">
          El Autor
        </h1>
        <div className="h-1 w-20 md:w-24 bg-[#6B5E70] mx-auto mt-4 rounded-full opacity-20" />
      </header>

      <div className="max-w-5xl mx-auto px-6 space-y-20">
        
        {/* SECCIÓN BIOGRAFÍA / ATELIER */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#6B5E70] italic">Perfil</span>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-[#6B5E70]/20 to-transparent" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black italic text-[#6B5E70] uppercase tracking-tighter leading-none">
              Dibujante & <br /> Creador
            </h2>
            <p className="text-[#6B5E70]/70 text-lg italic leading-relaxed font-medium">
              Bienvenido a mi pequeño jardín digital. Me encanta compartir mi arte y conectar con personas que disfrutan de este universo en constante expansión.
            </p>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-white space-y-8">
            <div className="space-y-4">
              <h3 className="text-sm font-black text-[#6B5E70] uppercase tracking-widest flex items-center gap-2">
                <Palette size={16} /> Herramientas
              </h3>
              <ul className="grid grid-cols-1 gap-3">
                {['Linux & Krita', 'Acuarelas & Acrílico', 'Música Infinita'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[#6B5E70]/60 font-bold text-sm italic uppercase tracking-tighter">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#6B5E70]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* SECCIÓN PROYECTO GARDEN OF SINS */}
        <section className="bg-[#6B5E70] rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl">
          <Sparkles className="absolute top-10 right-10 opacity-10" size={120} />
          <div className="relative z-10 space-y-6 max-w-3xl">
            <div className="flex items-center space-x-3">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 italic">El Manifiesto</span>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-white/20 to-transparent" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
              ¿Qué es <br /> "Garden of Sins"?
            </h2>
            <div className="space-y-4 text-white/80 text-base md:text-lg italic font-medium leading-relaxed">
              <p>Más que un portafolio, es un espacio en constante crecimiento (como un jardín real); es mi proyecto de vida.</p>
              <p>Un reflejo de temas que considero importantes con personajes que se basan en personas que han dejado una marca en mí.</p>
              <p>Cada flor de este jardín está basada en una experiencia o una emoción que necesito transformar en algo tangible.</p>
            </div>
          </div>
        </section>

        {/* SECCIÓN CONTACTO / CARTA */}
        <section className="max-w-3xl mx-auto space-y-10">
          <div className="text-center space-y-4">
            <div className="flex items-center space-x-3 w-full justify-center">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#6B5E70]/20" />
              <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-[#6B5E70] italic">Contacto</span>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#6B5E70]/20" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black italic text-[#6B5E70] uppercase tracking-tighter">
               Envíame un mensajito
            </h2>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-white">
            {enviado ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10 space-y-6">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500">
                  <Sparkles size={40} />
                </div>
                <h3 className="text-2xl font-black text-[#6B5E70] uppercase italic tracking-tighter">¡Mensaje Recibido!</h3>
                <p className="text-[#6B5E70]/60 font-medium italic">Gracias por escribir, te responderé pronto en tu jardín digital.</p>
                <button onClick={() => setEnviado(false)} className="text-xs font-black uppercase tracking-widest text-[#6B5E70] border-b-2 border-[#6B5E70]/20 hover:border-[#6B5E70] transition-all">Enviar otro mensaje</button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#6B5E70] ml-2">Tu Nombre</label>
                    <input type="text" name="name" required className="w-full bg-[#F0F0F0] border-transparent rounded-2xl px-6 py-4 text-[#6B5E70] font-bold focus:ring-2 focus:ring-[#6B5E70]/20 transition-all outline-none" placeholder="¿Cómo te llamas?" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#6B5E70] ml-2">Tu Correo</label>
                    <input type="email" name="_replyto" required className="w-full bg-[#F0F0F0] border-transparent rounded-2xl px-6 py-4 text-[#6B5E70] font-bold focus:ring-2 focus:ring-[#6B5E70]/20 transition-all outline-none" placeholder="tu@correo.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#6B5E70] ml-2">Mensaje</label>
                  <textarea name="message" required className="w-full bg-[#F0F0F0] border-transparent rounded-3xl px-6 py-5 text-[#6B5E70] font-bold focus:ring-2 focus:ring-[#6B5E70]/20 transition-all outline-none min-h-[150px] resize-none" placeholder="Escribe aquí lo que quieras..." />
                </div>
                <input type="hidden" name="_subject" value="¡Nuevo mensaje desde Garden of Sins!" />
                <button type="submit" disabled={loading} className="w-full bg-[#6B5E70] text-white font-black uppercase italic tracking-[0.2em] py-5 rounded-2xl shadow-xl shadow-[#6B5E70]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                  {loading ? 'Enviando...' : <><Send size={18} /> Enviar Mensaje</>}
                </button>
              </form>
            )}
          </div>
        </section>
      </div>

      <div className="h-24"></div>
    </main>
  );
}