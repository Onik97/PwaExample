import React from "react";
import { HomeIcon, RefreshCwIcon } from "lucide-react"; // Icons for Home and Reload
import { Link } from "@tanstack/react-router";

export default function Footer() {
  const reloadApp = async () => {
    if (navigator.serviceWorker) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (let registration of registrations) {
        registration.unregister(); // Unregister the service worker
      }
      caches.keys().then((keyList) => {
        return Promise.all(keyList.map((key) => caches.delete(key))); // Clear the cache
      });
    }
    window.location.reload(); // Finally reload the page
  };

  return (
    <footer className="bg-gray-700 text-white p-4 fixed bottom-0 w-full flex justify-around">
      <Link to="/">
        <button className="flex flex-col items-center space-y-1 focus:outline-none">
          <HomeIcon size={24} />
          <span className="text-sm">Home</span>
        </button>
      </Link>

      <button
        onClick={reloadApp}
        className="flex flex-col items-center space-y-1 focus:outline-none"
      >
        <RefreshCwIcon size={24} />
        <span className="text-sm">Reload</span>
      </button>
    </footer>
  );
}
