type Workspace = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt?: string;
  role?: string;
  inviteCode?: string;
};

import { getAuthHeadersOrNull, handleUnauthorizedError } from "../utils/auth-session";

const FALLBACK_WORKSPACE: Workspace = {
  id: "workspace-default",
  name: "Workspace",
  slug: "workspace",
  createdAt: new Date(0).toISOString(),
};

export const useWorkspace = () => {
  const workspace = useState<Workspace>("workspace", () => FALLBACK_WORKSPACE);
  const workspaces = useState<Workspace[]>("workspaces", () => []);

  const config = useRuntimeConfig();

  const apiBaseUrl = ((rawBaseUrl: string) => {
    const trimmed = (rawBaseUrl || "").trim();
    if (!trimmed) return "https://localhost:3000";
    if (trimmed.startsWith("http://localhost:3000")) {
      return trimmed.replace("http://localhost:3000", "https://localhost:3000");
    }
    return trimmed;
  })(config.public.apiBaseUrl);

  const authHeaders = () => getAuthHeadersOrNull() ?? undefined;

  const fetchMyWorkspaces = async () => {
    const headers = authHeaders();
    if (!headers) return [];

    try {
      const result = await $fetch<Workspace[]>(`${apiBaseUrl}/workspaces/me`, { headers });
      workspaces.value = result;
      return result;
    } catch (error) {
      await handleUnauthorizedError(error);
      return [];
    }
  };

  const loadWorkspace = async () => {
    if (process.client && localStorage.getItem("appchat_access_token")) {
      const list = await fetchMyWorkspaces();
      if (list.length > 0) {
        const savedRaw = localStorage.getItem("appchat_workspace");
        if (savedRaw) {
          try {
            const saved = JSON.parse(savedRaw) as Partial<Workspace>;
            const matched = list.find((item) => item.id === saved.id || item.slug === saved.slug);
            if (matched) {
              workspace.value = matched;
              localStorage.setItem("appchat_workspace", JSON.stringify(matched));
              return workspace.value;
            }
          } catch {}
        }

        workspace.value = list[0];
        localStorage.setItem("appchat_workspace", JSON.stringify(workspace.value));
        return workspace.value;
      }
    }

    if (!process.client) return workspace.value;

    const raw = localStorage.getItem("appchat_workspace");
    if (!raw) {
      workspace.value = FALLBACK_WORKSPACE;
      return workspace.value;
    }

    try {
      const parsed = JSON.parse(raw) as Partial<Workspace>;
      workspace.value = {
        id: parsed.id || FALLBACK_WORKSPACE.id,
        name: parsed.name || FALLBACK_WORKSPACE.name,
        slug: parsed.slug || FALLBACK_WORKSPACE.slug,
        createdAt: parsed.createdAt || new Date().toISOString(),
        updatedAt: parsed.updatedAt,
        role: parsed.role,
        inviteCode: parsed.inviteCode,
      };
    } catch {
      workspace.value = FALLBACK_WORKSPACE;
    }

    return workspace.value;
  };

  const saveWorkspace = (next: Workspace) => {
    workspace.value = next;
    if (process.client) {
      localStorage.setItem("appchat_workspace", JSON.stringify(next));
    }
  };

  const createWorkspace = async (payload: { name: string; slug?: string }) => {
    const headers = authHeaders();
    if (!headers) {
      throw new Error("Not authenticated");
    }

    const created = await $fetch<Workspace>(`${apiBaseUrl}/workspaces`, {
      method: "POST",
      headers,
      body: payload,
    });

    workspaces.value = [...workspaces.value, created];
    saveWorkspace(created);
    return created;
  };

  const joinWorkspace = async (code: string) => {
    const headers = authHeaders();
    if (!headers) {
      throw new Error("Not authenticated");
    }

    const joined = await $fetch<Workspace>(`${apiBaseUrl}/workspaces/join`, {
      method: "POST",
      headers,
      body: { code: code.trim().toUpperCase() },
    });

    if (!workspaces.value.some((item) => item.id === joined.id)) {
      workspaces.value = [...workspaces.value, joined];
    }

    saveWorkspace(joined);
    return joined;
  };

  const workspaceInitial = computed(() => (workspace.value.name?.[0] || "A").toUpperCase());

  return {
    workspace,
    workspaces,
    workspaceInitial,
    loadWorkspace,
    saveWorkspace,
    fetchMyWorkspaces,
    createWorkspace,
    joinWorkspace,
  };
};
