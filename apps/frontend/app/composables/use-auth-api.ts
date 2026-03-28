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
  phoneNumber?: string;
  otpCode?: string;
};

type LoginPayload = {
  email: string;
  password: string;
  phoneNumber?: string;
  otpCode?: string;
};

type OtpPurpose = "REGISTER" | "LOGIN";

type SendOtpPayload = {
  phoneNumber: string;
  purpose: OtpPurpose;
};

const TOKEN_KEY = "appchat_access_token";
const USER_KEY = "appchat_user";
const WORKSPACE_KEY = "appchat_workspace";

const getApiBaseUrl = (rawBaseUrl: string) => {
  const trimmed = (rawBaseUrl || "").trim();

  if (!trimmed) {
    return "https://localhost:3000";
  }

  // Guard against stale env/runtime using HTTP while backend is HTTPS.
  if (trimmed.startsWith("http://localhost:3000")) {
    return trimmed.replace("http://localhost:3000", "https://localhost:3000");
  }

  return trimmed;
};

const persistAuth = (payload: AuthResponse) => {
  if (!process.client) {
    return;
  }

  localStorage.setItem(TOKEN_KEY, payload.accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
};

export const resolvePostAuthRedirectPath = async (): Promise<string> => {
  if (!process.client) {
    return "/workspace/create";
  }

  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    return "/sign-in";
  }

  const config = useRuntimeConfig();
  const apiBaseUrl = getApiBaseUrl(config.public.apiBaseUrl);

  try {
    const list = await $fetch<Array<{ id: string; name: string; slug: string; createdAt: string; updatedAt?: string; role?: string }>>(
      `${apiBaseUrl}/workspaces/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (list.length > 0) {
      const first = list[0];
      localStorage.setItem(WORKSPACE_KEY, JSON.stringify(first));
      try {
        const channels = await $fetch<Array<{ id: string; name: string }>>(
          `${apiBaseUrl}/workspaces/${first.id}/channels`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const defaultChannel = channels.find((item) => item.name === "general") ?? channels[0];
        if (defaultChannel) {
          return `/workspace/${first.id}/channel/${defaultChannel.id}`;
        }
      } catch {
        // fall back to legacy path
      }

      return `/workspace/${first.id}/channel/general`;
    }
  } catch {
    // fall through to create page
  }

  return "/workspace/create";
};

export const useAuthApi = () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = getApiBaseUrl(config.public.apiBaseUrl);

  const registerWithEmail = async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await $fetch<AuthResponse>(`${apiBaseUrl}/auth/register`, {
      method: "POST",
      body: payload,
    });
    persistAuth(response);
    return response;
  };

  const loginWithEmail = async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await $fetch<AuthResponse>(`${apiBaseUrl}/auth/login`, {
      method: "POST",
      body: payload,
    });
    persistAuth(response);
    return response;
  };

  const sendOtp = async (payload: SendOtpPayload): Promise<{ success: boolean; purpose: OtpPurpose; message: string }> => {
    return $fetch(`${apiBaseUrl}/auth/otp/send`, {
      method: "POST",
      body: payload,
    });
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
    sendOtp,
    logout,
  };
};
