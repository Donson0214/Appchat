<template>
  <div class="flex h-full w-[280px] flex-col border-r border-[#e5e7eb] bg-[#f8f8fa]">
    <div ref="workspaceMenuRef" class="relative flex h-[56px] items-center justify-between border-b border-[#e5e7eb] px-3">
      <button
        type="button"
        class="flex items-center gap-2 rounded-md px-1.5 py-1 transition hover:bg-[#eef0f5]"
        @click="isWorkspaceMenuOpen = !isWorkspaceMenuOpen"
      >
        <div class="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-500 text-[12px] font-semibold text-white">{{ workspaceInitial }}</div>
        <p class="text-[28px] font-semibold leading-none text-[#1d1c1d]">{{ workspace.name }}</p>
      </button>
      <button
        type="button"
        class="inline-flex h-6 w-6 items-center justify-center rounded-md text-[#8f95a3] transition hover:bg-[#eef0f5]"
        @click="isWorkspaceMenuOpen = !isWorkspaceMenuOpen"
      >
        <svg viewBox="0 0 20 20" class="h-4 w-4 fill-current">
          <path d="M5.3 7.7a1 1 0 0 1 1.4 0L10 11l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z" />
        </svg>
      </button>

      <div
        v-if="isWorkspaceMenuOpen"
        class="absolute left-3 top-[48px] z-50 w-[232px] overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-[0_10px_24px_rgba(15,23,42,0.18)]"
      >
        <div class="p-2">
          <button
            v-for="item in workspaceOptions"
            :key="item.id"
            type="button"
            class="flex w-full items-center justify-between rounded-md px-2 py-2 text-left transition hover:bg-[#f8f8fa]"
            @click="selectWorkspace(item)"
          >
            <div class="flex items-center gap-2.5">
              <span class="inline-flex h-7 w-7 items-center justify-center rounded-md text-[12px] font-semibold text-white" :class="item.badgeColor">
                {{ item.name[0]?.toUpperCase() }}
              </span>
              <div class="leading-tight">
                <p class="text-[13px] font-semibold text-[#1d1c1d]">{{ item.name }}</p>
                <p class="mt-0.5 text-[12px] text-[#6b6f76]">{{ item.roleLabel }}</p>
              </div>
            </div>
            <svg v-if="workspace.slug === item.slug" viewBox="0 0 20 20" class="h-4 w-4 fill-indigo-500">
              <path d="M15.8 6.2a1 1 0 0 1 0 1.4l-6 6a1 1 0 0 1-1.4 0l-3-3a1 1 0 0 1 1.4-1.4L9 11.4l5.3-5.2a1 1 0 0 1 1.4 0Z" />
            </svg>
          </button>
        </div>
        <div class="border-t border-[#e5e7eb] p-2">
          <button
            type="button"
            class="flex w-full items-center justify-center gap-2 rounded-md px-2 py-2 text-[13px] font-medium text-indigo-600 transition hover:bg-indigo-50"
            @click="goCreateWorkspace"
          >
            <span class="text-[14px] leading-none">+</span>
            <span>Create or join workspace</span>
          </button>
        </div>
      </div>
    </div>

    <ChannelSidebar />

    <div class="mt-auto flex h-[48px] items-center justify-between border-t border-[#e5e7eb] px-3 text-[#6b7280]">
      <div class="flex items-center gap-1">
        <button class="inline-flex h-7 w-7 items-center justify-center rounded-md transition hover:bg-[#eef0f5]">
          <svg viewBox="0 0 20 20" class="h-4 w-4 fill-current">
            <path d="M10 2.5a.8.8 0 0 1 .7 1.2 5.8 5.8 0 1 0 5.6 8.5.8.8 0 0 1 1.4.7A7.4 7.4 0 1 1 10 2.5Z" />
          </svg>
        </button>
        <button class="inline-flex h-7 w-7 items-center justify-center rounded-md transition hover:bg-[#eef0f5]" @click="goSettings">
          <svg viewBox="0 0 20 20" class="h-4 w-4 fill-current">
            <path d="M8.5 2.5h3l.3 1.8a5.8 5.8 0 0 1 1.5.9l1.7-.8 2.1 2.1-.8 1.7c.4.5.7 1 .9 1.5l1.8.3v3l-1.8.3a5.8 5.8 0 0 1-.9 1.5l.8 1.7-2.1 2.1-1.7-.8c-.5.4-1 .7-1.5.9l-.3 1.8h-3l-.3-1.8a5.8 5.8 0 0 1-1.5-.9l-1.7.8-2.1-2.1.8-1.7a5.8 5.8 0 0 1-.9-1.5L1 11.5v-3l1.8-.3c.2-.5.5-1 .9-1.5L2.9 5l2.1-2.1 1.7.8c.5-.4 1-.7 1.5-.9l.3-1.8Zm1.5 5.3a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4Z" />
          </svg>
        </button>
        <button class="inline-flex h-7 w-7 items-center justify-center rounded-md transition hover:bg-[#eef0f5]" @click="goAdmin">
          <svg viewBox="0 0 20 20" class="h-4 w-4 fill-current">
            <path d="M6.8 9a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm6.4 1.2a2.6 2.6 0 1 1 0-5.2 2.6 2.6 0 0 1 0 5.2ZM2.5 15.7A4.7 4.7 0 0 1 7.2 11h.7a4.7 4.7 0 0 1 4.7 4.7v.8H2.5v-.8Zm10.2.8v-.8c0-1.2-.4-2.3-1-3.2.4-.1.8-.2 1.3-.2h.4a4 4 0 0 1 4 4v.2h-4.7Z" />
          </svg>
        </button>
      </div>
      <button class="inline-flex h-7 w-7 items-center justify-center rounded-md transition hover:bg-[#eef0f5]">
        <svg viewBox="0 0 20 20" class="h-4 w-4 fill-current">
          <path d="M11 3.5a1 1 0 1 1 2 0v2h2.5a2 2 0 0 1 2 2V14a2 2 0 0 1-2 2H13v2a1 1 0 1 1-2 0v-2h-3a1 1 0 0 1 0-2h6.5a.5.5 0 0 0 .5-.5V7.5a.5.5 0 0 0-.5-.5H8A1 1 0 1 1 8 5h3V3.5ZM4.3 6.3a1 1 0 0 1 1.4 0l2.5 2.5a1 1 0 1 1-1.4 1.4L6 9.4V15a1 1 0 1 1-2 0V9.4l-.8.8a1 1 0 0 1-1.4-1.4l2.5-2.5Z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import ChannelSidebar from "./ChannelSidebar.vue";
