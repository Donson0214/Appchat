<template>
  <div class="min-h-screen bg-[#f3f4f6] px-6 pt-[108px]">
    <div class="mx-auto w-full max-w-[420px] rounded-[10px] border border-slate-300 bg-[#f3f4f6] p-6 shadow-[0_1px_2px_rgba(15,23,42,0.07),0_6px_20px_rgba(15,23,42,0.04)]">
      <div class="mb-5 grid grid-cols-2 gap-2 rounded-md bg-slate-200/70 p-1">
        <button
          type="button"
          class="h-9 rounded-md text-[14px] font-semibold transition-colors"
          :class="mode === 'create' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
          @click="mode = 'create'"
        >
          Create
        </button>
        <button
          type="button"
          class="h-9 rounded-md text-[14px] font-semibold transition-colors"
          :class="mode === 'join' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
          @click="mode = 'join'"
        >
          Join by code
        </button>
      </div>

      <template v-if="mode === 'create'">
        <h1 class="text-[28px] font-semibold text-slate-900">Create your workspace</h1>
        <p class="mt-1 text-[14px] text-slate-500">This will be your first workspace in AppChat.</p>

        <label class="mt-6 block text-[14px] font-medium text-slate-900">Workspace name</label>
        <input
          v-model="workspaceName"
          type="text"
          placeholder="My Team"
          class="mt-2 h-[42px] w-full rounded-md border border-slate-300 bg-slate-50 px-3.5 text-[15px] text-slate-900 outline-none transition-all duration-200 ease-in-out placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-500/15"
        />

        <p v-if="errorMessage" class="mt-3 text-[13px] font-medium text-red-600">{{ errorMessage }}</p>

        <button
          type="button"
          class="mt-5 h-[42px] w-full rounded-md bg-gradient-to-r from-indigo-500 to-indigo-600 text-[15px] font-semibold text-white transition-all duration-200 ease-in-out hover:-translate-y-px hover:brightness-105"
          :disabled="submitting"
          @click="handleCreateWorkspace"
        >
          {{ submitting ? "Creating..." : "Create workspace" }}
        </button>
      </template>

      <template v-else>
        <h1 class="text-[28px] font-semibold text-slate-900">Join a workspace</h1>
        <p class="mt-1 text-[14px] text-slate-500">Enter your workspace invite code to join.</p>

        <label class="mt-6 block text-[14px] font-medium text-slate-900">Invite code</label>
        <input
          v-model="joinCode"
          type="text"
          placeholder="e.g. AB12CD34"
          class="mt-2 h-[42px] w-full rounded-md border border-slate-300 bg-slate-50 px-3.5 text-[15px] uppercase tracking-[0.08em] text-slate-900 outline-none transition-all duration-200 ease-in-out placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-500/15"
        />

        <p v-if="errorMessage" class="mt-3 text-[13px] font-medium text-red-600">{{ errorMessage }}</p>

        <button
          type="button"
          class="mt-5 h-[42px] w-full rounded-md bg-gradient-to-r from-indigo-500 to-indigo-600 text-[15px] font-semibold text-white transition-all duration-200 ease-in-out hover:-translate-y-px hover:brightness-105"
          :disabled="submitting"
          @click="handleJoinWorkspace"
        >
          {{ submitting ? "Joining..." : "Join workspace" }}
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const mode = ref<"create" | "join">("create");
const workspaceName = ref("");
const joinCode = ref("");
const errorMessage = ref("");
const submitting = ref(false);
const { createWorkspace, joinWorkspace } = useWorkspace();
const { fetchChannels } = useChannelApi();

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

const resolveWorkspaceRoute = async (workspaceId: string) => {
  try {
    const channels = await fetchChannels(workspaceId);
    const defaultChannel = channels.find((item) => item.name === "general") ?? channels[0];
    if (defaultChannel) {
      return `/workspace/${workspaceId}/channel/${defaultChannel.id}`;
    }
  } catch {
    // fallback route
  }

  return `/workspace/${workspaceId}/channel/general`;
};

const handleCreateWorkspace = async () => {
  const name = workspaceName.value.trim();
  if (name.length < 2) {
    errorMessage.value = "Workspace name must be at least 2 characters";
    return;
  }

  try {
    submitting.value = true;
    errorMessage.value = "";

    const workspace = await createWorkspace({
      name,
      slug: slugify(name) || "workspace",
    });

    await navigateTo(await resolveWorkspaceRoute(workspace.id));
  } catch (error: any) {
    errorMessage.value = error?.data?.message ?? "Failed to create workspace";
  } finally {
    submitting.value = false;
  }
};

const handleJoinWorkspace = async () => {
  const code = joinCode.value.trim().toUpperCase();
  if (code.length < 6) {
    errorMessage.value = "Invite code must be at least 6 characters";
    return;
  }

  try {
    submitting.value = true;
    errorMessage.value = "";

    const workspace = await joinWorkspace(code);
    await navigateTo(await resolveWorkspaceRoute(workspace.id));
  } catch (error: any) {
    errorMessage.value = error?.data?.message ?? "Failed to join workspace";
  } finally {
    submitting.value = false;
  }
};
</script>
