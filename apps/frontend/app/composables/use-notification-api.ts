import { getAuthHeadersOrNull, handleUnauthorizedError } from "../utils/auth-session";

export type NotificationItem = {
  id: string;
  type: "mention";
  preview: string;
  mentionKey?: string;
  isRead: boolean;
  createdAt: string;
  workspaceId: string;
  channel: {
    id: string;
    name: string;
  };
  message: {
    id: string;
    channelId: string;
  };
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

export const useNotificationApi = () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = getApiBaseUrl(config.public.apiBaseUrl);

  const fetchNotifications = async (): Promise<NotificationItem[]> => {
    const headers = getAuthHeaders();
    if (!headers) return [];

    try {
      return await $fetch<NotificationItem[]>(`${apiBaseUrl}/notifications`, { headers });
    } catch (error) {
      await handleUnauthorizedError(error);
      throw error;
    }
  };

  const markAllRead = async () => {
    const headers = getAuthHeaders();
    if (!headers) {
      throw new Error("UNAUTHENTICATED");
    }

    try {
      return await $fetch(`${apiBaseUrl}/notifications/read-all`, {
        method: "POST",
        headers,
      });
    } catch (error) {
      await handleUnauthorizedError(error);
      throw error;
    }
  };

  const markRead = async (ids: string[]) => {
    const headers = getAuthHeaders();
    if (!headers) {
      throw new Error("UNAUTHENTICATED");
    }

    try {
      return await $fetch(`${apiBaseUrl}/notifications/read`, {
        method: "POST",
        headers,
        body: { ids },
      });
    } catch (error) {
      await handleUnauthorizedError(error);
      throw error;
    }
  };

  return {
    fetchNotifications,
    markAllRead,
    markRead,
  };
};
