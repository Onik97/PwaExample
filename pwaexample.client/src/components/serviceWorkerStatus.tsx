import { useEffect, useState } from "react";

export default function ServiceWorkerStatus() {
  const [swStatus, setSwStatus] = useState<string | null>(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const swFile = import.meta.env.DEV
        ? "/registerSW.js" // Development service worker
        : "/sw.js"; // Production service worker

      navigator.serviceWorker.register(swFile).then(
        () => {
          setSwStatus("Service Worker registered successfully!");
        },
        (error) => {
          setSwStatus(
            `Service Worker registration failed. Reason -> ${error.message}`
          );
        }
      );
    }
  }, []);

  return (
    <>
      {swStatus && (
        <div
          className={`p-4 ${
            swStatus.includes("successfully") ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {swStatus}
        </div>
      )}
    </>
  );
}
