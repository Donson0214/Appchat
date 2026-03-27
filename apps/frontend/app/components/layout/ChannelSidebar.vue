<template>
  <div class="flex-1 overflow-y-auto px-2 py-2.5">
    <nav class="space-y-0.5 text-[13px] font-medium leading-[18px] text-[#616061]">
      <button class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors duration-150 hover:bg-[#eef0f5]">
        <svg viewBox="0 0 20 20" class="h-4 w-4 fill-current text-slate-500">
          <path d="m10 3 6 6v7.2a.8.8 0 0 1-.8.8h-2.9a.8.8 0 0 1-.8-.8V13h-3v3.2a.8.8 0 0 1-.8.8H4.8a.8.8 0 0 1-.8-.8V9l6-6Zm0 2.2L6 9v6h1.9V11.8c0-.4.3-.8.8-.8h3c.4 0 .8.4.8.8V15H14V9l-4-3.8Z" />
        </svg>
        <span>Home</span>
      </button>

      <button class="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left transition-colors duration-150 hover:bg-[#eef0f5]">
        <span class="flex items-center gap-2.5">
          <svg viewBox="0 0 20 20" class="h-4 w-4 fill-current text-indigo-500">
            <path d="M3.2 4.5h13.6c.4 0 .7.3.7.7v9.6a.7.7 0 0 1-.7.7H3.2a.7.7 0 0 1-.7-.7V5.2c0-.4.3-.7.7-.7Zm1.3 1.4v1.9H2.5v4.4h2v1.9h11v-1.9h2V7.8h-2V5.9h-11Z" />
          </svg>
          <span>Inbox</span>
        </span>
        <Badge>18</Badge>
      </button>
    </nav>

    <div class="mt-4">
      <p class="mb-1.5 flex items-center gap-1.5 px-2 text-[13px] font-semibold tracking-[0.04em] text-[#667085]">
        <svg viewBox="0 0 20 20" class="h-3.5 w-3.5 fill-current">
          <path d="M5.3 7.7a1 1 0 0 1 1.4 0L10 11l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z" />
        </svg>
        <span>Channels</span>
      </p>

      <div class="space-y-0.5 text-[13px] font-medium leading-[18px] text-[#616061]">
        <p v-if="loadingChannels" class="px-3 py-2 text-[14px] text-slate-400">Loading channels...</p>

        <button
          v-for="channel in channels"
          :key="channel.id"
          type="button"
          class="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left transition-colors duration-150"
          :class="channel.id === activeChannel ? 'bg-[#e8ebf7] text-[#1D1C1D] font-semibold' : 'hover:bg-[#eef0f5]'"
          @click="goChannel(channel.id)"
        >
          <span class="flex min-w-0 items-center gap-2.5">
            <svg v-if="channel.type === 'PRIVATE'" viewBox="0 0 20 20" class="h-4 w-4 shrink-0 fill-current text-slate-400">
              <path d="M10 1.8a4 4 0 0 0-4 4v2H5a2 2 0 0 0-2 2v6.4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9.8a2 2 0 0 0-2-2h-1v-2a4 4 0 0 0-4-4Zm2.3 6V5.8a2.3 2.3 0 0 0-4.6 0v2h4.6Z" />
            </svg>
            <span v-else class="text-[16px] leading-none">#</span>
            <span class="truncate">{{ channel.name }}</span>
          </span>
        </button>

        <p v-if="!loadingChannels && channels.length === 0" class="px-3 py-2 text-[14px] text-slate-400">No channels yet. Create your first one.</p>

        <button
          type="button"
          class="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[#8f95a3] transition-colors duration-150 hover:bg-[#eef0f5]"
          @click="openCreateModal"
        >
          <span class="text-[22px] leading-none">+</span>
          <span>Add channel</span>
        </button>
      </div>
    </div>

    <div class="mt-4">
      <p class="mb-1.5 flex items-center gap-1.5 px-2 text-[13px] font-semibold tracking-[0.04em] text-[#667085]">
        <svg viewBox="0 0 20 20" class="h-3.5 w-3.5 fill-current">
          <path d="M5.3 7.7a1 1 0 0 1 1.4 0L10 11l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z" />
        </svg>
        Direct Messages
      </p>

      <div class="space-y-1">
        <p v-if="loadingMembers" class="px-2 py-2 text-[14px] text-slate-400">Loading people...</p>

        <button
          v-for="person in directMessages"
          :key="person.id"
          type="button"
          class="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left transition-colors duration-150 hover:bg-[#eef0f5]"
        >
          <span class="flex items-center gap-2.5">
            <span class="relative">
              <Avatar size="sm" :color="person.color" :initials="person.initials" />
              <span class="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#f8fafc] bg-emerald-500" />
            </span>
            <span class="text-[13px] font-medium leading-[18px] text-[#616061]">{{ person.name }}</span>
          </span>
        </button>

        <p v-if="!loadingMembers && directMessages.length === 0" class="px-2 py-2 text-[14px] text-slate-400">No teammates yet.</p>

        <button class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[#8f95a3] transition-colors duration-150 hover:bg-[#eef0f5]">
          <span class="text-[20px] leading-none">+</span>
          <span>New direct message</span>
        </button>
      </div>
    </div>

    <div
      v-if="isCreateChannelOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      @click.self="closeCreateModal"
    >
      <div class="w-[560px] rounded-[10px] border border-[#e5e7eb] bg-white p-6 shadow-[0_18px_36px_rgba(15,23,42,0.22)]">
        <h3 class="text-[20px] font-semibold text-[#1d1c1d]">Create a channel</h3>
        <p class="mt-1 inline-flex items-center gap-1.5 text-[13px] text-slate-500">
          <svg viewBox="0 0 20 20" class="h-3.5 w-3.5 fill-current">
            <path d="M10 1.8a4 4 0 0 0-4 4v2H5a2 2 0 0 0-2 2v6.4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9.8a2 2 0 0 0-2-2h-1v-2a4 4 0 0 0-4-4Zm2.3 6V5.8a2.3 2.3 0 0 0-4.6 0v2h4.6Z" />
          </svg>
          <span>1</span>
        </p>

        <template v-if="createStep === 1">
          <p class="mt-1 text-[14px] text-[#616061]">Channels are where your team communicates.</p>

          <label class="mt-5 block text-[14px] font-medium text-[#1d1c1d]">Channel name</label>
          <input
            v-model="newChannelName"
            type="text"
            class="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 text-[15px] text-[#1d1c1d] outline-none transition-colors focus:border-indigo-500"
            placeholder="e.g. product-updates"
            @keydown.enter.prevent="goToStep2"
          />

          <p v-if="createError" class="mt-3 text-[13px] text-red-600">{{ createError }}</p>

          <div class="mt-8 flex items-center justify-between">
            <p class="text-[30px] font-medium text-[#616061]">Step 1 of 2</p>
            <div class="flex gap-2">
              <button type="button" class="rounded-md border border-slate-300 px-6 py-2 text-[14px] font-semibold text-slate-700 hover:bg-slate-100" @click="closeCreateModal">Cancel</button>
              <button
                type="button"
                class="rounded-md bg-indigo-600 px-6 py-2 text-[14px] font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
                :disabled="!newChannelName.trim()"
                @click="goToStep2"
              >
                Next
              </button>
            </div>
          </div>
        </template>

        <template v-else>
          <p class="mt-4 text-[14px] font-semibold text-[#1d1c1d]">Visibility</p>

          <div class="mt-4 space-y-3">
            <label class="flex items-start gap-3 rounded-md px-1 py-1.5">
              <input
                v-model="channelVisibility"
                type="radio"
                name="channel-visibility"
                value="PUBLIC"
                class="mt-1 h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <p class="text-[13px] leading-tight text-[#1d1c1d]">Public - Anyone in {{ workspace.name }}</p>
              </div>
            </label>

            <label class="flex items-start gap-3 rounded-md px-1 py-1.5">
              <input
                v-model="channelVisibility"
                type="radio"
                name="channel-visibility"
                value="PRIVATE"
                class="mt-1 h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <p class="text-[13px] leading-tight text-[#1d1c1d]">Private - Only specific people</p>
                <p class="mt-0.5 text-[13px] text-[#616061]">Can only be viewed or joined by invitation</p>
              </div>
            </label>
          </div>

          <p v-if="createError" class="mt-3 text-[13px] text-red-600">{{ createError }}</p>

          <div class="mt-8 flex items-center justify-between">
            <p class="text-[30px] font-medium text-[#616061]">Step 2 of 2</p>
            <div class="flex gap-2">
              <button type="button" class="rounded-md border border-slate-300 px-6 py-2 text-[14px] font-semibold text-slate-700 hover:bg-slate-100" @click="createStep = 1">Back</button>
              <button
                type="button"
                class="rounded-md bg-emerald-700 px-6 py-2 text-[14px] font-semibold text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-emerald-400"
                :disabled="creatingChannel"
                @click="createChannel"
              >
                {{ creatingChannel ? "Creating..." : "Create" }}
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { navigateTo, useRoute } from "#imports";
import Avatar from "../ui/Avatar.vue";
import Badge from "../ui/Badge.vue";
import { useWorkspace } from "../../composables/use-workspace";
import { useChatApi } from "../../composables/use-chat-api";

const route = useRoute();
const { workspace, loadWorkspace, saveWorkspace } = useWorkspace();
const { listChannels, createChannel: createChannelApi, listWorkspaceMembers, listMyWorkspaces } = useChatApi();

type ApiChannelItem = {
  id: string;
  name: string;
  type: "PUBLIC" | "PRIVATE";
};

type DirectMessageItem = {
  id: string;
  name: string;
  initials: string;
  color: string;
};

const colorPalette = ["bg-pink-500", "bg-emerald-500", "bg-amber-500", "bg-indigo-500", "bg-cyan-500", "bg-rose-500"];

const channels = ref<ApiChannelItem[]>([]);
const directMessages = ref<DirectMessageItem[]>([]);
const loadingChannels = ref(false);
const loadingMembers = ref(false);
const creatingChannel = ref(false);
const createError = ref("");

const isCreateChannelOpen = ref(false);
const createStep = ref<1 | 2>(1);
const newChannelName = ref("");
const channelVisibility = ref<"PUBLIC" | "PRIVATE">("PUBLIC");

const activeChannel = computed(() => String(route.params.channelId ?? ""));

const initialsFor = (value: string) => {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "U";
  if (parts.length === 1) return parts.at(0)?.[0]?.toUpperCase() ?? "U";
  return `${parts.at(0)?.[0] ?? ""}${parts.at(1)?.[0] ?? ""}`.toUpperCase();
};

const loadSidebarData = async () => {
  loadingChannels.value = true;
  loadingMembers.value = true;

  try {
    if (!workspace.value.id || workspace.value.id === "local-default") {
      const workspaces = await listMyWorkspaces();
      const firstWorkspace = workspaces[0]?.workspace;
      if (firstWorkspace) {
        saveWorkspace({
          id: firstWorkspace.id,
          name: firstWorkspace.name,
          slug: firstWorkspace.slug,
          createdAt: firstWorkspace.createdAt,
          inviteCode: firstWorkspace.inviteCode,
        });
      }
    }

    if (!workspace.value.id || workspace.value.id === "local-default") {
      channels.value = [];
      directMessages.value = [];
      return;
    }

    const [channelList, memberList] = await Promise.all([
      listChannels(workspace.value.id),
      listWorkspaceMembers(workspace.value.id),
    ]);

    channels.value = channelList.map((channel) => ({
      id: channel.id,
      name: channel.name,
      type: channel.type,
    }));

    const currentUserRaw = process.client ? localStorage.getItem("appchat_user") : null;
    const currentUser = currentUserRaw ? (JSON.parse(currentUserRaw) as { id?: string }) : null;

    directMessages.value = memberList
      .filter((member) => member.user.id !== currentUser?.id)
      .map((member, index) => {
        const name = member.user.name || member.user.email.split("@")[0] || "User";
        return {
          id: member.user.id,
          name,
          initials: initialsFor(name),
          color: colorPalette[index % colorPalette.length] ?? "bg-slate-500",
        };
      });
  } catch {
    channels.value = [];
    directMessages.value = [];
  } finally {
    loadingChannels.value = false;
    loadingMembers.value = false;
  }
};

const openCreateModal = () => {
  isCreateChannelOpen.value = true;
  createStep.value = 1;
  createError.value = "";
};

const closeCreateModal = () => {
  isCreateChannelOpen.value = false;
  createStep.value = 1;
  newChannelName.value = "";
  channelVisibility.value = "PUBLIC";
  createError.value = "";
};

const goToStep2 = () => {
  if (!newChannelName.value.trim()) {
    createError.value = "Channel name is required";
    return;
  }

  createError.value = "";
  createStep.value = 2;
};

const createChannel = async () => {
  if (!workspace.value.id || !newChannelName.value.trim()) {
    return;
  }

  try {
    creatingChannel.value = true;
    createError.value = "";

    const channel = await createChannelApi(workspace.value.id, {
      name: newChannelName.value.trim(),
      type: channelVisibility.value,
    });

    closeCreateModal();
    await loadSidebarData();
    await navigateTo(`/workspace/${workspace.value.slug}/channel/${channel.id}`);
  } catch (error: any) {
    createError.value = error?.data?.message ?? "Unable to create channel";
  } finally {
    creatingChannel.value = false;
  }
};

const goChannel = async (channelId: string) => {
  await navigateTo(`/workspace/${workspace.value.slug}/channel/${channelId}`);
};

onMounted(async () => {
  loadWorkspace();
  await loadSidebarData();
});

watch(
  () => workspace.value.id,
  async () => {
    await loadSidebarData();
  },
);
</script>
