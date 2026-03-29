<template>
  <div class="flex h-full w-[292px] flex-col border-r border-slate-300 bg-[#f8fafc]">
    <div ref="workspaceMenuRef" class="relative flex h-[84px] items-center justify-between border-b border-slate-300 px-4">
      <button
        type="button"
        class="flex items-center gap-3 rounded-md p-1 transition-colors duration-200 hover:bg-slate-100"
        @click="isWorkspaceMenuOpen = !isWorkspaceMenuOpen"
      >
        <div class="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-500 text-[20px] font-semibold text-white">{{ workspaceInitial }}</div>
        <p class="text-[40px] font-semibold leading-none text-slate-900">{{ workspace.name }}</p>
      </button>
      <button
        type="button"
        class="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors duration-200 hover:bg-slate-200/70"
        @click="isWorkspaceMenuOpen = !isWorkspaceMenuOpen"
      >
        <svg viewBox="0 0 20 20" class="h-4 w-4 fill-current">
          <path d="M5.3 7.7a1 1 0 0 1 1.4 0L10 11l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z" />
        </svg>
      </button>

      <div
        v-if="isWorkspaceMenuOpen"
        class="absolute left-4 top-[72px] z-50 w-[280px] overflow-hidden rounded-md border border-slate-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.2)]"
      >
        <div class="border-b border-slate-200 px-3 py-2">
          <p class="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Invite code</p>
          <div class="mt-1 flex items-center justify-between gap-2 rounded-md bg-slate-100 px-2 py-1.5">
            <span class="truncate font-mono text-[12px] font-semibold text-slate-800">
              {{ activeInviteCode || "Admin-only" }}
            </span>
            <button
              type="button"
              class="rounded-md px-2 py-1 text-[11px] font-semibold text-indigo-600 transition-colors duration-150 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:text-slate-400"
              :disabled="!activeInviteCode"
              @click.stop="copyInviteCode(activeInviteCode)"
            >
              Copy
            </button>
          </div>
          <p v-if="inviteCopyStatus" class="mt-1 text-[11px] text-emerald-600">{{ inviteCopyStatus }}</p>
        </div>
        <div class="p-2">
          <button
            v-for="item in workspaceOptions"
            :key="item.id"
            type="button"
            class="flex w-full items-center justify-between rounded-md px-2 py-2 text-left transition-colors duration-150 hover:bg-slate-50"
            @click="selectWorkspace(item)"
          >
            <div class="flex items-center gap-3">
              <span class="inline-flex h-8 w-8 items-center justify-center rounded-md text-[14px] font-semibold text-white" :class="item.badgeColor">
                {{ item.name[0]?.toUpperCase() }}
              </span>
              <div class="leading-tight">
                <p class="text-[14px] font-semibold text-slate-900">{{ item.name }}</p>
                <p class="mt-0.5 text-[12px] text-slate-400">{{ item.members }} - {{ item.roleLabel }}</p>
              </div>
            </div>
            <div class="relative ml-2 flex items-center gap-1">
              <svg v-if="workspace.slug === item.slug" viewBox="0 0 20 20" class="h-4 w-4 fill-indigo-500">
                <path d="M15.8 6.2a1 1 0 0 1 0 1.4l-6 6a1 1 0 0 1-1.4 0l-3-3a1 1 0 0 1 1.4-1.4L9 11.4l5.3-5.2a1 1 0 0 1 1.4 0Z" />
              </svg>
              <button
                type="button"
                class="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors duration-150 hover:bg-slate-200/70 hover:text-slate-600"
                @click.stop="toggleActions(item.id)"
              >
                <svg viewBox="0 0 20 20" class="h-4 w-4 fill-current">
                  <path d="M4.5 8.8a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Zm5.5 0a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Zm5.5 0a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z" />
                </svg>
              </button>
              <div
                v-if="actionWorkspaceId === item.id"
                class="absolute right-0 top-8 z-50 w-[170px] rounded-md border border-slate-200 bg-white p-1 shadow-[0_10px_24px_rgba(15,23,42,0.2)]"
              >
                <button
                  type="button"
                  class="flex w-full items-center rounded-md px-2 py-1.5 text-left text-[12px] font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50"
                  @click.stop="selectWorkspace(item)"
                >
                  Switch workspace
                </button>
                <button
                  type="button"
                  class="flex w-full items-center rounded-md px-2 py-1.5 text-left text-[12px] font-medium transition-colors duration-150"
                  :class="item.inviteCode ? 'text-indigo-600 hover:bg-indigo-50' : 'cursor-not-allowed text-slate-400'"
                  :disabled="!item.inviteCode"
                  @click.stop="copyInviteCode(item.inviteCode)"
                >
                  Copy invite code
                </button>
                <button
                  type="button"
                  class="mt-1 flex w-full items-center rounded-md px-2 py-1.5 text-left text-[12px] font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50"
                  @click.stop="goCreateWorkspace"
                >
                  Create or join
                </button>
              </div>
            </div>
          </button>
        </div>
        <div class="border-t border-slate-200 p-2">
          <button
            type="button"
            class="flex w-full items-center justify-center gap-2 rounded-md px-2 py-2 text-[13px] font-medium text-indigo-500 transition-colors duration-150 hover:bg-indigo-50"
            @click="goCreateWorkspace"
          >
            <span class="text-[16px] leading-none">+</span>
            <span>Create or join workspace</span>
          </button>
        </div>
      </div>
    </div>

    <ChannelSidebar />

    <div
      class="mt-auto flex h-[66px] items-center justify-between border-t border-slate-300 px-5 text-slate-500 transition-colors duration-200"
      :class="isNightMode ? 'bg-slate-100/90' : 'bg-[#f8fafc]'"
    >
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-500 transition-colors duration-150 hover:bg-slate-200/70 hover:text-amber-500"
          :title="isNightMode ? 'Switch to light mode' : 'Switch to night mode'"
          :aria-label="isNightMode ? 'Switch to light mode' : 'Switch to night mode'"
          @click="toggleThemeMode"
        >
          <svg v-if="isNightMode" viewBox="0 0 20 20" class="h-[20px] w-[20px] fill-current">
            <path d="M10 3a.9.9 0 0 1 .9.9v1.4a.9.9 0 1 1-1.8 0V3.9A.9.9 0 0 1 10 3Zm0 10.8a.9.9 0 0 1 .9.9v1.4a.9.9 0 1 1-1.8 0v-1.4a.9.9 0 0 1 .9-.9ZM4.5 9.1a.9.9 0 0 1 0 1.8H3.1a.9.9 0 1 1 0-1.8h1.4Zm12.4 0a.9.9 0 1 1 0 1.8h-1.4a.9.9 0 1 1 0-1.8h1.4ZM6.2 6.2a.9.9 0 0 1 1.3 0l.9.9a.9.9 0 1 1-1.3 1.3l-.9-.9a.9.9 0 0 1 0-1.3Zm5.4 5.4a.9.9 0 0 1 1.3 0l.9.9a.9.9 0 0 1-1.3 1.3l-.9-.9a.9.9 0 0 1 0-1.3ZM7.4 11.6a.9.9 0 0 1 0 1.3l-.9.9a.9.9 0 0 1-1.3-1.3l.9-.9a.9.9 0 0 1 1.3 0Zm6.4-6.4a.9.9 0 0 1 0 1.3l-.9.9a.9.9 0 0 1-1.3-1.3l.9-.9a.9.9 0 0 1 1.3 0ZM10 7.1a2.9 2.9 0 1 1 0 5.8 2.9 2.9 0 0 1 0-5.8Z" />
          </svg>
          <svg v-else viewBox="0 0 20 20" class="h-[20px] w-[20px] fill-current">
            <path d="M11.2 2.3a.9.9 0 0 1 .8 1.3 6.6 6.6 0 0 0 8.5 8.6.9.9 0 0 1 1.2 1 8.6 8.6 0 1 1-10.5-10.9Z" />
          </svg>
        </button>

        <button
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-500 transition-colors duration-150 hover:bg-slate-200/70 hover:text-indigo-600"
          :class="route.path.startsWith('/settings') ? 'bg-indigo-50 text-indigo-600' : ''"
          title="Settings"
          aria-label="Open settings"
          @click="goSettings"
        >
          <svg viewBox="0 0 20 20" class="h-[20px] w-[20px] fill-current">
            <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h3A1.5 1.5 0 0 1 10 5.5v.2h6a1 1 0 1 1 0 2h-6v.3A1.5 1.5 0 0 1 8.5 9.5h-3A1.5 1.5 0 0 1 4 8V7.7H3a1 1 0 1 1 0-2h1v-.2ZM4 12.2a1 1 0 1 1 0-2h6v-.3A1.5 1.5 0 0 1 11.5 8.4h3A1.5 1.5 0 0 1 16 9.9v.3h1a1 1 0 1 1 0 2h-1v.3a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5v-.3H4Zm2-.8h2V6h-2v5.4Zm6 1.8h2v-3h-2v3Z" />
          </svg>
        </button>

        <button
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-500 transition-colors duration-150 hover:bg-slate-200/70 hover:text-cyan-600"
          :class="route.path.startsWith('/admin') ? 'bg-cyan-50 text-cyan-600' : ''"
          title="Admin"
          aria-label="Open admin"
          @click="goAdmin"
        >
          <svg viewBox="0 0 20 20" class="h-[20px] w-[20px] fill-current">
            <path d="M7 9.2A2.7 2.7 0 1 1 7 3.8a2.7 2.7 0 0 1 0 5.4Zm6 1.2a2.2 2.2 0 1 1 0-4.4 2.2 2.2 0 0 1 0 4.4ZM2.5 15.8c0-2.2 1.8-4 4-4h1c2.2 0 4 1.8 4 4v.7H2.5v-.7Zm9.2.7v-.7c0-1-.3-1.9-.9-2.6.3-.1.7-.2 1.1-.2h.5a3.3 3.3 0 0 1 3.3 3.3v.2h-4Z" />
          </svg>
        </button>
      </div>

      <button
        type="button"
        class="inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-500 transition-colors duration-150 hover:bg-slate-200/70 hover:text-rose-600"
        title="Logout"
        aria-label="Log out"
        @click="handleLogout"
      >
        <svg viewBox="0 0 20 20" class="h-[20px] w-[20px] fill-current">
          <path d="M3 3.8A1.8 1.8 0 0 1 4.8 2h5.4A1.8 1.8 0 0 1 12 3.8v2a1 1 0 1 1-2 0V4H5v12h5v-1.8a1 1 0 1 1 2 0v2A1.8 1.8 0 0 1 10.2 18H4.8A1.8 1.8 0 0 1 3 16.2V3.8Zm9.2 3.1a1 1 0 0 1 1.4 0l3.2 3.1a1 1 0 0 1 0 1.4l-3.2 3.1a1 1 0 1 1-1.4-1.4l1.4-1.3H8.7a1 1 0 1 1 0-2h4.9l-1.4-1.3a1 1 0 0 1 0-1.4Z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import ChannelSidebar from "./ChannelSidebar.vue";
