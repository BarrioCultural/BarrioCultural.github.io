"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPerfil = async (userId, userEmail) => {
    try {
      const { data, error } = await supabase
        .from('perfiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data && data.nombre) {
        setPerfil(data);
      } else {
        // AUTO-CORRECCIÓN: Si el usuario no tiene perfil, le creamos uno básico
        const nombreAuto = userEmail ? userEmail.split('@')[0] : "Usuario";
        const nuevoPerfil = { id: userId, nombre: nombreAuto };
        
        await supabase.from('perfiles').upsert(nuevoPerfil);
        setPerfil(nuevoPerfil);
      }
    } catch (err) {
      console.error("Error al cargar perfil:", err);
    }
  };

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchPerfil(session.user.id, session.user.email);
      }
      setLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchPerfil(session.user.id, session.user.email);
      } else {
        setUser(null);
        setPerfil(null);
      }
      setLoading(false);
    });

    getInitialSession();
    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, perfil, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);