type ChannelDto = {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: "PUBLIC" | "PRIVATE";
  private: boolean;
  membersCount: number;
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
  if (!process.client) {
    return {};
  }

  const token = localStorage.getItem("appchat_access_token");
  if (!token) {
    return {};
  }

  return { Authorization: `Bearer ${token}` };
};

export const useChannelApi = () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = getApiBaseUrl(config.public.apiBaseUrl);

  const fetchChannels = async (workspaceId: string): Promise<ChannelDto[]> => {
    return $fetch<ChannelDto[]>(`${apiBaseUrl}/workspaces/${workspaceId}/channels`, {
      headers: getAuthHeaders(),
    });
  };

  const createChannel = async (
    workspaceId: string,
    payload: CreateChannelPayload,
  ): Promise<ChannelDto> => {
    return $fetch<ChannelDto>(`${apiBaseUrl}/workspaces/${workspaceId}/channels`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: payload,
    });
  };

  const inviteMember = async (workspaceId: string, channelRef: string, email: string) => {
    return $fetch(`${apiBaseUrl}/workspaces/${workspaceId}/channels/${channelRef}/members`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: { email },
    });
  };

  return {
    fetchChannels,
    createChannel,
    inviteMember,
  };
};