import { useWorkspace } from "../../composables/use-workspace";
import { useChannelApi } from "../../composables/use-channel-api";

const { workspace, workspaces, workspaceInitial, loadWorkspace, saveWorkspace } = useWorkspace();
const { fetchChannels } = useChannelApi();
const route = useRoute();
const router = useRouter();

const isWorkspaceMenuOpen = ref(false);
const actionWorkspaceId = ref<string | null>(null);
const workspaceMenuRef = ref<HTMLElement | null>(null);
const inviteCopyStatus = ref("");
const isNightMode = ref(false);

const badgeColors = ["bg-indigo-500", "bg-emerald-500", "bg-amber-500", "bg-pink-500", "bg-cyan-500"];

const workspaceOptions = computed(() => {
  const source = workspaces.value.length
    ? workspaces.value
    : [
        {
          id: workspace.value.id,
          name: workspace.value.name,
          slug: workspace.value.slug,
          role: workspace.value.role,
          inviteCode: workspace.value.inviteCode,
        },
      ];

  return source.map((item, index) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    members: "workspace",
    roleLabel: (item.role || "member").toLowerCase(),
    inviteCode: item.inviteCode ?? null,
    badgeColor: badgeColors[index % badgeColors.length],
  }));
});

const activeInviteCode = computed(() => {
  const active = workspaceOptions.value.find((item) => item.id === workspace.value.id || item.slug === workspace.value.slug);
  return active?.inviteCode || null;
});

