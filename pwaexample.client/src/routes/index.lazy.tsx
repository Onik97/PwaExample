import InstallPwa from "@/components/installpwa";
import { createLazyFileRoute, Link } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">What PWA Can Do Today</h1>
        <p className="text-lg mt-2">
          A showcase of what is possible with Progressive Web Apps today. A
          Progressive Web App (PWA) is a website that can be installed on your
          device and provide an app-like experience.
        </p>
      </header>

      <InstallPwa />

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Features</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Notifications Feature */}
          <Link to="/notificationpage">
            <div className="bg-gray-800 p-6 rounded-md">
              <h3 className="text-xl font-bold mb-2">🔔 Notifications</h3>
              <p>
                The Notifications API allows web apps to display notifications,
                even when the app is not active.
              </p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
