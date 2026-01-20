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
      <section className="card-franilover md:p-12 bg-white shadow-sm border border-pink-100">
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 rounded-full bg-pink-50 border-2 border-pink-200 mb-4 flex items-center justify-center">
            {/* Color más sólido para el icono */}
            <Sparkles size={40} className="text-pink-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Sobre Mi</h2>
          <p className="text-pink-600 italic text-sm font-medium">Dibujante y creador</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Heart size={18} className="text-pink-500" /> Mi Pasión
            </h3>
            {/* Cambiado a text-gray-700 para máxima legibilidad */}
            <p className="text-gray-700 leading-relaxed text-sm">
              Bienvenido a mi pequeño jardín digital. <br />
              Me encanta compartir mi arte y conectar con personas que disfrutan de este proceso creativo.
            </p>
          </div>

          <div className="bg-pink-50/50 rounded-2xl p-6 border border-pink-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Palette size={18} className="text-pink-500" /> Herramientas
            </h3>
            {/* Eliminada la opacidad excesiva de la lista */}
            <ul className="text-sm text-gray-700 space-y-2 font-medium">
              <li className="flex items-center gap-2">✨ Linux y Krita</li>
              <li className="flex items-center gap-2">🎨 Acuarelas y Acrílico</li>
              <li className="flex items-center gap-2">☕ Mucha música</li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECCIÓN CONTACTO */}
      <section className="card-franilover relative bg-white border border-pink-100">
        {enviado ? (
          <div className="text-center py-8 animate-in zoom-in duration-300">
            <p className="text-green-600 font-bold text-lg mb-2">✨ ¡Mensaje enviado con éxito!</p>
            <p className="text-gray-700 text-sm mb-6">Gracias por escribirme, te responderé pronto.</p>
            <button 
              onClick={() => setEnviado(false)}
              className="text-sm text-pink-600 font-bold underline hover:text-pink-700"
            >
              Enviar otro mensaje
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 text-center mb-2 flex items-center justify-center gap-2">
                <Send size={20} className="text-pink-500" /> Envíame un mensajito
              </h2>
              <p className="text-gray-600 text-sm text-center italic">
                ¿Dudas, sugerencias o solo quieres saludar? (´｡• ᵕ •｡`) ♡
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-bold text-gray-700 mb-1 ml-1">Nombre</label>
                  <input type="text" name="name" placeholder="Tu nombre..." required className="input-franilover border-gray-300 text-gray-800 focus:border-pink-400 focus:ring-pink-400" />
                </div>
                
                <div className="flex flex-col">
                  <label className="text-sm font-bold text-gray-700 mb-1 ml-1">Correo</label>
                  <input type="email" name="_replyto" placeholder="tu@correo.com" required className="input-franilover border-gray-300 text-gray-800" />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-bold text-gray-700 mb-1 ml-1">Mensaje</label>
                <textarea 
                  name="message" 
                  placeholder="Escribe aquí lo que quieras..." 
                  required 
                  className="input-franilover min-h-[120px] resize-none border-gray-300 text-gray-800"
                ></textarea>
              </div>

              <input type="hidden" name="_subject" value="¡Nuevo mensaje desde Franilover!" />

              <button type="submit" disabled={loading} className="btn-franilover bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-xl transition-colors shadow-md disabled:bg-gray-400">
                {loading ? 'Enviando...' : 'Enviar Mensaje'}
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}