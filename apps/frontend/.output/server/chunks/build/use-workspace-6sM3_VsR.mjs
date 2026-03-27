globalThis.__timing__.logStart('Load chunks/build/use-workspace-6sM3_VsR');import { computed, toRef, isRef } from 'vue';
import { u as useNuxtApp } from './server.mjs';

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

export { useWorkspace as u };;globalThis.__timing__.logEnd('Load chunks/build/use-workspace-6sM3_VsR');
//# sourceMappingURL=use-workspace-6sM3_VsR.mjs.map
