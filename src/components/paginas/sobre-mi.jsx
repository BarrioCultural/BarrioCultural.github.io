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
    <div className="flex flex-col gap-8 w-full max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* SECCIÓN INFORMACIÓN PERSONAL */}
      <section className="card-franilover md:p-12">
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary/30 mb-4 flex items-center justify-center">
            {/* Subida la opacidad del icono para que no sea blanco */}
            <Sparkles size={40} className="text-primary/60" />
          </div>
          <h2 className="text-2xl font-bold text-primary">Sobre Mi</h2>
          {/* Texto secundario con color más sólido */}
          <p className="text-primary/80 italic text-sm font-medium">Dibujante y creador</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary flex items-center gap-2">
              <Heart size={18} /> Mi Pasión
            </h3>
            {/* Texto principal casi sólido para lectura perfecta */}
            <p className="text-primary leading-relaxed text-sm">
              Bienvenido a mi pequeño jardín digital <br />
              Me encanta compartir mi arte y conectar con personas que disfrutan de este.
            </p>
          </div>

          <div className="bg-white/30 rounded-2xl p-6 border border-primary/10 shadow-sm">
            <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <Palette size={18} /> Herramientas
            </h3>
            {/* Subida la opacidad de la lista */}
            <ul className="text-xs text-primary/90 space-y-2 font-semibold">
              <li>✨ Linux y Krita</li>
              <li>🎨 Acuarelas y Acrílico</li>
              <li>☕ Mucha música</li>
            </ul>
          </div>
        </div>
      </section>

<section className="card-franilover md:p-12">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 space-y-4">
            <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
              <Sparkles className="text-primary" size={24} /> ¿Qué es "Garden of Sins"?
            </h2>
            <div className="space-y-3">
              <p className="text-primary text-sm leading-relaxed font-medium">
                Más que un portafolio, es un espacio en constante crecimiento (como un jardín real), es mi proyecto de vida. 
              </p>

              <p className="text-primary text-sm leading-relaxed font-medium">
                Un reflejo de temas que considero importantes con personajes que se basan en personas que han dejado una marca en mi.
                Es un proyecto sin limites que ira a creciendo a mi lado mientras voy creciendo como persona y artista. 
              </p>

              <p className="text-primary text-sm leading-relaxed font-medium">
                 Cada flor de este jardin esta basada en una experiencia o una emocion que necesito quitarme de encima. 
              </p>
            </div>
          </div>
        </div>
      </section>

{/* SECCIÓN CONTACTO INTEGRADA */}
      <section className="card-franilover relative">
        {enviado ? (
          <div className="text-center py-8 animate-in zoom-in duration-300">
            {/* Usamos un verde sólido y oscuro para éxito */}
            <p className="text-green-700 font-bold text-lg mb-2">✨ ¡Mensaje enviado con éxito!</p>
            <p className="text-primary font-semibold text-sm mb-6">Gracias por escribirme, te responderé pronto.</p>
            <button 
              onClick={() => setEnviado(false)}
              className="text-sm text-primary font-black underline hover:opacity-70"
            >
              Enviar otro mensaje
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-bold text-primary text-center mb-2 flex items-center justify-center gap-2">
                <Send size={20} /> Envíame un mensajito
              </h2>
              {/* Texto sólido sin opacidad para que no se vea blanco */}
              <p className="text-primary text-sm text-center italic font-bold">
                ¿Dudas, sugerencias o solo quieres saludar? (´｡• ᵕ •｡`) ♡
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  {/* Forzamos text-primary sólido en los labels */}
                  <label className="label-franilover font-bold text-primary">Nombre</label>
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="Tu nombre..." 
                    required 
                    className="input-franilover text-primary placeholder:text-primary/50 font-medium" 
                  />
                </div>
                
                <div className="flex flex-col">
                  <label className="label-franilover font-bold text-primary">Correo</label>
                  <input 
                    type="email" 
                    name="_replyto" 
                    placeholder="tu@correo.com" 
                    required 
                    className="input-franilover text-primary placeholder:text-primary/50 font-medium" 
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="label-franilover font-bold text-primary">Mensaje</label>
                <textarea 
                  name="message" 
                  placeholder="Escribe aquí lo que quieras..." 
                  required 
                  className="input-franilover min-h-[120px] resize-none text-primary placeholder:text-primary/50 font-medium"
                ></textarea>
              </div>

              <input type="hidden" name="_subject" value="¡Nuevo mensaje desde Franilover!" />

              {/* Botón con texto sólido y fuerte */}
              <button type="submit" disabled={loading} className="btn-franilover font-black text-white bg-primary hover:brightness-110 shadow-md">
                {loading ? 'Enviando...' : 'Enviar Mensaje'}
              </button>
            </form>
          </>
        )}
      </section>

    </div>
  );
}