<template>
  <div class="h-screen overflow-hidden bg-white text-slate-800">
    <div class="flex h-full">
      <Sidebar />
      <WorkspaceSidebar />

      <main class="flex min-w-0 flex-1 flex-col">
        <AppHeader :channel="headerChannel" />
        <ChatContainer :channel="chatChannel" @send-message="handleSendMessage" @open-thread="handleOpenThread" />
      </main>

      <RightPanel :is-open="isThreadPanelOpen" :thread-message="selectedThreadMessage" @close="closeThreadPanel" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from "~/components/layout/Sidebar.vue";
import WorkspaceSidebar from "~/components/layout/WorkspaceSidebar.vue";
import Header from "~/components/layout/Header.vue";
import ChatContainer from "~/components/chat/ChatContainer.vue";
import RightPanel from "~/components/layout/RightPanel.vue";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { io, type Socket } from "socket.io-client";
import { useWorkspace } from "../../../../composables/use-workspace";
import { useChannelApi } from "../../../../composables/use-channel-api";
import { useMessageApi } from "../../../../composables/use-message-api";

type ChatMessage = {
  id: string;
  initials: string;
  color: string;
  name: string;
  time: string;
  pinned?: boolean;
  text: string;
  replies?: number;
  lastReply?: string;
  replyUsers?: Array<{ initials: string; color: string }>;
  reactions?: Array<{ emoji: string; count: number }>;
  attachment?: { name: string; size: string };
};

type ChannelView = {
  name: string;
  description: string;
  members: number;
  starCount: number;
  showWelcome?: boolean;
  showTopReactions?: boolean;
  typingNotice?: string;
  topReactions?: Array<{ emoji: string; count: number }>;
  messages: ChatMessage[];
};

type ThreadMessage = {
  id: string;
  initials: string;
  color: string;
  name: string;
  time: string;
  text: string;
  reactions?: Array<{ emoji: string; count: number }>;
  replies?: number;
};

type ChannelDirectoryItem = {
  id: string;
  name: string;
  slug: string;
  description: string;
  membersCount: number;
  private?: boolean;
};

const AppHeader = Header;

const route = useRoute();
const { workspace, loadWorkspace } = useWorkspace();
const { fetchChannels } = useChannelApi();
const { fetchMessages, sendMessage } = useMessageApi();

const channelId = computed(() => String(route.params.channelId ?? "general"));
const workspaceId = computed(() => String(route.params.workspaceId ?? workspace.value.id));

const apiChannels = ref<ChannelDirectoryItem[]>([]);
const cachedChannels = ref<ChannelDirectoryItem[]>([]);

const apiMessages = ref<ChatMessage[] | null>(null);
const socketRef = ref<Socket | null>(null);
const activeSocketRoom = ref<string>("");
const isThreadPanelOpen = ref(false);
const selectedThreadMessage = ref<ThreadMessage | null>(null);

const isClient = typeof window !== "undefined";

onMounted(() => {
  loadWorkspace();
  loadCachedChannels();
  void hydrateLiveChannel();
});

watch([workspaceId, channelId], () => {
  void hydrateLiveChannel();
  ensureSocketRoom();
});

