globalThis.__timing__.logStart('Load chunks/build/use-chat-api-UWi158vj');import { computed, toRef, isRef } from 'vue';
import { u as useNuxtApp, b as useRuntimeConfig } from './server.mjs';

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
  const loadWorkspace = () => {
    return workspace.value;
  };
  const saveWorkspace = (next) => {
    workspace.value = next;
  };
  const workspaceInitial = computed(() => (workspace.value.name?.[0] || "A").toUpperCase());
  return {
    workspace,
    workspaceInitial,
    loadWorkspace,
    saveWorkspace
  };
};
const getApiBaseUrl = (rawBaseUrl) => {
  const trimmed = (rawBaseUrl || "").trim();
  if (!trimmed) {
    return "https://localhost:3100";
  }
  if (trimmed.startsWith("http://localhost:3000") || trimmed.startsWith("https://localhost:3000")) {
    return "https://localhost:3100";
  }
  return trimmed;
};
const useChatApi = () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = getApiBaseUrl(config.public.apiBaseUrl);
  const getAuthHeaders = () => {
    {
      return {};
    }
  };
  const createWorkspace = (name) => $fetch(`${apiBaseUrl}/workspaces`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: { name }
  });
  const listMyWorkspaces = () => $fetch(`${apiBaseUrl}/workspaces`, {
    method: "GET",
    headers: getAuthHeaders()
  });
  const listChannels = (workspaceId) => $fetch(`${apiBaseUrl}/workspaces/${workspaceId}/channels`, {
    method: "GET",
    headers: getAuthHeaders()
  });
  const createChannel = (workspaceId, payload) => $fetch(`${apiBaseUrl}/workspaces/${workspaceId}/channels`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: payload
  });
  const listWorkspaceMembers = (workspaceId) => $fetch(`${apiBaseUrl}/workspaces/${workspaceId}/members`, {
    method: "GET",
    headers: getAuthHeaders()
  });
  const listMessages = (channelId, limit = 20) => $fetch(
    `${apiBaseUrl}/channels/${channelId}/messages?limit=${limit}`,
    {
      method: "GET",
      headers: getAuthHeaders()
    }
  );
  return {
    createWorkspace,
    listMyWorkspaces,
    listChannels,
    createChannel,
    listWorkspaceMembers,
    listMessages
  };
};

export { useChatApi as a, useState as b, useWorkspace as u };;globalThis.__timing__.logEnd('Load chunks/build/use-chat-api-UWi158vj');
//# sourceMappingURL=use-chat-api-UWi158vj.mjs.map