const selectWorkspace = async (item: (typeof workspaceOptions.value)[number]) => {
  saveWorkspace({
    id: item.id,
    name: item.name,
    slug: item.slug,
    createdAt: new Date().toISOString(),
    inviteCode: item.inviteCode ?? undefined,
  });
  isWorkspaceMenuOpen.value = false;
  actionWorkspaceId.value = null;

  try {
    const channels = await fetchChannels(item.id);
    const defaultChannel = channels.find((channel) => channel.name === "general") ?? channels[0];
    if (defaultChannel) {
      await router.push(`/workspace/${item.id}/channel/${defaultChannel.id}`);
      return;
    }
  } catch {
    // fallback path
  }

  await router.push(`/workspace/${item.id}/channel/general`);
};

const goCreateWorkspace = async () => {
  isWorkspaceMenuOpen.value = false;
  actionWorkspaceId.value = null;
  await router.push("/workspace/create");
};

const goSettings = async () => {
  await router.push("/settings");
};

const goAdmin = async () => {
  await router.push("/admin");
};

const applyThemeMode = (night: boolean) => {
  if (typeof document === "undefined") {
    return;
  }
  document.documentElement.setAttribute("data-ui-theme", night ? "night" : "day");
};

const toggleThemeMode = () => {
  isNightMode.value = !isNightMode.value;
  localStorage.setItem("appchat_theme_mode", isNightMode.value ? "night" : "day");
  applyThemeMode(isNightMode.value);
};

