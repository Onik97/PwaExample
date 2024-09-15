import { createLazyFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createLazyFileRoute("/notificationpage")({
  component: NotificationPage,
});

function NotificationPage() {
  const [title, setTitle] = useState<string>("What PWA Can Do Today");
  const [description, setDescription] = useState<string>(
    "Hi, this is a notification"
  );
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [requireInteraction, setRequireInteraction] = useState<boolean>(false);

  useEffect(() => {
    if (Notification.permission === "granted") {
      setIsSubscribed(true);
    }
  }, []);

  const subscribe = () => {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        setIsSubscribed(true);
      } else {
        alert("Notification permission denied");
      }
    });
  };

  const unsubscribe = () => {
    setIsSubscribed(false);
  };

  const sendNotification = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;

      const notificationData = {
        title: title,
        body: description,
        requireInteraction: requireInteraction,
      };

      registration.showNotification(notificationData.title, {
        body: notificationData.body,
        icon: "/icon.png",
        requireInteraction: notificationData.requireInteraction,
      });
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">PWA Notification Demo</h1>

      <p className="mb-4">
        The "require interaction" checkbox will make the notification persistent
        on supporting devices, which means it will not disappear until the user
        interacts with it.
      </p>

      <div className="flex gap-2 mb-6">
        <Button onClick={subscribe} disabled={isSubscribed} variant="default">
          {isSubscribed ? "Subscribed" : "Subscribe"}
        </Button>
        <Button onClick={unsubscribe} disabled={!isSubscribed}>
          Unsubscribe
        </Button>
      </div>

      <h2 className="text-xl font-semibold mb-2">
        You can send a notification through the form below.
      </h2>

      <form className="space-y-4">
        <div>
          <Label htmlFor="title" className="block text-sm font-medium">
            Title
          </Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full"
          />
        </div>

        <div>
          <Label htmlFor="description" className="block text-sm font-medium">
            Notification
          </Label>
          <Input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            checked={requireInteraction}
            onCheckedChange={(checked) => setRequireInteraction(!!checked)}
          />
          <Label htmlFor="requireInteraction" className="text-sm font-medium">
            Require interaction
          </Label>
        </div>

        <Button
          onClick={sendNotification}
          type="button"
          variant="default"
          disabled={!isSubscribed}
        >
          Send
        </Button>
      </form>
    </div>
  );
}
