"use client";
import React, { useState } from 'react';
// Importamos los iconos de la librería correcta
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
          <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/20 mb-4 flex items-center justify-center">
            <Sparkles size={40} className="text-primary/40" />
          </div>
          <h2 className="text-2xl font-bold text-primary">Sobre Mi</h2>
          <p className="text-primary/60 italic text-sm">Dibujante y creador</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary flex items-center gap-2">
              <Heart size={18} /> Mi Pasión
            </h3>
            <p className="text-primary/80 leading-relaxed text-sm">
              Bienvenido a mi pequeño jardín digital <br />
              Me encanta compartir mi arte y conectar con personas que disfrutan de este.
            </p>
          </div>

          <div className="bg-white/20 rounded-2xl p-6 border border-primary/5">
            <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <Palette size={18} /> Herramientas
            </h3>
            <ul className="text-xs text-primary/70 space-y-2 font-medium">
              <li>✨ Linux y Krita</li>
              <li>🎨 Acuarelas y Acrílico</li>
              <li>☕ Mucha música</li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECCIÓN CONTACTO INTEGRADA */}
      <section className="card-franilover relative">
        {enviado ? (
          <div className="text-center py-8 animate-in zoom-in duration-300">
            <p className="text-green-500 font-medium text-lg mb-2">✨ ¡Mensaje enviado con éxito!</p>
            <p className="text-primary/60 text-sm mb-6">Gracias por escribirme, te responderé pronto.</p>
            <button 
              onClick={() => setEnviado(false)}
              className="text-sm text-primary font-bold underline hover:text-primary/80"
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
              <p className="text-primary/60 text-sm text-center italic">
                ¿Dudas, sugerencias o solo quieres saludar? (´｡• ᵕ •｡`) ♡
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="label-franilover">Nombre</label>
                  <input type="text" name="name" placeholder="Tu nombre..." required className="input-franilover" />
                </div>
                
                <div className="flex flex-col">
                  <label className="label-franilover">Correo</label>
                  <input type="email" name="_replyto" placeholder="tu@correo.com" required className="input-franilover" />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="label-franilover">Mensaje</label>
                <textarea 
                  name="message" 
                  placeholder="Escribe aquí lo que quieras..." 
                  required 
                  className="input-franilover min-h-[120px] resize-none"
                ></textarea>
              </div>

              <input type="hidden" name="_subject" value="¡Nuevo mensaje desde Franilover!" />

              <button type="submit" disabled={loading} className="btn-franilover">
                {loading ? 'Enviando...' : 'Enviar Mensaje'}
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}