"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { X, Bell, BellRing, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Función para convertir la Public Key de VAPID
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
};

export default function NotificationBadge() {
  const [status, setStatus] = useState(null); // 'loading', 'success', 'error'
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js")
        .catch((err) => console.error("Error registrando SW:", err));
    }
  }, []);

  const handleEnableNotifications = async () => {
    setStatus('loading');

    try {
      // 1. Solicitar permiso al sistema (Android/Navegador)
      const permission = await Notification.requestPermission();
      
      if (permission !== 'granted') {
        setStatus('error');
        return;
      }

      // 2. Obtener la suscripción push
      const registration = await navigator.serviceWorker.ready;
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array("BG-LnxDWcr_4PGYVPdRr_L4qAnvgSGsc18-NAZR23bz4O1MmV8SEsV8ew_RlvEaSKPjN3mS9LI4wa-96-dWPKIY")
      });

      // 3. Guardar en la tabla 'suscriptores' (dejando email como null)
      const { error } = await supabase
        .from('suscriptores')
        .insert([{ 
          subscription_data: pushSubscription 
        }]);

      if (error) throw error;

      setStatus('success');
    } catch (err) {
      console.error("Error:", err);
      setStatus('error');
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
          
          <Bell className="absolute -bottom-4 -right-4 text-primary/5 -rotate-12" size={120} />
          
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-6 right-6 text-primary/30 hover:text-primary transition-all hover:rotate-90"
          >
            <X size={20} /> 
          </button>

          {status === 'success' ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="text-primary" size={30} />
              </div>
              <h3 className="text-2xl font-black uppercase italic text-primary tracking-tighter mb-2">
                "¡Avisos Activados!"
              </h3>
              <p className="text-primary/60 text-sm font-medium mb-8 uppercase tracking-widest">
                "Recibirás una notificación cuando suba arte nuevo."
              </p>
              <button 
                onClick={() => setIsVisible(false)}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 hover:text-primary underline decoration-2 underline-offset-4 transition-all"
              >
                "Cerrar"
              </button>
            </motion.div>
          ) : (
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-black uppercase italic text-primary tracking-tighter leading-none mb-4">
                "¿Te aviso cuando <br /> haya dibujos?"
              </h2>
              <div className="h-1 w-12 bg-primary/20 mx-auto rounded-full mb-6" />
              <p className="text-primary/50 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-10">
                "Activa las notificaciones para no perderte nada del Atelier"
              </p>
              
              <button 
                onClick={handleEnableNotifications}
                disabled={status === 'loading'}
                className="btn-brand w-full md:w-auto px-16 py-5 flex items-center justify-center gap-3 mx-auto text-lg shadow-xl hover:shadow-primary/20 transition-all"
              >
                <BellRing size={20} className={status === 'loading' ? 'animate-bounce' : ''} />
                {status === 'loading' ? 'Configurando...' : 'Activar Notificaciones'}
              </button>
            </div>
          )}

          {status === 'error' && (
            <p className="text-center text-red-500 mt-6 text-[10px] font-black uppercase tracking-widest">
              "❌ Error: Asegúrate de dar permiso en tu navegador o móvil."
            </p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}