const channels: Record<string, ChannelView> = {
  general: {
    name: "general",
    members: 6,
    description: "Company-wide announcements and watercooler chat",
    starCount: 3,
    showTopReactions: true,
    topReactions: [{ emoji: "👍", count: 2 }],
    messages: [
      {
        id: "g1",
        initials: "MW",
        color: "bg-emerald-500",
        name: "Marcus Webb",
        time: "10:31 AM",
        text: "Amazing work @sarah! The new token structure looks really clean. I love how the spacing scale is now consistent across all components.",
        reactions: [{ emoji: "👍", count: 2 }],
      },
      {
        id: "g2",
        initials: "PP",
        color: "bg-indigo-500",
        name: "Priya Patel",
        time: "10:45 AM",
        pinned: true,
        text: "Quick heads-up: team standup has moved to 10:00 AM starting next week. Calendar invites going out shortly. Please update your schedules.",
      },
      {
        id: "g3",
        initials: "JK",
        color: "bg-amber-500",
        name: "Jordan Kim",
        time: "11:02 AM",
        text: "The API migration is almost done. Down to the last 3 endpoints. Should be fully wrapped up by EOD today.",
        replies: 4,
        lastReply: "Last reply 5m ago",
        replyUsers: [
          { initials: "SC", color: "bg-pink-500" },
          { initials: "MW", color: "bg-emerald-500" },
        ],
      },
      {
        id: "g4",
        initials: "AM",
        color: "bg-indigo-500",
        name: "Alex Morgan",
        time: "11:08 AM",
        text: "Great progress @jordan! Let me know if you need anything from the design side for the new API response flows.",
      },
      {
        id: "g5",
        initials: "TB",
        color: "bg-red-500",
        name: "Tom Bradley",
        time: "11:30 AM",
        text: "Deployment pipeline is looking solid. Added extra health checks and rollback procedures. Detailed report attached.",
        attachment: { name: "deployment-report-march.pdf", size: "2.4 MB" },
      },
      {
        id: "g6",
        initials: "SC",
        color: "bg-pink-500",
        name: "Sarah Chen",
        time: "2:12 PM",
        text: "Reminder: design review at 3 PM today in the usual Huddle link. Everyone welcome - it should only take ~20 minutes.",
        reactions: [{ emoji: "👀", count: 4 }],
      },
      {
        id: "g7",
        initials: "MW",
        color: "bg-emerald-500",
        name: "Marcus Webb",
        time: "2:15 PM",
        text: "I'll have the wireframes ready before then. Also bringing the updated component specs for review.",
      },
      {
        id: "g8",
        initials: "PP",
        color: "bg-indigo-500",
        name: "Priya Patel",
        time: "3:45 PM",
        pinned: true,
        text: "Q2 roadmap doc is now shared in Notion. Please add your team's priorities by Friday @channel",
        reactions: [
          { emoji: "✅", count: 3 },
          { emoji: "👏", count: 2 },
        ],
      },
    ],
  },
  design: {
    name: "design",
    members: 4,
    description: "Design system, Figma updates, and UI discussions",
    starCount: 1,
    showWelcome: true,
    messages: [
      {
        id: "d1",
        initials: "MW",
        color: "bg-emerald-500",
        name: "Marcus Webb",
        time: "9:15 AM",
        pinned: true,
        text: "New Figma library is live! I've restructured the component hierarchy and added proper documentation for every component.",
        reactions: [{ emoji: "🎨", count: 4 }],
        replies: 6,
        lastReply: "Last reply 1h ago",
        replyUsers: [
          { initials: "SC", color: "bg-pink-500" },
          { initials: "MW", color: "bg-emerald-500" },
        ],
      },
      {
        id: "d2",
        initials: "AM",
        color: "bg-indigo-500",
        name: "Alex Morgan",
        time: "9:30 AM",
        text: "The new color system is 🔥. Really loving how the semantic tokens map to the primitive palette. Makes dark mode trivial.",
        reactions: [{ emoji: "💯", count: 3 }],
      },
      {
        id: "d3",
        initials: "SC",
        color: "bg-pink-500",
        name: "Sarah Chen",
        time: "10:02 AM",
        text: "Implementation note: I've updated all the Tailwind tokens to match the new system. The tw-config.js changes are in the PR.",
        attachment: { name: "design-tokens-v2.json", size: "45 KB" },
      },
      {
        id: "d4",
        initials: "PP",
        color: "bg-indigo-500",
        name: "Priya Patel",
        time: "11:20 AM",
        text: "Quick question on the badge component - should we support sizes (sm/md/lg) or keep it single size for now?",
        replies: 3,
        lastReply: "Last reply 30m ago",
        replyUsers: [
          { initials: "SC", color: "bg-pink-500" },
          { initials: "MW", color: "bg-emerald-500" },
        ],
      },
    ],
  },
  engineering: {
    name: "engineering",
    members: 4,
    description: "Code reviews, deployments, and technical discussions",
    starCount: 1,
    showWelcome: true,
    messages: [
      {
        id: "e1",
        initials: "JK",
        color: "bg-amber-500",
        name: "Jordan Kim",
        time: "8:45 AM",
        text: "PR #247 is ready for review. Migrates the auth system to JWT + refresh token rotation. Includes full test coverage.",
        reactions: [{ emoji: "👀", count: 3 }],
        replies: 12,
        lastReply: "Last reply 8m ago",
        replyUsers: [
          { initials: "SC", color: "bg-pink-500" },
          { initials: "MW", color: "bg-emerald-500" },
        ],
      },
      {
        id: "e2",
        initials: "TB",
        color: "bg-red-500",
        name: "Tom Bradley",
        time: "8:50 AM",
        pinned: true,
        text: "Prod deploy went smooth at 2 AM. Zero downtime. Monitoring looks clean - P99 latency is actually down 15%.",
        reactions: [
          { emoji: "🧪", count: 5 },
          { emoji: "🚀", count: 2 },
        ],
      },
      {
        id: "e3",
        initials: "SC",
        color: "bg-pink-500",
        name: "Sarah Chen",
        time: "10:15 AM",
        text: "Reminder: we're deprecating `useOldFetch` hook end of this sprint. Please migrate to `useQuery` - docs in the wiki.",
      },
      {
        id: "e4",
        initials: "JK",
        color: "bg-amber-500",
        name: "Jordan Kim",
        time: "1:30 PM",
        text: "Database indexes are updated. Read queries on the messages table should be 3x faster now. Let me know if you see any regressions.",
        reactions: [{ emoji: "⚡", count: 4 }],
      },
    ],
  },
  random: {
    name: "random",
    members: 6,
    description: "Non-work banter and fun stuff",
    starCount: 0,
    showWelcome: true,
    messages: [
      {
        id: "r1",
        initials: "MW",
        color: "bg-emerald-500",
        name: "Marcus Webb",
        time: "8:30 AM",
        text: "Just discovered this incredible coffee spot near the office. The flat white is unreal ☕",
        reactions: [{ emoji: "☕", count: 3 }],
      },
      {
        id: "r2",
        initials: "PP",
        color: "bg-indigo-500",
        name: "Priya Patel",
        time: "12:15 PM",
        text: "Anyone else watching the new Severance season? No spoilers but... 👀",
        reactions: [
          { emoji: "🍿", count: 4 },
          { emoji: "👏", count: 2 },
        ],
        replies: 7,
        lastReply: "Last reply 2h ago",
        replyUsers: [
          { initials: "SC", color: "bg-pink-500" },
          { initials: "MW", color: "bg-emerald-500" },
        ],
      },
      {
        id: "r3",
        initials: "JK",
        color: "bg-amber-500",
        name: "Jordan Kim",
        time: "2:00 PM",
        text: "PSA: the coffee machine on floor 3 is fixed 🎉",
        reactions: [{ emoji: "🎉", count: 6 }],
      },
    ],
  },
  announcements: {
    name: "announcements",
    members: 6,
    description: "Important company announcements",
    starCount: 0,
    showWelcome: true,
    typingNotice: "Marcus Webb is typing...",
    messages: [],
  },
  leadership: {
    name: "leadership",
    members: 2,
    description: "Leadership team discussions",
    starCount: 0,
    showWelcome: true,
    messages: [],
  },
};

