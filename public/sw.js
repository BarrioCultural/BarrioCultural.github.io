// public/sw.js
self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  
  const options = {
    body: data.body || '¡Nueva actualización!',
    icon: '/icon.png',
    badge: '/icon.png',
    vibrate: [100, 50, 100],
    data: { url: '/' }
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Atelier Virtual', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});