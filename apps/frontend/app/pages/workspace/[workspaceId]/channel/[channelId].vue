<template>
  <main class="flex min-w-0 flex-1 flex-col">
    <AppHeader :channel="headerChannel" />

    <div v-if="pageError" class="border-b border-red-200 bg-red-50 px-6 py-2 text-sm text-red-700">
      {{ pageError }}
    </div>

    <div class="flex min-h-0 flex-1">
      <ChatContainer
        class="min-h-0 flex-1"
        :channel="chatChannel"
        @send-message="handleSendMessage"
        @open-thread="handleOpenThread"
        @mention-click="handleMentionClick"
        @toggle-reaction="handleToggleReaction"
        @toggle-pin="handleTogglePin"
      />
    </div>
  </main>

  <RightPanel
    :is-open="isThreadPanelOpen"
    :workspace-id="workspaceRef"
    :channel-ref="channelRef"
    :thread-message="selectedThreadMessage"
    :profile-hint="selectedProfileHint"
    @close="closeThreadPanel"
    @profile-selected="handleProfileSelected"
  />
</template>

<script setup lang="ts">
import Header from "~/components/layout/Header.vue";
import ChatContainer from "~/components/chat/ChatContainer.vue";
import RightPanel from "~/components/layout/RightPanel.vue";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { io, type Socket } from "socket.io-client";
import { useWorkspace } from "../../../../composables/use-workspace";
import { useChannelApi } from "../../../../composables/use-channel-api";
import { useMessageApi } from "../../../../composables/use-message-api";
import { getValidAccessToken } from "../../../../utils/auth-session";

definePageMeta({
  key: (route) => `workspace-channel-${String(route.params.workspaceId ?? "")}`,
});

type MentionEntity = {
  userId: string | null;
  displayName: string;
  mentionKey: string;
  start: number;
  end: number;
};

type ChatMessage = {
  id: string;
  authorId?: string;
  parentMessageId?: string | null;
  initials: string;
  color: string;
  name: string;
  time: string;
  text: string;
  mentions?: MentionEntity[];
  pinned?: boolean;
  replies?: number;
  lastReply?: string;
  replyUsers?: Array<{ initials: string; color: string }>;
  reactions?: Array<{ emoji: string; count: number; reactedByMe?: boolean }>;
  attachment?: { name: string; size: string };
};

type ThreadMessage = {
  id: string;
  authorId?: string;
  initials: string;
  color: string;
  name: string;
  time: string;
  text: string;
  mentions?: MentionEntity[];
  reactions?: Array<{ emoji: string; count: number; reactedByMe?: boolean }>;
  replies?: number;
};

type ChannelMeta = {
  id: string;
  name: string;
  slug: string;
  description: string;
  membersCount: number;
  private?: boolean;
};

type MessageDto = {
  id: string;
  content: string;
  createdAt: string;
  parentMessageId?: string | null;
  mentions?: MentionEntity[];
  reactions?: Array<{ emoji: string; count: number; reactedByMe: boolean }>;
  repliesCount?: number;
  pinned?: boolean;
  author: {
    id?: string;
    name: string;
    email: string;
  };
};

const AppHeader = Header;
const route = useRoute();
const { workspace, loadWorkspace } = useWorkspace();
const { fetchChannels, markChannelRead } = useChannelApi();
const { fetchMessages, sendMessage, addReaction, removeReaction, pinMessage, unpinMessage } = useMessageApi();

const workspaceRef = computed(() => String(route.params.workspaceId ?? workspace.value.id ?? ""));
const channelRef = computed(() => String(route.params.channelId ?? ""));

const channelMeta = ref<ChannelMeta | null>(null);
const messages = ref<ChatMessage[]>([]);
const pageError = ref("");
const hydrateSequence = ref(0);
const hasLoadedOnce = ref(false);

const socketRef = ref<Socket | null>(null);
const activeSocketRoom = ref("");
const isThreadPanelOpen = ref(false);
const selectedThreadMessage = ref<ThreadMessage | null>(null);
const selectedProfileHint = ref<{ userId?: string | null; name?: string } | null>(null);

