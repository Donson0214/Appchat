type Workspace = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
};

const FALLBACK_WORKSPACE: Workspace = {
  id: "local-default",
  name: "Acme Inc",
  slug: "acme",
  createdAt: new Date(0).toISOString(),
};

export const useWorkspace = () => {
  const workspace = useState<Workspace>("workspace", () => FALLBACK_WORKSPACE);

  const loadWorkspace = () => {
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

  const workspaceInitial = computed(() => (workspace.value.name?.[0] || "A").toUpperCase());

  return {
    workspace,
    workspaceInitial,
    loadWorkspace,
    saveWorkspace,
  };
};
