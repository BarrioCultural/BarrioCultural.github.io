"use client";
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); 
  const [isRegistering, setIsRegistering] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setMensaje('');
    setLoading(true);

    try {
      if (isRegistering) {
        const { data, error } = await supabase.auth.signUp({ 
          email, password,
          options: { data: { display_name: username }, emailRedirectTo: window.location.origin }
        });
        if (error) throw error;
        if (data.user) {
          await supabase.from('perfiles').upsert({ id: data.user.id, nombre: username });
          setMensaje('¡Revisa tu correo para confirmar!');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setMensaje(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#EBEBEB] px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md card-franilover bg-white shadow-2xl"
      >
        <h1 className="text-3xl font-black italic text-[#6B5E70] uppercase tracking-tighter text-center mb-8">
          {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
        </h1>

        <form onSubmit={handleAuth} className="space-y-4">
          <AnimatePresence mode="popLayout">
            {isRegistering && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                <label className="label-franilover">NOMBRE DE USUARIO</label>
                <input
                  type="text"
                  placeholder="Tu apodo..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-franilover"
                  required
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="label-franilover">EMAIL</label>
            <input
              type="email"
              placeholder="nombre@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-franilover"
              required
            />
          </div>

          <div>
            <label className="label-franilover">CONTRASEÑA</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-franilover"
              required
            />
          </div>
          
          <button disabled={loading} className="btn-franilover w-full mt-4 uppercase text-xs tracking-widest">
            {loading ? 'Procesando...' : isRegistering ? 'Registrarse' : 'Entrar'}
          </button>
        </form>

        {mensaje && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-[10px] text-center text-[#6B5E70] font-black uppercase italic">
            {mensaje}
          </motion.p>
        )}

        <button 
          onClick={() => { setIsRegistering(!isRegistering); setMensaje(''); }}
          className="w-full mt-8 text-[10px] font-black uppercase tracking-widest text-[#6B5E70]/40 hover:text-[#6B5E70] transition-colors underline decoration-2 underline-offset-4"
        >
          {isRegistering ? '¿Ya tienes cuenta? Entra aquí' : '¿No tienes cuenta? Regístrate'}
        </button>
      </motion.div>
    </main>
  );
}