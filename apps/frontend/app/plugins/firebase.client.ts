import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, browserLocalPersistence, setPersistence, type Auth } from "firebase/auth";

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig();

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    appId: config.public.firebaseAppId,
    storageBucket: config.public.firebaseStorageBucket || undefined,
    messagingSenderId: config.public.firebaseMessagingSenderId || undefined,
  };

  const app: FirebaseApp = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
  const auth: Auth = getAuth(app);
  await setPersistence(auth, browserLocalPersistence);

  const googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: "select_account" });

  nuxtApp.provide("firebaseAuth", auth);
  nuxtApp.provide("googleProvider", googleProvider);
});
