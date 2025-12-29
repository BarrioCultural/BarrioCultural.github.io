"use client";
import React, { useState } from 'react';
import { X } from 'lucide-react';

const Contacto = () => {
  const [enviado, setEnviado] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const FORMSPREE_ID = "xvzpjdgr"; 

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    }
  };

  if (!isVisible) return null;

  return (
    // mt-24 le da la separación necesaria del menú superior
    <section className="max-w-2xl mx-auto mt-24 mb-16 px-4 relative group animate-in fade-in duration-700">
      <div className="bg-primary/5 border border-primary/10 rounded-3xl p-8 backdrop-blur-sm relative">
        
        {/* BOTÓN CERRAR */}
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-primary/40 hover:text-primary transition-colors"
          title="Cerrar"
        >
          <X size={20} /> 
        </button>

        {enviado ? (
          <div className="text-center py-8">
            <p className="text-green-500 font-medium text-lg mb-4">
              ✨ ¡Mensaje enviado con éxito!
            </p>
            <p className="text-primary/60 text-sm mb-6">Gracias por escribirme, te responderé pronto.</p>
            <button 
              onClick={() => setEnviado(false)}
              className="text-sm text-primary underline hover:text-primary/80"
            >
              Enviar otro mensaje
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-primary text-center mb-2">
              Envíame un mensajito
            </h2>
            <p className="text-primary/60 text-sm text-center mb-8">
              ¿Tienes alguna duda o solo quieres saludar? (´｡• ᵕ •｡`) ♡
            </p>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-primary/70 ml-1">Nombre</label>
                <input 
                  type="text" 
                  name="name"
                  placeholder="Ej: Pink Killer" 
                  required
                  className="w-full bg-bg-main border border-primary/20 rounded-xl px-4 py-3 text-primary focus:ring-2 focus:ring-primary/40 outline-none transition-all"
                />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-primary/70 ml-1">Correo</label>
                <input 
                  type="email" 
                  name="_replyto"
                  placeholder="tu@correo.com" 
                  required
                  className="w-full bg-bg-main border border-primary/20 rounded-xl px-4 py-3 text-primary focus:ring-2 focus:ring-primary/40 outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-primary/70 ml-1">Mensaje</label>
                <textarea 
                  name="message"
                  placeholder="Escribe aquí lo que quieras..." 
                  required
                  className="w-full bg-bg-main border border-primary/20 rounded-xl px-4 py-3 text-primary focus:ring-2 focus:ring-primary/40 outline-none transition-all min-h-[150px] resize-none"
                ></textarea>
              </div>

              <input type="hidden" name="_subject" value="¡Nuevo mensaje desde Franilover!" />

              <button 
                type="submit" 
                className="bg-primary text-white font-bold px-8 py-4 rounded-xl hover:scale-105 active:scale-95 transition-all mt-2 shadow-lg shadow-primary/10"
              >
                Enviar Mensaje
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
};

export default Contacto;