import { useEffect, useState } from "react";

// Define the 'BeforeInstallPromptEvent' interface
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPwa() {
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const installApp = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        setDeferredPrompt(null);
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
      });
    }
  };

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      const promptEvent = e as BeforeInstallPromptEvent; // Type assertion for the event
      promptEvent.preventDefault(); // Prevent the mini-infobar from appearing
      setDeferredPrompt(promptEvent); // Save the event for later use
      setIsInstallable(true); // Show the install button
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  return (
    <section className="mb-8">
      {isInstallable && (
        <div className="mt-4">
          <button
            onClick={installApp}
            className="bg-blue-500 text-white p-2 rounded"
          >
            📲 Install to home screen
          </button>
        </div>
      )}
    </section>
  );
}
