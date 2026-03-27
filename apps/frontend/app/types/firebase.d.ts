import type { Auth, GoogleAuthProvider } from "firebase/auth";

declare module "#app" {
  interface NuxtApp {
    $firebaseAuth: Auth;
    $googleProvider: GoogleAuthProvider;
  }
}

export {};