import { useChatApi } from "../../composables/use-chat-api";
import { useWorkspace } from "../../composables/use-workspace";

const { workspace, workspaceInitial, loadWorkspace, saveWorkspace } = useWorkspace();
const { listMyWorkspaces, listChannels } = useChatApi();
const router = useRouter();

const isWorkspaceMenuOpen = ref(false);
const workspaceMenuRef = ref<HTMLElement | null>(null);

type WorkspaceOption = {
  id: string;
  name: string;
  slug: string;
  members: string;
  roleLabel: string;
  badgeColor: string;
  createdAt: string;
};

const badgeColors = ["bg-indigo-500", "bg-emerald-500", "bg-amber-500", "bg-cyan-500"];
const workspaceOptions = ref<WorkspaceOption[]>([]);

const loadWorkspaceOptions = async () => {
  try {
    const items = await listMyWorkspaces();
    workspaceOptions.value = items.map((item, index) => ({
      id: item.workspace.id,
      name: item.workspace.name,
      slug: item.workspace.slug,
      members: "members",
      roleLabel: item.role.toLowerCase(),
      badgeColor: badgeColors[index % badgeColors.length] ?? "bg-indigo-500",
      createdAt: item.workspace.createdAt,
    }));
  } catch {
    workspaceOptions.value = [];
  }
};

const selectWorkspace = async (item: WorkspaceOption) => {
  saveWorkspace({
    id: item.id,
    name: item.name,
    slug: item.slug,
    createdAt: item.createdAt,
  });
  isWorkspaceMenuOpen.value = false;

  try {
    const channels = await listChannels(item.id);
    const firstChannel = channels[0];
    if (firstChannel) {
      await router.push(`/workspace/${item.slug}/channel/${firstChannel.id}`);
      return;
    }
  } catch {
    // Fall through to default route.
  }

  await router.push(`/workspace/${item.slug}/channel/general`);
};

const goCreateWorkspace = async () => {
  isWorkspaceMenuOpen.value = false;
  await router.push("/workspace/create");
};

const goSettings = async () => {
  await router.push("/settings");
};

const goAdmin = async () => {
  await router.push("/admin");
};

const handleOutsideClick = (event: MouseEvent) => {
  if (!isWorkspaceMenuOpen.value) return;
  const target = event.target as Node | null;
  if (!target) return;
  if (workspaceMenuRef.value && !workspaceMenuRef.value.contains(target)) {
    isWorkspaceMenuOpen.value = false;
  }
};

onMounted(async () => {
  loadWorkspace();
  await loadWorkspaceOptions();

  if (
    (workspace.value.id === "local-default" || !workspace.value.id) &&
    workspaceOptions.value.length > 0
  ) {
    const first = workspaceOptions.value[0];
    if (first) {
      saveWorkspace({
        id: first.id,
        name: first.name,
        slug: first.slug,
        createdAt: first.createdAt,
      });
    }
  }

  document.addEventListener("mousedown", handleOutsideClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleOutsideClick);
});
</script>
