import { getAuthHeadersOrNull, handleUnauthorizedError } from "../utils/auth-session";

type MessageDto = {
  id: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
    email: string;
  };
};

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

const getAuthHeaders = () => {
  return getAuthHeadersOrNull();
};

export const useMessageApi = () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = getApiBaseUrl(config.public.apiBaseUrl);

  const fetchMessages = async (workspaceId: string, channelRef: string): Promise<MessageDto[]> => {
    const headers = getAuthHeaders();
    if (!headers) return [];

    try {
      return await $fetch<MessageDto[]>(
        `${apiBaseUrl}/workspaces/${workspaceId}/channels/${channelRef}/messages`,
        { headers },
      );
    } catch (error) {
      await handleUnauthorizedError(error);
      throw error;
    }
  };

  const sendMessage = async (workspaceId: string, channelRef: string, content: string) => {
    const headers = getAuthHeaders();
    if (!headers) {
      throw new Error("UNAUTHENTICATED");
    }

    try {
      return await $fetch<MessageDto>(
        `${apiBaseUrl}/workspaces/${workspaceId}/channels/${channelRef}/messages`,
        {
          method: "POST",
          headers,
          body: { content },
        },
      );
    } catch (error) {
      await handleUnauthorizedError(error);
      throw error;
    }
  };

  return {
    fetchMessages,
    sendMessage,
  };
};
