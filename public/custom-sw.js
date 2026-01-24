import { precacheAndRoute } from 'workbox-precaching';

// 1. INYECCIÓN DE MANIFIESTO (Obligatorio para next-pwa)
// Esta línea permite que la librería gestione el modo offline y el caché.
precacheAndRoute(self.__WB_MANIFEST);

// 2. EVENTO DE INSTALACIÓN
self.addEventListener('install', (event) => {
  console.log('SW: Instalando y saltando espera...');
  self.skipWaiting();
});

// 3. EVENTO DE ACTIVACIÓN
self.addEventListener('activate', (event) => {
  console.log('SW: Activado y reclamando clientes...');
  event.waitUntil(clients.claim());
});

// 4. EVENTO PUSH (Recibir la notificación con imagen)
self.addEventListener('push', function(event) {
  console.log('SW: Señal Push recibida');
  
  if (event.data) {
    try {
      const data = event.data.json();
      
      const options = {
        body: data.body,
        icon: '/icon.png',    // Tu logo
        badge: '/icon.png',   // Icono pequeño de la barra de estado
        image: data.image,    // <--- LA MINIATURA DEL DIBUJO
        vibrate: [100, 50, 100],
        data: {
          url: data.url || '/'
        }
      };

      event.waitUntil(
        self.registration.showNotification(data.title, options)
      );
    } catch (e) {
      console.error('Error al parsear el JSON de la notificación:', e);
    }
  }
});

// 5. EVENTO CLICK (Abrir o enfocar la web)
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  const targetUrl = event.notification.data.url;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // Si ya hay una pestaña abierta con nuestra web, la enfocamos
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      // Si no hay ninguna abierta, abrimos una nueva
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});