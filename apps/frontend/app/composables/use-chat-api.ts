type WorkspaceSummary = {
  id: string;
  name: string;
  slug: string;
  inviteCode: string;
  createdAt: string;
  updatedAt: string;
  defaultChannelId?: string;
};

type UserWorkspaceItem = {
  role: "ADMIN" | "MEMBER";
  joinedAt: string;
  workspace: WorkspaceSummary;
};

type ChannelItem = {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  type: "PUBLIC" | "PRIVATE";
  createdById: string;
  createdAt: string;
  updatedAt: string;
};

type WorkspaceMemberItem = {
  id: string;
  workspaceId: string;
  userId: string;
  role: "ADMIN" | "MEMBER";
  joinedAt: string;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
};

type MessageItem = {
  id: string;
  channelId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    name: string | null;
  };
};

const ACCESS_TOKEN_KEY = "appchat_access_token";

const getApiBaseUrl = (rawBaseUrl: string) => {
  const trimmed = (rawBaseUrl || "").trim();

  if (!trimmed) {
    return "https://localhost:3100";
  }

  if (
    trimmed.startsWith("http://localhost:3000") ||
    trimmed.startsWith("https://localhost:3000")
  ) {
    return "https://localhost:3100";
  }

  return trimmed;
};

export const useChatApi = () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = getApiBaseUrl(config.public.apiBaseUrl);

  const getAuthHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {};

    if (!process.client) {
      return headers;
    }

    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) {
      return headers;
    }

    headers.Authorization = `Bearer ${token}`;
    return headers;
  };

  const createWorkspace = (name: string) =>
    $fetch<WorkspaceSummary & { defaultChannelId?: string }>(`${apiBaseUrl}/workspaces`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: { name },
    });

  const listMyWorkspaces = () =>
    $fetch<UserWorkspaceItem[]>(`${apiBaseUrl}/workspaces`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

  const listChannels = (workspaceId: string) =>
    $fetch<ChannelItem[]>(`${apiBaseUrl}/workspaces/${workspaceId}/channels`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

  const createChannel = (workspaceId: string, payload: { name: string; description?: string; type: "PUBLIC" | "PRIVATE" }) =>
    $fetch<ChannelItem>(`${apiBaseUrl}/workspaces/${workspaceId}/channels`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: payload,
    });

  const listWorkspaceMembers = (workspaceId: string) =>
    $fetch<WorkspaceMemberItem[]>(`${apiBaseUrl}/workspaces/${workspaceId}/members`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

  const listMessages = (channelId: string, limit = 20) =>
    $fetch<{ data: MessageItem[]; nextCursor: string | null }>(
      `${apiBaseUrl}/channels/${channelId}/messages?limit=${limit}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      },
    );

  return {
    createWorkspace,
    listMyWorkspaces,
    listChannels,
    createChannel,
    listWorkspaceMembers,
    listMessages,
  };
};
