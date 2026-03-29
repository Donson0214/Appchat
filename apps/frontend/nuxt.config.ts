import mkcert from "vite-plugin-mkcert";
import { join } from "node:path";
import { homedir } from "node:os";

const mkcertDir = join(homedir(), ".vite-plugin-mkcert");
const keyPath = join(mkcertDir, "dev.pem");
const certPath = join(mkcertDir, "cert.pem");

export default defineNuxtConfig({
  compatibilityDate: "2026-03-27",
  components: [
    {
      path: "~/app/components",
      pathPrefix: false,
    },
  ],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL ?? "https://localhost:3000",
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY ?? "",
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
      firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID ?? "",
      firebaseStorageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
      firebaseMessagingSenderId:
        process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
    },
  },
  devServer: {
    host: "localhost",
    port: 3001,
    https: {
      key: keyPath,
      cert: certPath,
    },
  },
  vite: {
    plugins: [mkcert()],
  },
  css: [
    "@fontsource/dm-sans/400.css",
    "@fontsource/dm-sans/500.css",
    "@fontsource/dm-sans/600.css",
    "@fontsource/dm-sans/700.css",
    "~/assets/css/main.css",
  ],
  modules: ["@nuxtjs/tailwindcss"],
});
