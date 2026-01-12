"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Obtener sesión activa
    const setData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        await cargarPerfil(session.user.id);
      }
      setLoading(false);
    };

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        cargarPerfil(session.user.id);
      } else {
        setPerfil(null);
      }
      setLoading(false);
    });

    setData();
    return () => listener.subscription.unsubscribe();
  }, []);

  // Función para traer el nombre real desde la tabla perfiles
  const cargarPerfil = async (userId) => {
    const { data, error } = await supabase
      .from('perfiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (!error && data) {
      setPerfil(data);
    }
  };

  return (
    <AuthContext.Provider value={{ user, perfil, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);