type ResolvedChannelMeta = {
  id: string;
  name: string;
  slug: string;
  displayName: string;
  description: string;
  membersCount: number;
  private?: boolean;
};

const UUID_LIKE_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const channelDirectoryStorageKey = computed(
  () => `appchat_channel_directory_${workspaceId.value || workspace.value.id || "default"}`,
);

const normalizeRef = (value: string) => value.toLowerCase().trim();

const isUuidLike = (value: string) => UUID_LIKE_REGEX.test(value);

const toDisplayLabel = (rawRef: string) => {
  const normalized = normalizeRef(rawRef);
  if (!normalized || isUuidLike(normalized)) {
    return "channel";
  }
  return normalized.replace(/-/g, " ");
};

const dedupeDirectory = (list: ChannelDirectoryItem[]) => {
  const map = new Map<string, ChannelDirectoryItem>();
  for (const item of list) {
    const normalized: ChannelDirectoryItem = {
      id: String(item.id),
      name: normalizeRef(item.name || item.slug || item.id),
      slug: normalizeRef(item.slug || item.name || item.id),
      description: String(item.description || ""),
      membersCount: Number(item.membersCount || 0),
      private: Boolean(item.private),
    };

    const keys = [
      `id:${normalized.id}`,
      `slug:${normalized.slug}`,
      `name:${normalized.name}`,
    ];

    for (const key of keys) {
      map.set(key, normalized);
    }
  }

  const unique = new Map<string, ChannelDirectoryItem>();
  for (const item of map.values()) {
    if (!unique.has(item.id)) {
      unique.set(item.id, item);
    }
  }
  return [...unique.values()];
};

