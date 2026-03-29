import { getAuthHeadersOrNull, handleUnauthorizedError } from "../utils/auth-session";

type MessageDto = {
  id: string;
  content: string;
  createdAt: string;
  parentMessageId?: string | null;
  mentions?: Array<{
    userId: string | null;
    displayName: string;
    mentionKey: string;
    start: number;
    end: number;
  }>;
  reactions?: Array<{
    emoji: string;
    count: number;
    reactedByMe: boolean;
  }>;
  repliesCount?: number;
  pinned?: boolean;
  author: {
    id?: string;
    name: string;
    email: string;
  };
};

type ThreadDto = {
  root: MessageDto;
  replies: MessageDto[];
};

type SearchScope = "messages" | "people" | "channels";

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

  const fetchThread = async (workspaceId: string, channelRef: string, messageId: string): Promise<ThreadDto> => {
    const headers = getAuthHeaders();
    if (!headers) {
      throw new Error("UNAUTHENTICATED");
    }

    try {
      return await $fetch<ThreadDto>(
        `${apiBaseUrl}/workspaces/${workspaceId}/channels/${channelRef}/messages/${messageId}/thread`,
        { headers },
      );
    } catch (error) {
      await handleUnauthorizedError(error);
      throw error;
    }
  };

  const sendReply = async (
    workspaceId: string,
    channelRef: string,
    messageId: string,
    content: string,
  ): Promise<MessageDto> => {
    const headers = getAuthHeaders();
    if (!headers) {
      throw new Error("UNAUTHENTICATED");
    }

    try {
      return await $fetch<MessageDto>(
        `${apiBaseUrl}/workspaces/${workspaceId}/channels/${channelRef}/messages/${messageId}/replies`,
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

  const addReaction = async (
    workspaceId: string,
    channelRef: string,
    messageId: string,
    emoji: string,
  ): Promise<{ messageId: string; reactions: Array<{ emoji: string; count: number; reactedByMe: boolean }> }> => {
    const headers = getAuthHeaders();
    if (!headers) {
      throw new Error("UNAUTHENTICATED");
    }

    try {
      return await $fetch(
        `${apiBaseUrl}/workspaces/${workspaceId}/channels/${channelRef}/messages/${messageId}/reactions`,
        {
          method: "POST",
          headers,
          body: { emoji },
        },
      );
    } catch (error) {
      await handleUnauthorizedError(error);
      throw error;
    }
  };

  const removeReaction = async (
    workspaceId: string,
    channelRef: string,
    messageId: string,
    emoji: string,
  ): Promise<{ messageId: string; reactions: Array<{ emoji: string; count: number; reactedByMe: boolean }> }> => {
    const headers = getAuthHeaders();
    if (!headers) {
      throw new Error("UNAUTHENTICATED");
    }

    try {
      return await $fetch(
        `${apiBaseUrl}/workspaces/${workspaceId}/channels/${channelRef}/messages/${messageId}/reactions/${encodeURIComponent(emoji)}`,
        {
          method: "DELETE",
          headers,
        },
      );
    } catch (error) {
      await handleUnauthorizedError(error);
      throw error;
    }
  };

  const pinMessage = async (workspaceId: string, channelRef: string, messageId: string) => {
    const headers = getAuthHeaders();
    if (!headers) {
      throw new Error("UNAUTHENTICATED");
    }

    try {
      return await $fetch(`${apiBaseUrl}/workspaces/${workspaceId}/channels/${channelRef}/messages/${messageId}/pin`, {
        method: "POST",
        headers,
      });
    } catch (error) {
      await handleUnauthorizedError(error);
      throw error;
    }
  };

  const unpinMessage = async (workspaceId: string, channelRef: string, messageId: string) => {
    const headers = getAuthHeaders();
    if (!headers) {
      throw new Error("UNAUTHENTICATED");
    }

    try {
      return await $fetch(`${apiBaseUrl}/workspaces/${workspaceId}/channels/${channelRef}/messages/${messageId}/pin`, {
        method: "DELETE",
        headers,
      });
    } catch (error) {
      await handleUnauthorizedError(error);
      throw error;
    }
  };

  const fetchPinned = async (workspaceId: string, channelRef: string): Promise<MessageDto[]> => {
    const headers = getAuthHeaders();
    if (!headers) return [];

    try {
      return await $fetch<MessageDto[]>(`${apiBaseUrl}/workspaces/${workspaceId}/channels/${channelRef}/pins`, {
        headers,
      });
    } catch (error) {
      await handleUnauthorizedError(error);
      throw error;
    }
  };

  const searchWorkspace = async (workspaceId: string, q: string, scope: SearchScope) => {
    const headers = getAuthHeaders();
    if (!headers) {
      return { scope, items: [] as unknown[] };
    }

    try {
      return await $fetch<{ scope: SearchScope; items: unknown[] }>(`${apiBaseUrl}/workspaces/${workspaceId}/search`, {
        headers,
        query: { q, scope },
      });
    } catch (error) {
      await handleUnauthorizedError(error);
      throw error;
    }
  };

  return {
    fetchMessages,
    sendMessage,
    fetchThread,
    sendReply,
    addReaction,
    removeReaction,
    pinMessage,
    unpinMessage,
    fetchPinned,
    searchWorkspace,
  };
};
