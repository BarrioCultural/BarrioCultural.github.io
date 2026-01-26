const handleEnableNotifications = async () => {
    setStatus('loading');

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        alert("¡Necesitas permitir las notificaciones!");
        setStatus('error');
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });

      // --- IDENTIFICACIÓN HÍBRIDA (CON O SIN CUENTA) ---
      const { data: { user } } = await supabase.auth.getUser();
      
      const payload = {
        endpoint: pushSubscription.endpoint, // El ID real del dispositivo
        subscription_data: pushSubscription,
        email: user?.email || null, // Si no hay usuario, queda vacío
        created_at: new Date()
      };

      // Guardamos basándonos en el endpoint para evitar duplicados
      const { error } = await supabase
        .from('suscriptores')
        .upsert(payload, { onConflict: 'endpoint' });

      if (error) throw error;
      setStatus('success');

    } catch (err) {
      console.error("Error:", err);
      setStatus('error');
    }
  };