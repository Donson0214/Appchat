const TOKEN_KEY = "appchat_access_token";
const USER_KEY = "appchat_user";
const WORKSPACE_KEY = "appchat_workspace";

type JwtPayload = {
  exp?: number;
};

const decodeJwtPayload = (token: string): JwtPayload | null => {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const normalized = payload + "=".repeat((4 - (payload.length % 4 || 4)) % 4);
    const json = atob(normalized);
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
};

export const clearAuthSession = () => {
  if (!process.client) return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(WORKSPACE_KEY);
};

export const getValidAccessToken = (): string | null => {
  if (!process.client) return null;

  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return token;

  const now = Math.floor(Date.now() / 1000);
  if (payload.exp <= now + 5) {
    clearAuthSession();
    return null;
  }

  return token;
};

export const getAuthHeadersOrNull = (): Record<string, string> | null => {
  const token = getValidAccessToken();
  if (!token) return null;
  return { Authorization: `Bearer ${token}` };
};

export const resolveHttpStatus = (error: unknown): number | null => {
  const e = error as any;
  return e?.statusCode ?? e?.status ?? e?.response?.status ?? null;
};

export const handleUnauthorizedError = async (error: unknown): Promise<boolean> => {
  const status = resolveHttpStatus(error);
  if (status !== 401) return false;

  clearAuthSession();
  if (process.client) {
    await navigateTo("/sign-in");
  }
  return true;
};

