globalThis.__timing__.logStart('Load chunks/build/use-channel-api-CR8gUnIE');import { computed, toRef, isRef } from 'vue';
import { u as useNuxtApp, a as useRuntimeConfig } from './server.mjs';

const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxtApp = useNuxtApp();
  const state = toRef(nuxtApp.payload.state, key);
  if (init) {
    nuxtApp._state[key] ??= { _default: init };
  }
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxtApp.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
const FALLBACK_WORKSPACE = {
  id: "local-default",
  name: "Acme Inc",
  slug: "acme",
  createdAt: (/* @__PURE__ */ new Date(0)).toISOString()
};
const useWorkspace = () => {
  const workspace = useState("workspace", () => FALLBACK_WORKSPACE);
  const workspaces = useState("workspaces", () => []);
  const config = useRuntimeConfig();
  ((rawBaseUrl) => {
    const trimmed = (rawBaseUrl || "").trim();
    if (!trimmed) return "https://localhost:3000";
    if (trimmed.startsWith("http://localhost:3000")) {
      return trimmed.replace("http://localhost:3000", "https://localhost:3000");
    }
    return trimmed;
  })(config.public.apiBaseUrl);
  const fetchMyWorkspaces = async () => {
    return [];
  };
  const loadWorkspace = async () => {
    return workspace.value;
  };
  const saveWorkspace = (next) => {
    workspace.value = next;
  };
  const createWorkspace = async (payload) => {
    {
      throw new Error("Not authenticated");
    }
  };
  const joinWorkspace = async (code) => {
    {
      throw new Error("Not authenticated");
    }
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
    joinWorkspace
  };
};
const getApiBaseUrl = (rawBaseUrl) => {
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
  {
    return {};
  }
};
const useChannelApi = () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = getApiBaseUrl(config.public.apiBaseUrl);
  const fetchChannels = async (workspaceId) => {
    return $fetch(`${apiBaseUrl}/workspaces/${workspaceId}/channels`, {
      headers: getAuthHeaders()
    });
  };
  const createChannel = async (workspaceId, payload) => {
    return $fetch(`${apiBaseUrl}/workspaces/${workspaceId}/channels`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: payload
    });
  };
  const inviteMember = async (workspaceId, channelRef, email) => {
    return $fetch(`${apiBaseUrl}/workspaces/${workspaceId}/channels/${channelRef}/members`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: { email }
    });
  };
  return {
    fetchChannels,
    createChannel,
    inviteMember
  };
};

export { useChannelApi as a, useWorkspace as u };;globalThis.__timing__.logEnd('Load chunks/build/use-channel-api-CR8gUnIE');
//# sourceMappingURL=use-channel-api-CR8gUnIE.mjs.map
