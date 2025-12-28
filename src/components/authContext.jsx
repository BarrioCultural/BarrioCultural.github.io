"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // Datos básicos de la cuenta (email, id)
  const [perfil, setPerfil] = useState(null);   // Datos de tu tabla (rol: admin, autor...)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Función para obtener el perfil desde tu tabla 'perfiles'
    const getPerfil = async (userId) => {
      const { data, error } = await supabase
        .from('perfiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (!error) setPerfil(data);
    };

    // 2. Revisar si hay una sesión activa al cargar la página
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) getPerfil(session.user.id);
      setLoading(false);
    });

    // 3. Escuchar cambios en el estado (Login, Logout, Registro)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        getPerfil(session.user.id);
      } else {
        setPerfil(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, perfil, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);