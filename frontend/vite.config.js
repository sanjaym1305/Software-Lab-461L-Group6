import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "https://softwarelabgroup6l-41bc8282f2ee.herokuapp.com",
        changeOrigin: true,
      },
    },
  },
});