const saveCachedChannels = (items: ChannelDirectoryItem[]) => {
  if (!isClient) {
    return;
  }
  localStorage.setItem(channelDirectoryStorageKey.value, JSON.stringify(dedupeDirectory(items)));
};

const loadCachedChannels = () => {
  if (!isClient) {
    return;
  }
  const directoryRaw = localStorage.getItem(channelDirectoryStorageKey.value);
  const sidebarRaw = localStorage.getItem(`appchat_channels_${workspaceId.value || workspace.value.id || "acme"}`);

  const source: ChannelDirectoryItem[] = [];

  if (directoryRaw) {
    try {
      const parsed = JSON.parse(directoryRaw) as ChannelDirectoryItem[];
      source.push(...parsed);
    } catch {
      // Ignore malformed cached payload.
    }
  }

  if (sidebarRaw) {
    try {
      const parsed = JSON.parse(sidebarRaw) as Array<{ id?: string; slug: string; name: string; private?: boolean }>;
      source.push(
        ...parsed.map((item) => ({
          id: String(item.id || item.slug || item.name),
          name: normalizeRef(item.name || item.slug || item.id || "channel"),
          slug: normalizeRef(item.slug || item.name || item.id || "channel"),
          description: "",
          membersCount: 0,
          private: Boolean(item.private),
        })),
      );
    } catch {
      // Ignore malformed sidebar payload.
    }
  }

  if (!source.length) {
    cachedChannels.value = [];
    return;
  }

  try {
    cachedChannels.value = dedupeDirectory(source);
  } catch {
    cachedChannels.value = [];
  }
};

const mergeIntoChannelCache = (items: ChannelDirectoryItem[]) => {
  const merged = dedupeDirectory([...cachedChannels.value, ...items]);
  cachedChannels.value = merged;
  saveCachedChannels(merged);
};

const fallbackChannelDirectory = computed<ChannelDirectoryItem[]>(() =>
  Object.entries(channels).map(([key, value]) => ({
    id: key,
    name: key,
    slug: key,
    description: value.description,
    membersCount: value.members,
    private: false,
  })),
);

const findChannelMeta = (directory: ChannelDirectoryItem[], rawRef: string) => {
  const normalized = normalizeRef(rawRef);
  return directory.find(
    (item) =>
      item.id === rawRef ||
      normalizeRef(item.slug) === normalized ||
      normalizeRef(item.name) === normalized,
  );
};

const resolvedChannelMeta = computed<ResolvedChannelMeta>(() => {
  const rawRef = String(channelId.value || "");

  const fromApi = findChannelMeta(apiChannels.value, rawRef);
  if (fromApi) {
    return {
      id: fromApi.id,
      name: fromApi.name,
      slug: fromApi.slug,
      displayName: fromApi.name,
      description: fromApi.description || `${toDisplayLabel(fromApi.name)} discussions`,
      membersCount: fromApi.membersCount || 1,
      private: fromApi.private,
    };
  }

  const fromCache = findChannelMeta(cachedChannels.value, rawRef);
  if (fromCache) {
    return {
      id: fromCache.id,
      name: fromCache.name,
      slug: fromCache.slug,
      displayName: fromCache.name,
      description: fromCache.description || `${toDisplayLabel(fromCache.name)} discussions`,
      membersCount: fromCache.membersCount || 1,
      private: fromCache.private,
    };
  }

  const fromFallback = findChannelMeta(fallbackChannelDirectory.value, rawRef);
  if (fromFallback) {
    return {
      id: fromFallback.id,
      name: fromFallback.name,
      slug: fromFallback.slug,
      displayName: fromFallback.name,
      description: fromFallback.description || `${toDisplayLabel(fromFallback.name)} discussions`,
      membersCount: fromFallback.membersCount || 1,
      private: fromFallback.private,
    };
  }

  const safeLabel = toDisplayLabel(rawRef);
  return {
    id: rawRef || "channel",
    name: safeLabel,
    slug: safeLabel.replace(/\s+/g, "-"),
    displayName: safeLabel,
    description: `${safeLabel.charAt(0).toUpperCase()}${safeLabel.slice(1)} discussions`,
    membersCount: 1,
    private: false,
  };
});

const activeChannelKey = computed(() => {
  const byName = normalizeRef(resolvedChannelMeta.value.name);
  if (channels[byName]) {
    return byName;
  }
  const bySlug = normalizeRef(resolvedChannelMeta.value.slug);
  if (channels[bySlug]) {
    return bySlug;
  }
  return "";
});

