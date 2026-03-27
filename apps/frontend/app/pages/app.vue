<template>
  <div class="min-h-screen bg-[#f3f4f6] px-6 pt-[108px]">
    <div class="mx-auto w-full max-w-[520px] rounded-[10px] border border-slate-300 bg-[#f3f4f6] p-6 shadow-[0_1px_2px_rgba(15,23,42,0.07),0_6px_20px_rgba(15,23,42,0.04)]">
      <h1 class="text-[28px] font-semibold text-slate-900">Workspace Home</h1>
      <p class="mt-1 text-[15px] text-slate-600">{{ workspaceText }}</p>

      <div class="mt-6 flex gap-3">
        <button
          type="button"
          class="h-[40px] rounded-md border border-slate-300 px-4 text-[14px] font-medium text-slate-700"
          @click="goCreateWorkspace"
        >
          Change workspace
        </button>
        <button
          type="button"
          class="h-[40px] rounded-md bg-slate-900 px-4 text-[14px] font-medium text-white"
          @click="logout"
        >
          Log out
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const workspaceText = ref("No workspace found");

if (process.client) {
  const raw = localStorage.getItem("appchat_workspace");
  if (raw) {
    const workspace = JSON.parse(raw) as { name?: string };
    workspaceText.value = workspace.name ? `Current workspace: ${workspace.name}` : workspaceText.value;
  }
}

const goCreateWorkspace = async () => {
  await navigateTo("/workspace/create");
};

const logout = async () => {
  localStorage.removeItem("appchat_access_token");
  localStorage.removeItem("appchat_user");
  await navigateTo("/sign-in");
};
</script>
