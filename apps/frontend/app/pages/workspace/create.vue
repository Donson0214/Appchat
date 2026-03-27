<template>
  <div class="min-h-screen bg-[#f3f4f6] px-6 pt-[108px]">
    <div class="mx-auto w-full max-w-[420px] rounded-[10px] border border-slate-300 bg-[#f3f4f6] p-6 shadow-[0_1px_2px_rgba(15,23,42,0.07),0_6px_20px_rgba(15,23,42,0.04)]">
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
    </div>
  </div>
</template>

<script setup lang="ts">
const workspaceName = ref("");
const errorMessage = ref("");
const submitting = ref(false);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

const handleCreateWorkspace = async () => {
  const name = workspaceName.value.trim();
  if (name.length < 2) {
    errorMessage.value = "Workspace name must be at least 2 characters";
    return;
  }

  try {
    submitting.value = true;
    errorMessage.value = "";

    const workspace = {
      id: crypto.randomUUID(),
      name,
      slug: slugify(name) || "workspace",
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("appchat_workspace", JSON.stringify(workspace));
    await navigateTo("/app");
  } finally {
    submitting.value = false;
  }
};
</script>