const activeChannel = computed<ChannelView>(() => {
  const key = activeChannelKey.value;
  const fallback = key ? channels[key] : undefined;
  const resolved = resolvedChannelMeta.value;

  if (fallback) {
    return {
      ...fallback,
      name: resolved.displayName || fallback.name,
      description: resolved.description || fallback.description,
      members: resolved.membersCount ?? fallback.members,
      messages: apiMessages.value ?? fallback.messages,
    };
  }

  return {
    name: resolved.displayName,
    members: resolved.membersCount || 1,
    description: resolved.description,
    starCount: 0,
    showWelcome: true,
    messages: apiMessages.value ?? [],
  };
});

const headerChannel = computed(() => ({
  name: activeChannel.value.name,
  description: activeChannel.value.description,
  members: activeChannel.value.members,
  starCount: activeChannel.value.starCount,
}));

const chatChannel = computed(() => activeChannel.value);

useHead({
  title: computed(() => `AppChat | ${workspace.value.name} / #${resolvedChannelMeta.value.displayName}`),
});

const colorPool = [
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-pink-500",
  "bg-red-500",
  "bg-cyan-500",
];

const nameToColor = (name: string) => {
  const seed = name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return colorPool[seed % colorPool.length];
};

const toInitials = (name: string) => {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
};

const toUiMessage = (message: {
  id: string;
  content: string;
  createdAt: string;
  author: { name: string };
}): ChatMessage => {
  const dt = new Date(message.createdAt);
  const formattedTime = Number.isNaN(dt.valueOf())
    ? ""
    : dt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  return {
    id: message.id,
    initials: toInitials(message.author.name),
    color: nameToColor(message.author.name),
    name: message.author.name,
    time: formattedTime,
    text: message.content,
  };
};

const upsertIncomingMessage = (ui: ChatMessage) => {
  const list = apiMessages.value ?? [];
  if (list.some((item) => item.id === ui.id)) {
    return;
  }
  apiMessages.value = [...list, ui];
};

const hydrateLiveChannel = async () => {
  if (!workspaceId.value || !channelId.value) {
    return;
  }

  try {
    const fromApi = await fetchChannels(workspaceId.value);
    apiChannels.value = fromApi.map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      description: item.description || "",
      membersCount: item.membersCount || 0,
      private: item.private,
    }));
    mergeIntoChannelCache(apiChannels.value);
  } catch {
    apiChannels.value = [];
    loadCachedChannels();
  }

  try {
    const messages = await fetchMessages(workspaceId.value, channelId.value);
    apiMessages.value = messages.map(toUiMessage);
  } catch {
    apiMessages.value = null;
  }
};

watch(
  workspaceId,
  () => {
    loadCachedChannels();
  },
  { immediate: true },
);

const handleSendMessage = async (content: string) => {
  try {
    const created = await sendMessage(workspaceId.value, channelId.value, content);
    const ui = toUiMessage(created);
    upsertIncomingMessage(ui);
  } catch {
    // Keep UI responsive even if API call fails.
  }
};

const handleOpenThread = (message: ThreadMessage) => {
  selectedThreadMessage.value = message;
  isThreadPanelOpen.value = true;
};

const closeThreadPanel = () => {
  isThreadPanelOpen.value = false;
};

const ensureSocketRoom = () => {
  if (typeof window === "undefined") {
    return;
  }

  const config = useRuntimeConfig();
  const base = (config.public.apiBaseUrl || "").trim() || "https://localhost:3000";
  const room = `workspace:${workspaceId.value}:channel:${channelId.value.toLowerCase().trim()}`;

  if (!socketRef.value) {
    socketRef.value = io(`${base}/ws`, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.value.on("message-created", (message) => {
      const ui = toUiMessage(
        message as {
          id: string;
          content: string;
          createdAt: string;
          author: { name: string };
        },
      );
      upsertIncomingMessage(ui);
    });
  }

  if (activeSocketRoom.value !== room) {
    socketRef.value.emit("join-room", {
      workspaceId: workspaceId.value,
      channelRef: channelId.value,
    });
    activeSocketRoom.value = room;
  }
};

onBeforeUnmount(() => {
  if (socketRef.value) {
    socketRef.value.disconnect();
    socketRef.value = null;
  }
});
</script>
