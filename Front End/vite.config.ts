import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      // Proxy all API requests to Flask backend
      "/api": {
        target: "http://127.0.0.1:5000", // Flask backend
        changeOrigin: true, // Ensure the origin header matches the target
        secure: false, // Disable SSL verification for local development
      },
    },
  },
});
