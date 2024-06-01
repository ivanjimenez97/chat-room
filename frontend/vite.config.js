import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
//Loading .env variables
import config from "../config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  //Redirecting connection to the server
  server: {
    proxy: {
      "/socket.io": {
        target: `${config.SERVER_DOMAIN}`,
        ws: true,
      },
    },
  },
});