const colorPool = ["bg-indigo-500", "bg-emerald-500", "bg-amber-500", "bg-pink-500", "bg-red-500", "bg-cyan-500"];

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

const toUiMessage = (message: MessageDto): ChatMessage => {
  const dt = new Date(message.createdAt);
  const formattedTime = Number.isNaN(dt.valueOf())
    ? ""
    : dt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  return {
    id: message.id,
    authorId: message.author.id,
    parentMessageId: message.parentMessageId ?? null,
    initials: toInitials(message.author.name),
    color: nameToColor(message.author.name),
    name: message.author.name,
    time: formattedTime,
    text: message.content,
    mentions: message.mentions || [],
    pinned: Boolean(message.pinned),
    replies: message.repliesCount || 0,
    reactions: message.reactions || [],
  };
};

const upsertIncomingMessage = (ui: ChatMessage) => {
  if (ui.parentMessageId) {
    return;
  }
  if (messages.value.some((item) => item.id === ui.id)) {
    return;
  }
  messages.value = [...messages.value, ui];
};

const headerChannel = computed(() => ({
  name: channelMeta.value?.name || "channel",
  description: channelMeta.value?.description || "",
  members: channelMeta.value?.membersCount || 0,
  starCount: 0,
}));

const chatChannel = computed(() => ({
  workspaceId: workspaceRef.value,
  channelRef: channelRef.value,
  name: channelMeta.value?.name || "channel",
  description: channelMeta.value?.description || "",
  messages: messages.value,
}));

const hydrateChannel = async () => {
  if (!workspaceRef.value || !channelRef.value) {
    pageError.value = "Invalid workspace/channel route.";
    return;
  }

  const sequence = hydrateSequence.value + 1;
  hydrateSequence.value = sequence;
  pageError.value = "";

  let nextMeta: ChannelMeta | null = null;
  let nextMessages: ChatMessage[] | null = null;

  try {
    const allChannels = await fetchChannels(workspaceRef.value);
    const matched = allChannels.find(
      (item) => item.id === channelRef.value || item.slug === channelRef.value || item.name === channelRef.value,
    );

    nextMeta = matched
      ? {
          id: matched.id,
          name: matched.name,
          slug: matched.slug,
          description: matched.description,
          membersCount: matched.membersCount,
          private: matched.private,
        }
      : {
          id: channelRef.value,
          name: channelRef.value,
          slug: channelRef.value,
          description: "",
          membersCount: 0,
        };
  } catch {
    pageError.value = "Unable to load channel metadata.";
  }

  try {
    const data = await fetchMessages(workspaceRef.value, channelRef.value);
    nextMessages = data.map(toUiMessage);
  } catch {
    pageError.value = pageError.value || "Unable to load messages for this channel.";
  }

  if (sequence !== hydrateSequence.value) {
    return;
  }

  if (nextMeta) {
    channelMeta.value = nextMeta;
  }

  if (nextMessages) {
    messages.value = nextMessages;
  } else if (!hasLoadedOnce.value) {
    messages.value = [];
  }
  hasLoadedOnce.value = true;

  try {
    await markChannelRead(workspaceRef.value, channelRef.value);
  } catch {
    pageError.value = pageError.value || "Unable to mark channel as read.";
  }
};

