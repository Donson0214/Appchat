import { getAuthHeadersOrNull, handleUnauthorizedError } from "../utils/auth-session";

type ChannelDto = {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: "PUBLIC" | "PRIVATE";
  private: boolean;
  membersCount: number;
  unreadCount: number;
};

type CreateChannelPayload = {
  name: string;
  description?: string;
  type?: "PUBLIC" | "PRIVATE";
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

export const useChannelApi = () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = getApiBaseUrl(config.public.apiBaseUrl);

  const fetchChannels = async (workspaceId: string): Promise<ChannelDto[]> => {
    const headers = getAuthHeaders();
    if (!headers) return [];

    try {
      return await $fetch<ChannelDto[]>(`${apiBaseUrl}/workspaces/${workspaceId}/channels`, {
        headers,
      });
    } catch (error) {
      await handleUnauthorizedError(error);
      throw error;
    }
  };

  const createChannel = async (
    workspaceId: string,
    payload: CreateChannelPayload,
  ): Promise<ChannelDto> => {
    const headers = getAuthHeaders();
    if (!headers) {
      throw new Error("UNAUTHENTICATED");
    }

    try {
      return await $fetch<ChannelDto>(`${apiBaseUrl}/workspaces/${workspaceId}/channels`, {
        method: "POST",
        headers,
        body: payload,
      });
    } catch (error) {
      await handleUnauthorizedError(error);
      throw error;
    }
  };

  const inviteMember = async (workspaceId: string, channelRef: string, email: string) => {
    const headers = getAuthHeaders();
    if (!headers) {
      throw new Error("UNAUTHENTICATED");
    }

    try {
      return await $fetch(`${apiBaseUrl}/workspaces/${workspaceId}/channels/${channelRef}/members`, {
        method: "POST",
        headers,
        body: { email },
      });
    } catch (error) {
      await handleUnauthorizedError(error);
      throw error;
    }
  };

  const markChannelRead = async (workspaceId: string, channelRef: string) => {
    const headers = getAuthHeaders();
    if (!headers) {
      throw new Error("UNAUTHENTICATED");
    }

    try {
      return await $fetch<{ channelId: string; unreadCount: number; lastReadAt: string }>(
        `${apiBaseUrl}/workspaces/${workspaceId}/channels/${channelRef}/read`,
        {
          method: "POST",
          headers,
        },
      );
    } catch (error) {
      await handleUnauthorizedError(error);
      throw error;
    }
  };

  return {
    fetchChannels,
    createChannel,
    inviteMember,
    markChannelRead,
  };
};
