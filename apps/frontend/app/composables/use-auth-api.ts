type AuthUser = {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  provider: "EMAIL" | "GOOGLE";
};

type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};

type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

const TOKEN_KEY = "appchat_access_token";
const USER_KEY = "appchat_user";
const WORKSPACE_KEY = "appchat_workspace";

const persistAuth = (payload: AuthResponse) => {
  if (!process.client) {
    return;
  }

  localStorage.setItem(TOKEN_KEY, payload.accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
};

export const getPostAuthRedirectPath = () => {
  if (!process.client) {
    return "/workspace/create";
  }

  const workspace = localStorage.getItem(WORKSPACE_KEY);
  return workspace ? "/app" : "/workspace/create";
};

export const useAuthApi = () => {
  const config = useRuntimeConfig();

  const registerWithEmail = async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await $fetch<AuthResponse>(`${config.public.apiBaseUrl}/auth/register`, {
      method: "POST",
      body: payload,
    });
    persistAuth(response);
    return response;
  };

  const loginWithEmail = async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await $fetch<AuthResponse>(`${config.public.apiBaseUrl}/auth/login`, {
      method: "POST",
      body: payload,
    });
    persistAuth(response);
    return response;
  };

  const logout = () => {
    if (!process.client) {
      return;
    }

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  return {
    registerWithEmail,
    loginWithEmail,
    logout,
  };
};
