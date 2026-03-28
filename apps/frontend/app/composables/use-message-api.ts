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
  if (!process.client) {
    return {};
  }

  const token = localStorage.getItem("appchat_access_token");
  if (!token) {
    return {};
  }

  return { Authorization: `Bearer ${token}` };
};

export const useMessageApi = () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = getApiBaseUrl(config.public.apiBaseUrl);

  const fetchMessages = async (workspaceId: string, channelRef: string): Promise<MessageDto[]> => {
    return $fetch<MessageDto[]>(
      `${apiBaseUrl}/workspaces/${workspaceId}/channels/${channelRef}/messages`,
      { headers: getAuthHeaders() },
    );
  };

  const sendMessage = async (workspaceId: string, channelRef: string, content: string) => {
    return $fetch<MessageDto>(
      `${apiBaseUrl}/workspaces/${workspaceId}/channels/${channelRef}/messages`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: { content },
      },
    );
  };

  return {
    fetchMessages,
    sendMessage,
  };
};
