"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { X, Mail, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

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

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="max-w-2xl mx-auto mb-20 px-4 relative group"
      >
        <div className="card-main !bg-white/60 backdrop-blur-md p-10 md:p-14 relative overflow-hidden border-primary/10">
          
          {/* Decoración de fondo sutil */}
          <Mail className="absolute -bottom-4 -right-4 text-primary/5 -rotate-12" size={120} />
          
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-6 right-6 text-primary/30 hover:text-primary transition-all hover:rotate-90"
            title="Cerrar"
          >
            <X size={20} /> 
          </button>

          {status === 'success' ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="text-center py-6"
            >
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="text-primary" size={30} />
              </div>
              <h3 className="text-2xl font-black uppercase italic text-primary tracking-tighter mb-2">
                ¡Registro Completado!
              </h3>
              <p className="text-primary/60 text-sm font-medium mb-8 uppercase tracking-widest">
                Ahora eres parte del jardín.
              </p>
              <button 
                onClick={() => setIsVisible(false)}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 hover:text-primary underline decoration-2 underline-offset-4 transition-all"
              >
                Cerrar este mensaje
              </button>
            </motion.div>
          ) : (
            <>
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-black uppercase italic text-primary tracking-tighter leading-none mb-4">
                  ¿Quieres ver <br /> nuevos dibujos?
                </h2>
                <div className="h-1 w-12 bg-primary/20 mx-auto rounded-full mb-4" />
                <p className="text-primary/50 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
                  Únete para recibir actualizaciones del Atelier
                </p>
              </div>
              
              <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-3 relative z-10">
                <input 
                  type="email" 
                  placeholder="tu@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-brand !bg-white/80"
                />
                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="btn-brand whitespace-nowrap px-10"
                >
                  {status === 'loading' ? 'Anotando...' : 'Suscribirse'}
                </button>
              </form>
            </>
          )}

          {status === 'error' && (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-center text-red-500 mt-6 text-[10px] font-black uppercase tracking-widest"
            >
              ❌ Error: Quizás ya estás suscrito o hubo un fallo.
            </motion.p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}