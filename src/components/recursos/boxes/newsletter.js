"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { X, Bell, BellRing, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Función para convertir la Public Key
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
};

export default function Newsletter() {
  const [status, setStatus] = useState(null); // 'loading', 'success', 'error'
  const [isVisible, setIsVisible] = useState(true);

  // 1. Al cargar, verificar si ya está suscrito
  useEffect(() => {
    const checkStatus = async () => {
      if ("serviceWorker" in navigator) {
        try {
          // Registrar el Service Worker
          const registration = await navigator.serviceWorker.register("/sw.js");
          console.log("Service Worker listo");

          // Verificar si ya existe una suscripción activa en este navegador
          const subscription = await registration.pushManager.getSubscription();
          if (subscription) {
            setStatus('success'); // Si existe, ya no mostramos el botón de activar
          }
        } catch (err) {
          console.error("Error al inicializar SW:", err);
        }
      }
    };
    checkStatus();
  }, []);

  const handleEnableNotifications = async () => {
    setStatus('loading');

    try {
      // 1. Pedir permiso
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        alert("¡Necesitas permitir las notificaciones en tu navegador!");
        setStatus('error');
        return;
      }

      // 2. Obtener suscripción
      const registration = await navigator.serviceWorker.ready;
      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });

      // 3. Obtener el email real de la tabla 'perfiles'
      const { data: { user } } = await supabase.auth.getUser();
      let userIdentifier = "visitante_anonimo";

      if (user) {
        const { data: perfil } = await supabase
          .from('perfiles')
          .select('email')
          .eq('id', user.id)
          .single();
        
        userIdentifier = perfil?.email || user.email;
      }

      // 4. Guardar en Supabase con UPSERT
      const { error } = await supabase
        .from('suscriptores')
        .upsert(
          { 
            email: userIdentifier, 
            subscription_data: pushSubscription,
            created_at: new Date()
          }, 
          { onConflict: 'email' }
        );

      if (error) throw error;

      setStatus('success');
    } catch (err) {
      console.error("Error al suscribir:", err);
      setStatus('error');
    }
  };

  // Si ya tuvo éxito, o el usuario cerró el banner, no mostramos nada
  if (status === 'success' || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="max-w-2xl mx-auto mb-20 px-4 relative group"
      >
        <div className="card-main !bg-white/60 backdrop-blur-md p-10 md:p-14 relative overflow-hidden border-primary/10">
          
          <Bell className="absolute -bottom-4 -right-4 text-primary/5 -rotate-12" size={120} />
          
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-6 right-6 text-primary/30 hover:text-primary transition-all hover:rotate-90"
          >
            <X size={20} /> 
          </button>

          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-black uppercase italic text-primary tracking-tighter leading-none mb-4">
              "¿Quieres ver <br /> nuevos dibujos?"
            </h2>
            <div className="h-1 w-12 bg-primary/20 mx-auto rounded-full mb-6" />
            <p className="text-primary/50 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-10">
              "Activa las notificaciones para no perderte nada del Atelier"
            </p>
            
            <button 
              onClick={handleEnableNotifications}
              disabled={status === 'loading'}
              className="btn-brand w-full md:w-auto px-16 py-5 flex items-center justify-center gap-3 mx-auto text-lg"
            >
              <BellRing size={20} className={status === 'loading' ? 'animate-bounce' : ''} />
              {status === 'loading' ? 'Configurando...' : 'Activar Notificaciones'}
            </button>
          </div>

          {status === 'error' && (
            <p className="text-center text-red-500 mt-6 text-[10px] font-black uppercase tracking-widest">
              "❌ Error al configurar. Inténtalo de nuevo."
            </p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}