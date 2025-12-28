"use client";
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // Nuevo estado para el nombre
  const [isRegistering, setIsRegistering] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setMensaje('');

    if (isRegistering) {
      // REGISTRO
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          // Guardamos el username en los metadatos del usuario de Supabase
          data: { display_name: username } 
        }
      });

      if (error) {
        setMensaje(error.message);
      } else {
        // OPCIONAL: Insertar manualmente en la tabla perfiles si el trigger SQL no lo hace con el username
        if (data.user) {
          await supabase.from('perfiles').update({ username: username }).eq('id', data.user.id);
        }
        setMensaje('¡Revisa tu correo para confirmar la cuenta!');
      }
    } else {
      // LOGIN
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMensaje(error.message);
      else {
        setMensaje('¡Sesión iniciada!');
        router.push('/'); 
      }
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-bg-main px-4">
      <div className="w-full max-w-sm p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-primary mb-6 text-center">
          {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
        </h1>

        <form onSubmit={handleAuth} className="space-y-4">
          {/* CAMPO NOMBRE DE USUARIO (Solo se muestra en Registro) */}
          {isRegistering && (
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 bg-black/20 border border-white/10 rounded-lg text-white outline-none focus:border-primary/50 transition-all"
              required={isRegistering}
            />
          )}

          <input
            type="email"
            placeholder="Tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-black/20 border border-white/10 rounded-lg text-white outline-none focus:border-primary/50 transition-all"
            required
          />
          <input
            type="password"
            placeholder="Tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-black/20 border border-white/10 rounded-lg text-white outline-none focus:border-primary/50 transition-all"
            required
          />
          
          <button className="w-full py-3 bg-primary text-bg-main font-bold rounded-lg hover:opacity-90 transition-opacity">
            {isRegistering ? 'Registrarse' : 'Entrar'}
          </button>
        </form>

        {mensaje && <p className="mt-4 text-xs text-center text-primary/60 italic">{mensaje}</p>}

        <button 
          onClick={() => {
            setIsRegistering(!isRegistering);
            setMensaje('');
          }}
          className="w-full mt-6 text-xs text-primary/40 hover:text-primary transition-colors underline"
        >
          {isRegistering ? '¿Ya tienes cuenta? Entra aquí' : '¿No tienes cuenta? Regístrate'}
        </button>
      </div>
    </main>
  );
};

export default LoginPage;