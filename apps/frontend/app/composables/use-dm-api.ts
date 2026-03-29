import { getAuthHeadersOrNull, handleUnauthorizedError } from "../utils/auth-session";

type OpenDirectMessageResponse = {
  channelId: string;
  channelRef: string;
  member: {
    id: string;
    name: string;
    email: string;
  } | null;
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

export const useDmApi = () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = getApiBaseUrl(config.public.apiBaseUrl);

  const openDirectMessage = async (workspaceRef: string, memberId: string) => {
    const headers = getAuthHeaders();
    if (!headers) {
      throw new Error("UNAUTHENTICATED");
    }

    try {
      return await $fetch<OpenDirectMessageResponse>(`${apiBaseUrl}/workspaces/${workspaceRef}/dms/open`, {
        method: "POST",
        headers,
        body: { memberId },
      });
    } catch (error) {
      await handleUnauthorizedError(error);
      throw error;
    }
  };

  return {
    openDirectMessage,
  };
};
