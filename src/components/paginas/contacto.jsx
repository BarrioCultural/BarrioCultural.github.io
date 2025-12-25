"use client"; // <--- ESTA LÍNEA ES LA CLAVE
import React, { useState } from 'react';

const Contacto = () => {
  const [enviado, setEnviado] = useState(false);

  // Tu ID de Formspree ya está aquí
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
        alert("Hubo un error al enviar el mensaje. Inténtalo de nuevo.");
      }
    } catch (error) {
      alert("Error de conexión. Revisa tu internet.");
    }
  };

  if (enviado) {
    return (
      <div className="mensaje-exito">
        <h3>¡Mensaje enviado con éxito! 💖</h3>
        <p>Gracias por escribirme, te responderé pronto.</p>
        <button onClick={() => setEnviado(false)}>Enviar otro mensaje</button>
      </div>
    );
  }

  return (
    <section className="seccion-contacto">
      <h2>Envíame un mensajito</h2>
      <form onSubmit={handleSubmit} className="formulario">
        <div className="campo">
          <label htmlFor="full-name">Nombre completo</label>
          <input 
            type="text" 
            name="name" 
            id="full-name" 
            placeholder="Ej: Pink Killer" 
            required 
          />
        </div>

        <div className="campo">
          <label htmlFor="email-address">Opcional</label>
          <input 
            type="email" 
            name="_replyto" 
            id="email-address" 
            placeholder="tu@correo.com" 
            required 
          />
        </div>

        <div className="campo">
          <label htmlFor="message">Mensaje</label>
          <textarea 
            name="message" 
            id="message" 
            placeholder="Escribe aquí lo que quieras..." 
            required
          ></textarea>
        </div>

        {/* Campo oculto para evitar spam */}
        <input type="hidden" name="_subject" value="¡Nuevo mensaje desde Franilover!" />

        <button type="submit" className="btn-enviar">
          Enviar Mensaje
        </button>
      </form>
    </section>
  );
};

export default Contacto;