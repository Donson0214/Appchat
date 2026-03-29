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

    <div class="mt-auto flex h-[66px] items-center justify-between border-t border-slate-300 px-5 text-slate-500">
      <div class="flex items-center gap-4">
        <button class="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-200 hover:bg-slate-200/70">
          <svg viewBox="0 0 20 20" class="h-5 w-5 fill-current">
            <path d="M10 2.5a.8.8 0 0 1 .7 1.2 5.8 5.8 0 1 0 5.6 8.5.8.8 0 0 1 1.4.7A7.4 7.4 0 1 1 10 2.5Z" />
          </svg>
        </button>
        <button class="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-200 hover:bg-slate-200/70" @click="goSettings">
          <svg viewBox="0 0 20 20" class="h-5 w-5 fill-current">
            <path d="M8.5 2.5h3l.3 1.8a5.8 5.8 0 0 1 1.5.9l1.7-.8 2.1 2.1-.8 1.7c.4.5.7 1 .9 1.5l1.8.3v3l-1.8.3a5.8 5.8 0 0 1-.9 1.5l.8 1.7-2.1 2.1-1.7-.8c-.5.4-1 .7-1.5.9l-.3 1.8h-3l-.3-1.8a5.8 5.8 0 0 1-1.5-.9l-1.7.8-2.1-2.1.8-1.7a5.8 5.8 0 0 1-.9-1.5L1 11.5v-3l1.8-.3c.2-.5.5-1 .9-1.5L2.9 5l2.1-2.1 1.7.8c.5-.4 1-.7 1.5-.9l.3-1.8Zm1.5 5.3a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4Z" />
          </svg>
        </button>
        <button class="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-200 hover:bg-slate-200/70" @click="goAdmin">
          <svg viewBox="0 0 20 20" class="h-5 w-5 fill-current">
            <path d="M6.8 9a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm6.4 1.2a2.6 2.6 0 1 1 0-5.2 2.6 2.6 0 0 1 0 5.2ZM2.5 15.7A4.7 4.7 0 0 1 7.2 11h.7a4.7 4.7 0 0 1 4.7 4.7v.8H2.5v-.8Zm10.2.8v-.8c0-1.2-.4-2.3-1-3.2.4-.1.8-.2 1.3-.2h.4a4 4 0 0 1 4 4v.2h-4.7Z" />
          </svg>
        </button>
      </div>
      <button class="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-200 hover:bg-slate-200/70">
        <svg viewBox="0 0 20 20" class="h-5 w-5 fill-current">
          <path d="M11 3.5a1 1 0 1 1 2 0v2h2.5a2 2 0 0 1 2 2V14a2 2 0 0 1-2 2H13v2a1 1 0 1 1-2 0v-2h-3a1 1 0 0 1 0-2h6.5a.5.5 0 0 0 .5-.5V7.5a.5.5 0 0 0-.5-.5H8A1 1 0 1 1 8 5h3V3.5ZM4.3 6.3a1 1 0 0 1 1.4 0l2.5 2.5a1 1 0 1 1-1.4 1.4L6 9.4V15a1 1 0 1 1-2 0V9.4l-.8.8a1 1 0 0 1-1.4-1.4l2.5-2.5Z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import ChannelSidebar from "./ChannelSidebar.vue";
import { useWorkspace } from "../../composables/use-workspace";
import { useChannelApi } from "../../composables/use-channel-api";

const { workspace, workspaces, workspaceInitial, loadWorkspace, saveWorkspace } = useWorkspace();
const { fetchChannels } = useChannelApi();
const router = useRouter();

const isWorkspaceMenuOpen = ref(false);
const actionWorkspaceId = ref<string | null>(null);
const workspaceMenuRef = ref<HTMLElement | null>(null);
const inviteCopyStatus = ref("");

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
  document.addEventListener("mousedown", handleOutsideClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleOutsideClick);
});
</script>