const handleLogout = async () => {
  localStorage.removeItem("appchat_access_token");
  localStorage.removeItem("appchat_user");
  localStorage.removeItem("appchat_workspace");
  await router.push("/sign-in");
};

const handleOutsideClick = (event: MouseEvent) => {
  if (!isWorkspaceMenuOpen.value && !actionWorkspaceId.value) return;
  const target = event.target as Node | null;
  if (!target) return;
  if (workspaceMenuRef.value && !workspaceMenuRef.value.contains(target)) {
    isWorkspaceMenuOpen.value = false;
    actionWorkspaceId.value = null;
  }
};

const toggleActions = (workspaceId: string) => {
  actionWorkspaceId.value = actionWorkspaceId.value === workspaceId ? null : workspaceId;
};

const copyInviteCode = async (code: string | null) => {
  if (!code) {
    inviteCopyStatus.value = "Invite code is available for admins only.";
    return;
  }

  try {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(code);
      inviteCopyStatus.value = `Copied ${code}`;
    } else {
      inviteCopyStatus.value = code;
    }
    actionWorkspaceId.value = null;
    setTimeout(() => {
      if (inviteCopyStatus.value.startsWith("Copied")) {
        inviteCopyStatus.value = "";
      }
    }, 1800);
  } catch {
    inviteCopyStatus.value = "Unable to copy invite code right now.";
  }
};

onMounted(() => {
  loadWorkspace();
  const storedMode = localStorage.getItem("appchat_theme_mode");
  isNightMode.value = storedMode === "night";
  applyThemeMode(isNightMode.value);
  document.addEventListener("mousedown", handleOutsideClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleOutsideClick);
});
</script>
