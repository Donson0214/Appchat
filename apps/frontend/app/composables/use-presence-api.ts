import { getAuthHeadersOrNull, handleUnauthorizedError } from "../utils/auth-session";

export type PresenceStatus = "online" | "away" | "dnd" | "offline";

export type WorkspacePresenceMember = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MEMBER";
  isSelf: boolean;
  status: PresenceStatus;
};

const getApiBaseUrl = (rawBaseUrl: string) => {
  const trimmed = (rawBaseUrl || "").trim();
  if (!trimmed) return "https://localhost:3000";
  if (trimmed.startsWith("http://localhost:3000")) {
    return trimmed.replace("http://localhost:3000", "https://localhost:3000");
  }
  return trimmed;
};

const getAuthHeaders = () => {
  return getAuthHeadersOrNull();
};

export const usePresenceApi = () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = getApiBaseUrl(config.public.apiBaseUrl);

  const heartbeat = async (workspaceRef?: string) => {
    const headers = getAuthHeaders();
    if (!headers) return { ok: false };

    try {
      return await $fetch(`${apiBaseUrl}/presence/heartbeat`, {
        method: "POST",
        headers,
        body: { workspaceRef },
      });
    } catch (error) {
      await handleUnauthorizedError(error);
      throw error;
    }
  };

  const setStatus = async (status: PresenceStatus) => {
    const headers = getAuthHeaders();
    if (!headers) return { status: "offline" as PresenceStatus };

    try {
      return await $fetch(`${apiBaseUrl}/presence/status`, {
        method: "POST",
        headers,
        body: { status },
      });
    } catch (error) {
      await handleUnauthorizedError(error);
      throw error;
    }
  };

  const fetchWorkspacePresence = async (workspaceRef: string): Promise<WorkspacePresenceMember[]> => {
    const headers = getAuthHeaders();
    if (!headers) return [];

    try {
      return await $fetch<WorkspacePresenceMember[]>(`${apiBaseUrl}/presence/workspaces/${workspaceRef}/members`, {
        headers,
      });
    } catch (error) {
      await handleUnauthorizedError(error);
      throw error;
    }
  };

  return {
    heartbeat,
    setStatus,
    fetchWorkspacePresence,
  };
};
