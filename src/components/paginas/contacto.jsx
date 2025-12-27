"use client";
import React, { useState } from 'react';

const Contacto = () => {
  const [enviado, setEnviado] = useState(false);
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

  if (enviado) {
    return (
      <div className="max-w-[600px] mx-auto my-8 p-12 bg-white rounded-[15px] shadow-sm text-center animate-in fade-in zoom-in duration-500">
        <h3 className="text-[#ff0066] text-xl font-bold mb-4">¡Mensaje enviado con éxito! 💖</h3>
        <p className="text-gray-600 mb-6">Gracias por escribirme, te responderé pronto.</p>
        <button 
          onClick={() => setEnviado(false)}
          className="px-6 py-2 border-2 border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-all duration-300"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    // 'seccion-contacto' convertida
    <section className="max-w-[600px] mx-auto my-8 p-8 md:p-12 bg-stone-100/50 rounded-[15px] shadow-sm backdrop-blur-sm">
      <h2 className="text-primary text-center font-bold text-2xl mb-6">Envíame un mensajito</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Campo Nombre */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-primary text-sm" htmlFor="full-name">Nombre completo</label>
          <input 
            className="p-3 border-2 border-transparent rounded-lg outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
            type="text" name="name" id="full-name" placeholder="Ej: Pink Killer" required 
          />
        </div>

        {/* Campo Email */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-primary text-sm" htmlFor="email-address">Correo</label>
          <input 
            className="p-3 border-2 border-transparent rounded-lg outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
            type="email" name="_replyto" id="email-address" placeholder="tu@correo.com" required 
          />
        </div>

        {/* Campo Mensaje */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-primary text-sm" htmlFor="message">Mensaje</label>
          <textarea 
            className="p-3 border-2 border-transparent rounded-lg outline-none min-h-[150px] resize-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
            name="message" id="message" placeholder="Escribe aquí lo que quieras..." required
          ></textarea>
        </div>

        <input type="hidden" name="_subject" value="¡Nuevo mensaje desde Franilover!" />

        {/* Botón Enviar */}
        <button 
          type="submit" 
          className="bg-primary text-white p-4 rounded-lg font-bold transition-all hover:-translate-y-1 hover:brightness-110 active:translate-y-0"
        >
          Enviar Mensaje
        </button>
      </form>
    </section>
  );
};

export default Contacto;