const ensureSocketRoom = () => {
  if (typeof window === "undefined" || !workspaceRef.value || !channelRef.value) {
    return;
  }

  const config = useRuntimeConfig();
  const base = (config.public.apiBaseUrl || "").trim() || "https://localhost:3000";
  const token = getValidAccessToken();
  if (!token) {
    return;
  }

  if (!socketRef.value) {
    socketRef.value = io(`${base}/ws`, {
      transports: ["websocket"],
      withCredentials: true,
      auth: { token },
      extraHeaders: { Authorization: `Bearer ${token}` },
    });

    socketRef.value.on("message-created", (message) => {
      upsertIncomingMessage(toUiMessage(message as MessageDto));
    });

    socketRef.value.on("thread:reply-created", (payload: { rootMessageId: string }) => {
      messages.value = messages.value.map((item) =>
        item.id === payload.rootMessageId ? { ...item, replies: (item.replies || 0) + 1 } : item,
      );
    });

    socketRef.value.on(
      "message:reaction-updated",
      (payload: { messageId: string; reactions: Array<{ emoji: string; count: number; reactedByMe: boolean }> }) => {
        messages.value = messages.value.map((item) =>
          item.id === payload.messageId ? { ...item, reactions: payload.reactions } : item,
        );
      },
    );

    socketRef.value.on("message:pinned", (payload: { messageId: string }) => {
      messages.value = messages.value.map((item) => (item.id === payload.messageId ? { ...item, pinned: true } : item));
    });

    socketRef.value.on("message:unpinned", (payload: { messageId: string }) => {
      messages.value = messages.value.map((item) => (item.id === payload.messageId ? { ...item, pinned: false } : item));
    });
  }

  const room = `workspace:${workspaceRef.value}:channel:${channelRef.value.toLowerCase().trim()}`;
  if (activeSocketRoom.value !== room) {
    socketRef.value.emit("join-room", {
      workspaceId: workspaceRef.value,
      channelRef: channelRef.value,
    });
    activeSocketRoom.value = room;
  }
};

const handleSendMessage = async (content: string) => {
  pageError.value = "";
  try {
    const created = await sendMessage(workspaceRef.value, channelRef.value, content);
    upsertIncomingMessage(toUiMessage(created));
  } catch {
    pageError.value = "Message failed to send. Please retry.";
  }
};

const handleOpenThread = (message: ThreadMessage) => {
  selectedThreadMessage.value = message;
  selectedProfileHint.value = null;
  isThreadPanelOpen.value = true;
};

const closeThreadPanel = () => {
  isThreadPanelOpen.value = false;
  selectedThreadMessage.value = null;
};

const handleMentionClick = (mention: { userId: string | null; displayName: string; mentionKey: string }) => {
  selectedProfileHint.value = { userId: mention.userId, name: mention.displayName };
  isThreadPanelOpen.value = true;
};

const handleProfileSelected = (profile: { userId: string | null; name: string }) => {
  selectedProfileHint.value = { userId: profile.userId, name: profile.name };
};

const handleToggleReaction = async (payload: { messageId: string; emoji: string }) => {
  const message = messages.value.find((item) => item.id === payload.messageId);
  if (!message) return;

  const current = message.reactions?.find((reaction) => reaction.emoji === payload.emoji);
  try {
    const result = current?.reactedByMe
      ? await removeReaction(workspaceRef.value, channelRef.value, payload.messageId, payload.emoji)
      : await addReaction(workspaceRef.value, channelRef.value, payload.messageId, payload.emoji);
    messages.value = messages.value.map((item) =>
      item.id === payload.messageId ? { ...item, reactions: result.reactions } : item,
    );
  } catch {
    pageError.value = "Unable to update reaction.";
  }
};

const handleTogglePin = async (messageId: string) => {
  const message = messages.value.find((item) => item.id === messageId);
  if (!message) return;

  try {
    if (message.pinned) {
      await unpinMessage(workspaceRef.value, channelRef.value, messageId);
      messages.value = messages.value.map((item) =>
        item.id === messageId ? { ...item, pinned: false } : item,
      );
    } else {
      await pinMessage(workspaceRef.value, channelRef.value, messageId);
      messages.value = messages.value.map((item) =>
        item.id === messageId ? { ...item, pinned: true } : item,
      );
    }
  } catch {
    pageError.value = "Unable to update pin state.";
  }
};

onMounted(async () => {
  await loadWorkspace();
  await hydrateChannel();
  ensureSocketRoom();
});

watch([workspaceRef, channelRef], async () => {
  isThreadPanelOpen.value = false;
  selectedThreadMessage.value = null;
  selectedProfileHint.value = null;
  await hydrateChannel();
  ensureSocketRoom();
});

onBeforeUnmount(() => {
  if (socketRef.value) {
    socketRef.value.disconnect();
    socketRef.value = null;
  }
});

useHead({
  title: computed(() => `AppChat | ${workspace.value.name} / #${channelMeta.value?.name || channelRef.value}`),
});
</script>
