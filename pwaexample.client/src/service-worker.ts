self.addEventListener("push", function (event: PushEvent) {
  const data = event.data?.json();

  const options: NotificationOptions = {
    body: data.body,
    icon: "/icon.png",
    requireInteraction: data.requireInteraction,
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});
