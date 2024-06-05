import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
//Loading .env variables
import { SERVER_DOMAIN } from "../config.cjs";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  //Redirecting connection to the server
  server: {
    proxy: {
      "/socket.io": {
        target: SERVER_DOMAIN,
        ws: true,
      },
      "/api": {
        target: SERVER_DOMAIN,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
