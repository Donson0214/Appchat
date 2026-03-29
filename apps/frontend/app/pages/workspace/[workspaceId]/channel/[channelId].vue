<template>
  <div class="h-screen overflow-hidden bg-white text-slate-800">
    <div class="flex h-full">
      <Sidebar />
      <WorkspaceSidebar />

      <main class="flex min-w-0 flex-1 flex-col">
        <AppHeader :channel="headerChannel" />

        <div v-if="pageError" class="border-b border-red-200 bg-red-50 px-6 py-2 text-sm text-red-700">
          {{ pageError }}
        </div>

        <div v-if="isLoading" class="flex flex-1 items-center justify-center text-slate-500">Loading channel...</div>
        <ChatContainer
          v-else
          :channel="chatChannel"
          @send-message="handleSendMessage"
          @open-thread="handleOpenThread"
        />
      </main>

      <RightPanel
        :is-open="isThreadPanelOpen"
        :thread-message="selectedThreadMessage"
        @close="closeThreadPanel"
      />
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
import { getValidAccessToken } from "../../../../utils/auth-session";

type ChatMessage = {
  id: string;
  initials: string;
  color: string;
  name: string;
  time: string;
  text: string;
  pinned?: boolean;
  replies?: number;
  lastReply?: string;
  replyUsers?: Array<{ initials: string; color: string }>;
  reactions?: Array<{ emoji: string; count: number }>;
  attachment?: { name: string; size: string };
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
  author: {
    name: string;
    email: string;
  };
};

const AppHeader = Header;
const route = useRoute();
const { workspace, loadWorkspace } = useWorkspace();
const { fetchChannels } = useChannelApi();
const { fetchMessages, sendMessage } = useMessageApi();

const workspaceRef = computed(() => String(route.params.workspaceId ?? workspace.value.id ?? ""));
const channelRef = computed(() => String(route.params.channelId ?? ""));

const channelMeta = ref<ChannelMeta | null>(null);
const messages = ref<ChatMessage[]>([]);
const isLoading = ref(true);
const pageError = ref("");

const socketRef = ref<Socket | null>(null);
const activeSocketRoom = ref("");
const isThreadPanelOpen = ref(false);
const selectedThreadMessage = ref<ThreadMessage | null>(null);

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
    initials: toInitials(message.author.name),
    color: nameToColor(message.author.name),
    name: message.author.name,
    time: formattedTime,
    text: message.content,
  };
};

const upsertIncomingMessage = (ui: ChatMessage) => {
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
  name: channelMeta.value?.name || "channel",
  description: channelMeta.value?.description || "",
  messages: messages.value,
}));

const hydrateChannel = async () => {
  if (!workspaceRef.value || !channelRef.value) {
    pageError.value = "Invalid workspace/channel route.";
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  pageError.value = "";

  try {
    const allChannels = await fetchChannels(workspaceRef.value);
    const matched = allChannels.find(
      (item) => item.id === channelRef.value || item.slug === channelRef.value || item.name === channelRef.value,
    );

    channelMeta.value = matched
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
    messages.value = data.map(toUiMessage);
  } catch {
    messages.value = [];
    pageError.value = pageError.value || "Unable to load messages for this channel.";
  } finally {
    isLoading.value = false;
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
      auth: {
        token,
      },
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    socketRef.value.on("message-created", (message) => {
      const ui = toUiMessage(
        message as {
          id: string;
          content: string;
          createdAt: string;
          author: { name: string; email: string };
        },
      );
      upsertIncomingMessage(ui);
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
  isThreadPanelOpen.value = true;
};

const closeThreadPanel = () => {
  isThreadPanelOpen.value = false;
};

onMounted(async () => {
  await loadWorkspace();
  await hydrateChannel();
  ensureSocketRoom();
});

watch([workspaceRef, channelRef], async () => {
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
