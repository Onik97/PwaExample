import Footer from "@/components/footer";
import ServiceWorkerStatus from "@/components/serviceWorkerStatus";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <ServiceWorkerStatus />
      <Outlet />
      <TanStackRouterDevtools />
      <Footer />
    </>
  ),
});
