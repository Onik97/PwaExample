self.addEventListener("push", (event: PushEvent) => {
  const data = event.data ? event.data.json() : {};

  const options: NotificationOptions = {
    body: data.body || "Default body content",
    icon: "/pwa-192x192.png",
    badge: "/pwa-192x192.png",
    data: {
      url: data.url || "/",
    },
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "Default title", options)
  );
});

self.addEventListener("notificationclick", (event: NotificationEvent) => {
  const notification = event.notification;
  notification.close();

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList: readonly WindowClient[]) => {
        const mutableClientList = Array.from(clientList);

        if (mutableClientList.length > 0) {
          const client = mutableClientList[0];
          return client.focus();
        }
        return clients.openWindow(notification.data.url);
      })
  );
});
