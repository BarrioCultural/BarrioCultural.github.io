// public/sw.js
self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  
  const options = {
    body: data.body || '¡Mira lo nuevo que he subido!',
    icon: '/icon.png', // Asegúrate de que esta ruta sea válida
    badge: '/icon.png', // Icono pequeño en la barra de estado
    vibrate: [100, 50, 100],
    data: {
      url: '/' // URL a la que irá al hacer clic
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Atelier Virtual', options)
  );
});

// Abrir la app al hacer clic en la notificación
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});