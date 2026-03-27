import { signInWithPopup } from "firebase/auth";
import { getPostAuthRedirectPath } from "./use-auth-api";

const getApiBaseUrl = (rawBaseUrl: string) => {
  const trimmed = (rawBaseUrl || "").trim();

  if (!trimmed) {
    return "https://localhost:3000";
  }

  if (trimmed.startsWith("http://localhost:3000")) {
    return trimmed.replace("http://localhost:3000", "https://localhost:3000");
  }

  return trimmed;
};

type GoogleAuthResponse = {
  accessToken: string;
  user: {
    id: string;
    email: string;
    fullName: string | null;
    avatarUrl: string | null;
    provider: "EMAIL" | "GOOGLE";
  };
};

export const useGoogleAuth = () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = getApiBaseUrl(config.public.apiBaseUrl);
  const nuxtApp = useNuxtApp();

  const signInWithGoogle = async (): Promise<{ response: GoogleAuthResponse; redirectTo: string }> => {
    const auth = nuxtApp.$firebaseAuth;
    const provider = nuxtApp.$googleProvider;

    if (!auth || !provider) {
      throw new Error("Firebase auth is not initialized");
    }

    const credential = await signInWithPopup(auth, provider);
    const idToken = await credential.user.getIdToken();

    const response = await $fetch<GoogleAuthResponse>(`${apiBaseUrl}/auth/firebase`, {
      method: "POST",
      body: { idToken },
    });

    if (process.client) {
      localStorage.setItem("appchat_access_token", response.accessToken);
      localStorage.setItem("appchat_user", JSON.stringify(response.user));
    }

    return {
      response,
      redirectTo: getPostAuthRedirectPath(),
    };
  };

  return { signInWithGoogle };
};
