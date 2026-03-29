<template>
  <div class="flex-1 overflow-y-auto px-2.5 py-3">
    <nav class="space-y-1 text-[16px] text-[#4b5565]">
      <button class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors duration-150 hover:bg-slate-200/70">
        <svg viewBox="0 0 20 20" class="h-4 w-4 fill-current text-slate-500">
          <path d="m10 3 6 6v7.2a.8.8 0 0 1-.8.8h-2.9a.8.8 0 0 1-.8-.8V13h-3v3.2a.8.8 0 0 1-.8.8H4.8a.8.8 0 0 1-.8-.8V9l6-6Zm0 2.2L6 9v6h1.9V11.8c0-.4.3-.8.8-.8h3c.4 0 .8.4.8.8V15H14V9l-4-3.8Z" />
        </svg>
        <span>Home</span>
      </button>

      <button class="flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left transition-colors duration-150 hover:bg-slate-200/70">
        <span class="flex items-center gap-2.5">
          <svg viewBox="0 0 20 20" class="h-4 w-4 fill-current text-indigo-500">
            <path d="M3.2 4.5h13.6c.4 0 .7.3.7.7v9.6a.7.7 0 0 1-.7.7H3.2a.7.7 0 0 1-.7-.7V5.2c0-.4.3-.7.7-.7Zm1.3 1.4v1.9H2.5v4.4h2v1.9h11v-1.9h2V7.8h-2V5.9h-11Z" />
          </svg>
          <span>Inbox</span>
        </span>
        <Badge>18</Badge>
      </button>
    </nav>

    <p v-if="sidebarError" class="mt-3 rounded-md border border-red-200 bg-red-50 px-2.5 py-2 text-xs text-red-700">
      {{ sidebarError }}
    </p>

    <div class="mt-5">
      <p class="mb-1.5 flex items-center gap-2 px-2 text-[13px] font-bold tracking-[0.08em] text-[#64748b]">
        <svg viewBox="0 0 20 20" class="h-3.5 w-3.5 fill-current">
          <path d="M5.3 7.7a1 1 0 0 1 1.4 0L10 11l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z" />
        </svg>
        <span>CHANNELS</span>
      </p>

      <div class="space-y-0.5 text-[17px] text-[#475569]">
        <button
          v-for="channel in channels"
          :key="channel.id || channel.slug"
          type="button"
          class="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left transition-colors duration-150"
          :class="channel.id === activeChannel || channel.slug === activeChannel ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-slate-200/70'"
          @click="goChannel(channel)"
        >
          <span class="flex min-w-0 items-center gap-2.5">
            <svg v-if="channel.private" viewBox="0 0 20 20" class="h-4 w-4 shrink-0 fill-current text-slate-400">
              <path d="M10 1.8a4 4 0 0 0-4 4v2H5a2 2 0 0 0-2 2v6.4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9.8a2 2 0 0 0-2-2h-1v-2a4 4 0 0 0-4-4Zm2.3 6V5.8a2.3 2.3 0 0 0-4.6 0v2h4.6Z" />
            </svg>
            <span v-else class="text-[30px] leading-none">#</span>
            <span class="truncate">{{ channel.name }}</span>
          </span>
          <Badge v-if="channel.badge">{{ channel.badge }}</Badge>
        </button>

        <button
          type="button"
          class="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-slate-400 transition-colors duration-150 hover:bg-slate-200/70"
          @click="isCreateChannelOpen = true"
        >
          <span class="text-[22px] leading-none">+</span>
          <span>Add channel</span>
        </button>
      </div>
    </div>

    <div class="mt-5">
      <p class="mb-2 flex items-center gap-2 px-2 text-[13px] font-bold tracking-[0.08em] text-slate-500">
        <svg viewBox="0 0 20 20" class="h-3.5 w-3.5 fill-current">
          <path d="M5.3 7.7a1 1 0 0 1 1.4 0L10 11l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z" />
        </svg>
        DIRECT MESSAGES
      </p>

      <div class="space-y-1">
        <button
          v-for="person in directMessages"
          :key="person.id"
          type="button"
          class="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left transition-colors duration-150 hover:bg-slate-200/70"
          :class="activeDirectMessage === person.id ? 'bg-indigo-100' : ''"
          @click="goDirectMessage(person)"
        >
          <span class="flex items-center gap-2.5">
            <span class="relative">
              <Avatar size="sm" :color="person.color" :initials="person.initials" />
              <span
                class="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#f8fafc]"
                :class="person.statusColor"
              />
            </span>
            <span class="text-[17px]" :class="activeDirectMessage === person.id ? 'text-indigo-600' : 'text-slate-700'">{{ person.name }}</span>
          </span>
        </button>
      </div>
    </div>

    <div
      v-if="isCreateChannelOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      @click.self="closeCreateModal"
    >
      <div class="w-[420px] rounded-lg border border-slate-200 bg-white p-5 shadow-[0_18px_36px_rgba(15,23,42,0.22)]">
        <h3 class="text-[20px] font-semibold text-[#1d1c1d]">Create a channel</h3>
        <p class="mt-1 text-[14px] text-[#616061]">Channels are where your team communicates.</p>

        <label class="mt-4 block text-[14px] font-medium text-[#1d1c1d]">Channel name</label>
        <input
          v-model="newChannelName"
          type="text"
          class="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 text-[15px] text-[#1d1c1d] outline-none transition-colors focus:border-indigo-500"
          placeholder="e.g. product-updates"
          @keydown.enter.prevent="createChannel"
        />

        <label class="mt-3 flex cursor-pointer items-center gap-3 rounded-md border border-slate-200 px-3 py-2.5 hover:bg-slate-50">
          <input v-model="newChannelPrivate" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
          <div>
            <p class="text-[14px] font-medium text-[#1d1c1d]">Make private</p>
            <p class="text-[12px] text-[#616061]">Only invited members can access this channel.</p>
          </div>
        </label>

        <label class="mt-3 block text-[14px] font-medium text-[#1d1c1d]">Invite emails (optional)</label>
        <input
          v-model="inviteEmailsRaw"
          type="text"
          class="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 text-[14px] text-[#1d1c1d] outline-none transition-colors focus:border-indigo-500"
          placeholder="e.g. sarah@company.com, jordan@company.com"
        />
        <p v-if="createChannelError" class="mt-2 text-[12px] font-medium text-red-600">{{ createChannelError }}</p>

        <div class="mt-4 flex justify-end gap-2">
          <button
            type="button"
            class="rounded-md px-3 py-2 text-[14px] font-medium text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="createChannelSubmitting"
            @click="closeCreateModal"
          >
            Cancel
          </button>
          <button
            type="button"
            class="rounded-md bg-indigo-600 px-4 py-2 text-[14px] font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
            :disabled="!newChannelName.trim() || createChannelSubmitting"
            @click="createChannel"
          >
            {{ createChannelSubmitting ? "Creating..." : "Create channel" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Avatar from "../ui/Avatar.vue";
import Badge from "../ui/Badge.vue";
import { useWorkspace } from "../../composables/use-workspace";
import { useChannelApi } from "../../composables/use-channel-api";
import { usePresenceApi } from "../../composables/use-presence-api";
import { useDmApi } from "../../composables/use-dm-api";

const route = useRoute();
const router = useRouter();
const { workspace, loadWorkspace } = useWorkspace();
const { fetchChannels, createChannel: createChannelApi, inviteMember } = useChannelApi();
const { fetchWorkspacePresence } = usePresenceApi();
const { openDirectMessage } = useDmApi();

type ChannelItem = {
  id?: string;
  slug: string;
  name: string;
  private?: boolean;
  badge?: number;
  custom?: boolean;
};

type DirectMessageItem = {
  id: string;
  name: string;
  initials: string;
  color: string;
  statusColor: string;
};

const baseChannels: ChannelItem[] = [
  { id: "general", slug: "general", name: "general" },
  { id: "announcements", slug: "announcements", name: "announcements" },
];

const customChannels = ref<ChannelItem[]>([]);
const directMessages = ref<DirectMessageItem[]>([]);
const sidebarError = ref("");

const isCreateChannelOpen = ref(false);
const newChannelName = ref("");
const newChannelPrivate = ref(false);
const inviteEmailsRaw = ref("");
const createChannelError = ref("");
const createChannelSubmitting = ref(false);

const activeChannel = computed(() => String(route.params.channelId ?? "general"));
const activeDirectMessage = computed(() => String(route.params.memberId ?? ""));
const currentWorkspaceRef = computed(() => String(route.params.workspaceId ?? workspace.value.id ?? ""));
const channels = computed(() => [...baseChannels, ...customChannels.value]);

const isClient = typeof window !== "undefined";
const workspaceStorageKey = computed(() => `appchat_channels_${workspace.value.id || "workspace"}`);

const statusToDot = (status: string) => {
  switch (status) {
    case "online":
      return "bg-emerald-500";
    case "away":
      return "bg-amber-400";
    case "dnd":
      return "bg-red-500";
    default:
      return "bg-slate-400";
  }
};

const palette = ["bg-pink-500", "bg-emerald-500", "bg-amber-500", "bg-indigo-500", "bg-cyan-500"];

const nameColor = (name: string) => {
  const seed = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return palette[seed % palette.length];
};

const initialsFor = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

const loadCachedChannels = () => {
  if (!isClient) {
    return;
  }

  const raw = localStorage.getItem(workspaceStorageKey.value);
  if (!raw) {
    customChannels.value = [];
    return;
  }

  try {
    const parsed = JSON.parse(raw) as ChannelItem[];
    customChannels.value = parsed.filter((item) => item.custom);
  } catch {
    customChannels.value = [];
  }
};

const saveCachedChannels = () => {
  if (!isClient) {
    return;
  }
  localStorage.setItem(workspaceStorageKey.value, JSON.stringify(customChannels.value));
};

const closeCreateModal = () => {
  isCreateChannelOpen.value = false;
  newChannelName.value = "";
  newChannelPrivate.value = false;
  inviteEmailsRaw.value = "";
  createChannelError.value = "";
  createChannelSubmitting.value = false;
};

const createChannel = async () => {
  if (!workspace.value.id || workspace.value.id === "workspace-default") {
    createChannelError.value = "Workspace is not ready yet. Please refresh and try again.";
    return;
  }

  createChannelSubmitting.value = true;
  createChannelError.value = "";
  sidebarError.value = "";

  try {
    const created = await createChannelApi(workspace.value.id, {
      name: newChannelName.value.trim(),
      type: newChannelPrivate.value ? "PRIVATE" : "PUBLIC",
    });

    const channelFromApi: ChannelItem = {
      id: created.id,
      slug: created.slug,
      name: created.name,
      private: created.private,
      custom: true,
    };

    customChannels.value = [
      ...customChannels.value.filter((item) => item.slug !== channelFromApi.slug),
      channelFromApi,
    ];
    saveCachedChannels();

    const emails = [
      ...new Set(
        inviteEmailsRaw.value
          .split(",")
          .map((item) => item.trim().toLowerCase())
          .filter(Boolean),
      ),
    ];

    for (const email of emails) {
      await inviteMember(workspace.value.id, created.id, email);
    }

    await refreshChannelsFromApi();
    closeCreateModal();
    await router.push(`/workspace/${currentWorkspaceRef.value}/channel/${created.id}`);
  } catch {
    createChannelError.value = "Failed to create channel. Please try again.";
  } finally {
    createChannelSubmitting.value = false;
  }
};

const goChannel = async (channel: ChannelItem) => {
  await router.push(`/workspace/${currentWorkspaceRef.value}/channel/${channel.id || channel.slug}`);
};

const goDirectMessage = async (person: DirectMessageItem) => {
  sidebarError.value = "";
  try {
    await openDirectMessage(currentWorkspaceRef.value, person.id);
    await router.push(`/workspace/${currentWorkspaceRef.value}/dm/${person.id}`);
  } catch {
    sidebarError.value = "Unable to open direct message.";
  }
};

const refreshChannelsFromApi = async () => {
  if (!workspace.value.id || workspace.value.id === "workspace-default") {
    return;
  }

  const fromApi = await fetchChannels(workspace.value.id);
  const normalized: ChannelItem[] = fromApi.map((item) => ({
    id: item.id,
    slug: item.slug,
    name: item.name,
    private: item.private,
    custom: !baseChannels.some((base) => base.name === item.name),
  }));

  customChannels.value = normalized.filter((item) => item.custom);
  saveCachedChannels();
};

const refreshDirectMessages = async () => {
  if (!workspace.value.id || workspace.value.id === "workspace-default") {
    directMessages.value = [];
    return;
  }

  const members = await fetchWorkspacePresence(workspace.value.id);
  directMessages.value = members
    .filter((member) => !member.isSelf)
    .map((member) => ({
      id: member.id,
      name: member.name,
      initials: initialsFor(member.name),
      color: nameColor(member.name),
      statusColor: statusToDot(member.status),
    }));
};

const refreshSidebarData = async () => {
  sidebarError.value = "";
  loadCachedChannels();

  try {
    await Promise.all([refreshChannelsFromApi(), refreshDirectMessages()]);
  } catch {
    sidebarError.value = "Some sidebar data failed to load.";
  }
};

onMounted(async () => {
  await loadWorkspace();
  await refreshSidebarData();
});

watch(
  () => workspace.value.id,
  async () => {
    await refreshSidebarData();
  },
);
</script>
