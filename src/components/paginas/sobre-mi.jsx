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
      <main className="w-full bg-[#F0F0F0] pb-20 pt-24 md:pt-32 font-sans overflow-x-hidden">
        
        {/* CABECERA: Título con sombra suave morada */}
        <header className="mb-12 md:mb-20 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-[#6B5E70] uppercase leading-none drop-shadow-[0_2px_10px_rgba(107,94,112,0.1)]">
            Sobre Mi
          </h1>
          <div className="h-1.5 w-24 bg-gradient-to-r from-transparent via-[#6B5E70]/20 to-transparent mx-auto mt-6 rounded-full" />
        </header>

        <div className="max-w-4xl mx-auto px-6 space-y-16 md:space-y-24">
          
          {/* SECCIÓN 1: Mi Atelier - Fondo Lila muy suave */}
          <section className="space-y-6">
            <div className="bg-[#E9E4ED] rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-white/50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 text-[#6B5E70] group-hover:scale-110 transition-transform duration-700">
                <Heart size={120} />
              </div>
              <h3 className="text-base md:text-lg font-black text-[#6B5E70] uppercase tracking-widest flex items-center gap-2 mb-4 relative z-10">
                <Heart size={18} className="text-[#6B5E70]" /> Mi Atelier
              </h3>
              <p className="text-[#6B5E70]/80 leading-relaxed text-base md:text-lg font-medium italic relative z-10">
                Bienvenido a mi pequeño jardín digital.<br />
                Me encanta compartir mi arte y conectar con personas que disfrutan de este.
              </p>
            </div>
          </section>

          {/* SECCIÓN 2: Herramientas - Tarjeta con borde morado pastel */}
          <section className="space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border-2 border-[#E9E4ED]">
              <h3 className="text-base md:text-lg font-black text-[#6B5E70] uppercase tracking-widest flex items-center gap-2 mb-6">
                <Palette size={18} className="text-[#6B5E70]" /> Herramientas
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: <Sparkles size={14}/>, text: "Linux y Krita" },
                  { icon: <Sparkles size={14}/>, text: "Acuarelas y Acrílico" },
                  { icon: <Sparkles size={14}/>, text: "Mucha música" },
                  { icon: <Sparkles size={14}/>, text: "Inspiración nocturna" }
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 bg-[#F8F7F9] border border-[#E9E4ED] p-4 rounded-2xl text-[#6B5E70] font-bold uppercase italic tracking-tighter text-sm">
                    <span className="text-[#6B5E70]/40">{item.icon}</span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* SECCIÓN 3: Garden of Sins - Texto con acentos pastel */}
          <section className="space-y-8 px-2 relative">
            <div className="flex items-center space-x-4 mb-4">
              <h2 className="text-2xl md:text-4xl font-black uppercase italic text-[#6B5E70] tracking-tighter">
                ¿Qué es "Garden of Sins"?
              </h2>
              <div className="h-[2px] flex-1 bg-gradient-to-r from-[#E9E4ED] to-transparent" />
            </div>
            
            <div className="grid gap-6 text-[#6B5E70]/70 text-base md:text-lg italic leading-relaxed font-medium">
              <p>Más que un portafolio, es un espacio en constante crecimiento (como un jardín real), es mi proyecto de vida.</p>
              <p>Un reflejo de temas que considero importantes con personajes que se basan en personas que han dejado una marca en mí. Es un proyecto sin límites que irá creciendo a mi lado.</p>
              <p className="text-[#6B5E70] font-black underline decoration-[#E9E4ED] decoration-4 underline-offset-8 bg-[#E9E4ED]/30 px-2 py-1 rounded-lg inline-block">
                Cada flor de este jardín está basada en una experiencia o una emoción que necesito quitarme de encima.
              </p>
            </div>
          </section>

          {/* CONTACTO: Formulario con degradado suave morado */}
          <section className="pt-10">
            <div className="bg-gradient-to-br from-white to-[#F8F7F9] rounded-[3rem] p-8 md:p-16 border-4 border-white shadow-xl shadow-[#6B5E70]/5">
              {enviado ? (
                <div className="text-center py-10">
                  <p className="text-[#6B5E70] font-black text-2xl uppercase italic tracking-tighter mb-2">¡Mensaje enviado!</p>
                  <p className="text-[#6B5E70]/60 font-medium italic mb-8">Gracias por escribirme, te responderé pronto. ♡</p>
                  <button onClick={() => setEnviado(false)} className="px-8 py-3 rounded-full bg-[#E9E4ED] text-[#6B5E70] font-black uppercase text-[10px] tracking-widest hover:bg-[#6B5E70] hover:text-white transition-all">Enviar otro</button>
                </div>
              ) : (
                <>
                  <div className="mb-10 text-center md:text-left">
                    <h2 className="text-2xl font-black text-[#6B5E70] uppercase italic tracking-tighter flex items-center justify-center md:justify-start gap-3">
                      <Send size={20} className="text-[#6B5E70]/40" /> Envíame un mensajito
                    </h2>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#6B5E70]/40 uppercase tracking-widest ml-4">Nombre</label>
                        <input type="text" name="name" required placeholder="TU NOMBRE..." className="w-full bg-[#E9E4ED]/40 border-2 border-transparent focus:border-[#E9E4ED] rounded-2xl px-6 py-4 text-[#6B5E70] placeholder:text-[#6B5E70]/30 font-bold outline-none transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#6B5E70]/40 uppercase tracking-widest ml-4">Email</label>
                        <input type="email" name="_replyto" required placeholder="TU@CORREO.COM" className="w-full bg-[#E9E4ED]/40 border-2 border-transparent focus:border-[#E9E4ED] rounded-2xl px-6 py-4 text-[#6B5E70] placeholder:text-[#6B5E70]/30 font-bold outline-none transition-all" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[#6B5E70]/40 uppercase tracking-widest ml-4">Mensaje</label>
                      <textarea name="message" required placeholder="ESCRIBE AQUÍ TU HISTORIA..." className="w-full bg-[#E9E4ED]/40 border-2 border-transparent focus:border-[#E9E4ED] rounded-[2rem] px-6 py-5 text-[#6B5E70] placeholder:text-[#6B5E70]/30 font-bold outline-none min-h-[150px] resize-none transition-all"></textarea>
                    </div>
                    <button type="submit" disabled={loading} className="w-full md:w-auto px-12 bg-[#6B5E70] text-white font-black uppercase italic tracking-[0.2em] py-5 rounded-2xl hover:bg-[#5A4D5F] hover:shadow-lg hover:shadow-[#6B5E70]/20 transition-all active:scale-95">
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