import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
import { env } from "process";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

const target = env.ASPNETCORE_HTTPS_PORT
  ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}`
  : env.ASPNETCORE_URLS
    ? env.ASPNETCORE_URLS.split(";")[0]
    : "http://localhost:5129";

export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true, // Enable PWA during development
        type: "module", // Ensure the service worker is treated as a module (ESM)
        navigateFallback: "/index.html", // Fallback for SPA
      },
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "favicon.svg"],
      manifest: {
        name: "PWA Example App",
        short_name: "ExampleApp",
        description: "PWA Example App description",
        display: "standalone",
        theme_color: "#ffffff",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "^/api": {
        target,
        secure: false,
      },
    },
    port: 5129,
  },
  build: {
    outDir: path.resolve(__dirname, "../PwaExample.Server/wwwroot"),
    emptyOutDir: true,
  },
});
