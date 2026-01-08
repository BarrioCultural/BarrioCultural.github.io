"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { X } from 'lucide-react'; // Si no tienes lucide-react, puedes usar una "X" de texto

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [isVisible, setIsVisible] = useState(true); // Estado para mostrar/ocultar

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    const { error } = await supabase
      .from('suscriptores')
      .insert([{ email }]);

    if (error) {
      setStatus('error');
    } else {
      setStatus('success');
      setEmail("");
    }
  };

  // Si el usuario le dio a la X, no renderizamos nada
  if (!isVisible) return null;

  return (
    <div className="max-w-2xl mx-auto mb-16 px-4 relative group">
      <div className="bg-primary/5 border border-primary/10 rounded-3xl p-8 backdrop-blur-sm relative">
        
        {/* 🟢 BOTÓN PARA QUITAR EL FORMULARIO */}
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-primary/40 hover:text-primary transition-colors"
          title="Cerrar"
        >
          <X size={20} /> 
        </button>

        {status === 'success' ? (
          <div className="text-center py-4">
            <p className="text-green-500 font-medium text-lg mb-2">
              ✨ ¡Gracias! Ya estás en la lista.
            </p>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-sm text-primary/60 underline hover:text-primary"
            >
              Cerrar este mensaje
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-primary text-center mb-2">
              ¿Quieres saber cuando suba nuevos dibujos?
            </h2>
            <p className="text-primary/60 text-sm text-center mb-6">
              Porfavor nadie ve mi arte :C 
            </p>
            
            <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Tu email..." 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-bg-main border border-primary/20 rounded-xl px-4 py-3 text-primary focus:ring-2 focus:ring-primary/40 outline-none transition-all"
              />
              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="bg-primary text-bg-main font-bold px-8 py-3 rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                {status === 'loading' ? 'Anotando...' : '¡Suscribirme!'}
              </button>
            </form>
          </>
        )}

        {status === 'error' && (
          <p className="text-center text-red-500 mt-4 text-sm">
            ❌ Algo salió mal, intenta de nuevo.
          </p>
        )}
      </div>
    </div>
  );
}