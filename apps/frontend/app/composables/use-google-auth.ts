import { signInWithPopup } from "firebase/auth";
import { getPostAuthRedirectPath } from "./use-auth-api";

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
  const nuxtApp = useNuxtApp();

  const signInWithGoogle = async (): Promise<{ response: GoogleAuthResponse; redirectTo: string }> => {
    const auth = nuxtApp.$firebaseAuth;
    const provider = nuxtApp.$googleProvider;

    if (!auth || !provider) {
      throw new Error("Firebase auth is not initialized");
    }

    const credential = await signInWithPopup(auth, provider);
    const idToken = await credential.user.getIdToken();

    const response = await $fetch<GoogleAuthResponse>(`${config.public.apiBaseUrl}/auth/firebase`, {
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
