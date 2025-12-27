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
        <h3 className="text-accent text-xl font-bold mb-4">¡Mensaje enviado con éxito!</h3>
        <p className="text-gray-600 mb-6">Gracias por tu sugerencia para Barrio Cultural.</p>
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
    <div className="flex flex-col items-center p-8">
            {/* LINK DE INSTAGRAM ABAJO */}
      <a 
        href="https://instagram.com/barriocultura_" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-lg text-primary hover:text-accent font-bold transition-colors flex items-center gap-2 mb-10"
      >
        <span>Sígenos en Instagram</span>
        <span className="text-sm">↗</span>
      </a>

      <section className="w-full max-w-[600px] mx-auto my-8 p-8 md:p-12 bg-stone-100/50 rounded-[15px] shadow-sm backdrop-blur-sm">
        <h2 className="text-primary text-center font-bold text-2xl mb-6">Envíame un mensajito</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-medium text-primary text-sm" htmlFor="message">Sugerencia</label>
            <textarea 
              className="text-neutral-800 p-3 border-2 border-transparent rounded-lg outline-none min-h-[150px] resize-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
              name="message" id="message" placeholder="Escribe aquí tu sugerencia" required
            ></textarea>
          </div>

          {/* Actualizado el asunto para el correo */}
          <input type="hidden" name="_subject" value="Nueva sugerencia: Barrio Cultural" />

          <button 
            type="submit" 
            className="bg-primary text-white p-4 rounded-lg font-bold transition-all hover:-translate-y-1 hover:brightness-110 active:translate-y-0"
          >
            Enviar Mensaje
          </button>
        </form>
      </section>


    </div>
  );
};

export default Contacto;