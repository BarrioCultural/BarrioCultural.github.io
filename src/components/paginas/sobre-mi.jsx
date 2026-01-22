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
    /* SOLUCIÓN AL ROSA:
       1. Quitamos pt-16 y añadimos -mt-20 (o el alto de tu navbar) 
       2. Usamos pt-32 para compensar y que el título no quede tapado.
       3. El bg-[#F0F0F0] ahora envuelve todo sin dejar huecos.
    */
    <div className="w-full bg-[#F0F0F0] min-h-screen">
      <main className="w-full bg-[#F0F0F0] pb-20 pt-24 md:pt-32 font-sans overflow-x-hidden">
        
        {/* CABECERA */}
        <header className="mb-12 md:mb-20 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-[#6B5E70] uppercase leading-none">
            Sobre Mi
          </h1>
          <div className="h-1 w-24 bg-[#6B5E70] mx-auto mt-4 rounded-full opacity-10" />
        </header>

        <div className="max-w-4xl mx-auto px-6 space-y-16 md:space-y-24">
          
          {/* SECCIÓN 1: Mi Atelier */}
          <section className="space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-white">
              <h3 className="text-base md:text-lg font-black text-[#6B5E70] uppercase tracking-widest flex items-center gap-2 mb-4">
                <Heart size={18} className="opacity-50" /> Mi Atelier
              </h3>
              <p className="text-[#6B5E70] leading-relaxed text-base md:text-lg font-medium italic">
                Bienvenido a mi pequeño jardín digital.<br />
                Me encanta compartir mi arte y conectar con personas que disfrutan de este.
              </p>
            </div>
          </section>

          {/* SECCIÓN 2: Herramientas */}
          <section className="space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-white">
              <h3 className="text-base md:text-lg font-black text-[#6B5E70] uppercase tracking-widest flex items-center gap-2 mb-4">
                <Palette size={18} className="opacity-50" /> Herramientas
              </h3>
              <ul className="text-sm md:text-base text-[#6B5E70]/80 grid grid-cols-1 md:grid-cols-2 gap-4 font-bold uppercase italic tracking-tighter">
                <li className="flex items-center gap-2 bg-[#F0F0F0] p-3 rounded-xl"><Sparkles size={12}/> Linux y Krita</li>
                <li className="flex items-center gap-2 bg-[#F0F0F0] p-3 rounded-xl"><Sparkles size={12}/> Acuarelas y Acrílico</li>
                <li className="flex items-center gap-2 bg-[#F0F0F0] p-3 rounded-xl"><Sparkles size={12}/> Mucha música</li>
              </ul>
            </div>
          </section>

          {/* SECCIÓN 3: Garden of Sins */}
          <section className="space-y-8 px-2">
            <div className="flex items-center space-x-4 mb-4">
              <h2 className="text-2xl md:text-4xl font-black uppercase italic text-[#6B5E70] tracking-tighter">
                ¿Qué es "Garden of Sins"?
              </h2>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-[#6B5E70]/20 to-transparent" />
            </div>
            
            <div className="grid gap-6 text-[#6B5E70]/70 text-base md:text-lg italic leading-relaxed font-medium">
              <p>Más que un portafolio, es un espacio en constante crecimiento (como un jardín real), es mi proyecto de vida.</p>
              <p>Un reflejo de temas que considero importantes con personajes que se basan en personas que han dejado una marca en mí. Es un proyecto sin límites que irá creciendo a mi lado mientras voy creciendo como persona y artista.</p>
              <p className="text-[#6B5E70] font-black underline decoration-[#6B5E70]/20 underline-offset-8">
                Cada flor de este jardín está basada en una experiencia o una emoción que necesito quitarme de encima.
              </p>
            </div>
          </section>

          {/* CONTACTO */}
          <section className="pt-10">
            <div className="bg-white rounded-[3rem] p-8 md:p-16 border border-gray-100 shadow-xl shadow-[#6B5E70]/5">
              {enviado ? (
                <div className="text-center py-10">
                  <p className="text-[#6B5E70] font-black text-2xl uppercase italic tracking-tighter mb-2">¡Mensaje enviado!</p>
                  <p className="text-[#6B5E70]/60 font-medium italic mb-8">Gracias por escribirme, te responderé pronto. ♡</p>
                  <button onClick={() => setEnviado(false)} className="text-[10px] font-black uppercase tracking-widest text-[#6B5E70] border-b border-[#6B5E70] pb-1">Enviar otro</button>
                </div>
              ) : (
                <>
                  <div className="mb-10 text-center md:text-left">
                    <h2 className="text-2xl font-black text-[#6B5E70] uppercase italic tracking-tighter flex items-center justify-center md:justify-start gap-3">
                      <Send size={20} className="opacity-40" /> Envíame un mensajito
                    </h2>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input type="text" name="name" required placeholder="TU NOMBRE..." className="w-full bg-[#F0F0F0] border-none rounded-2xl px-6 py-4 text-[#6B5E70] placeholder:text-[#6B5E70]/30 font-bold outline-none" />
                      <input type="email" name="_replyto" required placeholder="TU@CORREO.COM" className="w-full bg-[#F0F0F0] border-none rounded-2xl px-6 py-4 text-[#6B5E70] placeholder:text-[#6B5E70]/30 font-bold outline-none" />
                    </div>
                    <textarea name="message" required placeholder="ESCRIBE AQUÍ..." className="w-full bg-[#F0F0F0] border-none rounded-[2rem] px-6 py-5 text-[#6B5E70] placeholder:text-[#6B5E70]/30 font-bold outline-none min-h-[150px] resize-none"></textarea>
                    <button type="submit" disabled={loading} className="w-full md:w-auto px-12 bg-[#6B5E70] text-white font-black uppercase italic tracking-widest py-5 rounded-2xl hover:scale-105 transition-all">
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