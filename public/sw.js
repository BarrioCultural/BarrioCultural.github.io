self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : { 
    title: "¡Nuevo dibujo!", 
    body: "Pasa por el Atelier para ver lo nuevo." 
  };

  const options = {
    body: data.body,
    icon: "/icon-192x192.png", // Asegúrate de que este archivo exista
    badge: "/badge.png",       // Icono pequeño para la barra de estado
    vibrate: [100, 50, 100],
    data: {
      url: "/" // URL a la que irá al hacer clic
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});