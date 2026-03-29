<template>
  <main class="flex min-w-0 flex-1 flex-col">
    <AppHeader :channel="headerChannel" />

    <div v-if="pageError" class="border-b border-red-200 bg-red-50 px-6 py-2 text-sm text-red-700">
      {{ pageError }}
    </div>
    <div v-if="presenceError" class="border-b border-amber-200 bg-amber-50 px-6 py-2 text-sm text-amber-700">
      {{ presenceError }}
    </div>

    <div v-if="isLoading" class="flex flex-1 items-center justify-center text-slate-500">Loading direct message...</div>
    <ChatContainer v-else :channel="chatChannel" @send-message="handleSendMessage" />
  </main>

  <RightPanel :is-open="false" />
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { io, type Socket } from "socket.io-client";
import Header from "~/components/layout/Header.vue";
import ChatContainer from "~/components/chat/ChatContainer.vue";
import RightPanel from "~/components/layout/RightPanel.vue";
import { useWorkspace } from "../../../../composables/use-workspace";
import { useDmApi } from "../../../../composables/use-dm-api";
import { useMessageApi } from "../../../../composables/use-message-api";
import { usePresenceApi } from "../../../../composables/use-presence-api";
import { usePresenceRealtime } from "../../../../composables/use-presence-realtime";
import { getValidAccessToken } from "../../../../utils/auth-session";

definePageMeta({
  key: (route) => `workspace-dm-${String(route.params.workspaceId ?? "")}`,
});

type ChatMessage = {
  id: string;
  initials: string;
  color: string;
  name: string;
  time: string;
  text: string;
};

const AppHeader = Header;
const route = useRoute();
const { workspace, loadWorkspace } = useWorkspace();
const { openDirectMessage } = useDmApi();
const { fetchMessages, sendMessage } = useMessageApi();
const { fetchWorkspacePresence } = usePresenceApi();
const { connect: connectPresence, subscribeWorkspace, onPresenceChanged, connectionError } = usePresenceRealtime();

const workspaceRef = computed(() => String(route.params.workspaceId ?? workspace.value.id ?? ""));
const memberId = computed(() => String(route.params.memberId ?? ""));

const dmChannelRef = ref("");
const recipientName = ref("Direct message");
const recipientRole = ref("Workspace member");
const recipientPresence = ref("offline");
const messages = ref<ChatMessage[]>([]);
const isLoading = ref(true);
const pageError = ref("");
const presenceError = ref("");

const socketRef = ref<Socket | null>(null);
const activeSocketRoom = ref("");
let removePresenceListener: (() => void) | null = null;

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

const upsertIncomingMessage = (message: ChatMessage) => {
  if (messages.value.some((item) => item.id === message.id)) {
    return;
  }
  messages.value = [...messages.value, message];
};

const headerChannel = computed(() => ({
  name: recipientName.value,
  description: recipientRole.value,
  isDirectMessage: true,
  presenceLabel: recipientPresence.value,
}));

const chatChannel = computed(() => ({
  workspaceId: workspaceRef.value,
  channelRef: dmChannelRef.value,
  name: recipientName.value,
  description: recipientRole.value,
  isDirectMessage: true,
  messages: messages.value,
}));

const hydrateDm = async () => {
  if (!workspaceRef.value || !memberId.value) {
    pageError.value = "Invalid workspace/member route.";
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  pageError.value = "";

  try {
    const opened = await openDirectMessage(workspaceRef.value, memberId.value);
    dmChannelRef.value = opened.channelRef;

    if (opened.member) {
      recipientName.value = opened.member.name;
    }
  } catch {
    pageError.value = "Unable to open direct message.";
    isLoading.value = false;
    return;
  }

  try {
    const members = await fetchWorkspacePresence(workspaceRef.value);
    const matched = members.find((item) => item.id === memberId.value);
    if (matched) {
      recipientName.value = matched.name;
      recipientRole.value = matched.role;
      recipientPresence.value = matched.status;
      presenceError.value = "";
    }
  } catch {
    presenceError.value = "Presence is temporarily unavailable.";
  }

  try {
    const data = await fetchMessages(workspaceRef.value, dmChannelRef.value);
    messages.value = data.map(toUiMessage);
  } catch {
    messages.value = [];
    pageError.value = pageError.value || "Unable to load direct message history.";
  } finally {
    isLoading.value = false;
  }
};

const ensureSocketRoom = () => {
  if (typeof window === "undefined" || !workspaceRef.value || !dmChannelRef.value) {
    return;
  }

  const token = getValidAccessToken();
  if (!token) {
    return;
  }

  const config = useRuntimeConfig();
  const base = (config.public.apiBaseUrl || "").trim() || "https://localhost:3000";

  if (!socketRef.value) {
    socketRef.value = io(`${base}/ws`, {
      transports: ["websocket"],
      withCredentials: true,
      auth: { token },
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    socketRef.value.on("message-created", (message) => {
      upsertIncomingMessage(
        toUiMessage(
          message as {
            id: string;
            content: string;
            createdAt: string;
            author: { name: string };
          },
        ),
      );
    });
  }

  const room = `workspace:${workspaceRef.value}:channel:${dmChannelRef.value.toLowerCase().trim()}`;
  if (activeSocketRoom.value !== room) {
    socketRef.value.emit("join-room", {
      workspaceId: workspaceRef.value,
      channelRef: dmChannelRef.value,
    });
    activeSocketRoom.value = room;
  }
};

const handleSendMessage = async (content: string) => {
  if (!dmChannelRef.value) {
    pageError.value = "Direct message is not ready yet.";
    return;
  }

  pageError.value = "";
  try {
    const created = await sendMessage(workspaceRef.value, dmChannelRef.value, content);
    upsertIncomingMessage(toUiMessage(created));
  } catch {
    pageError.value = "Failed to send direct message.";
  }
};

const ensurePresenceRealtime = async () => {
  if (!workspaceRef.value) {
    return;
  }

  try {
    connectPresence();
    await subscribeWorkspace(workspaceRef.value);
    presenceError.value = "";
  } catch (error) {
    presenceError.value = error instanceof Error ? error.message : "Presence realtime is unavailable.";
  }
};

onMounted(async () => {
  await loadWorkspace();
  await hydrateDm();
  await ensurePresenceRealtime();
  removePresenceListener = onPresenceChanged((event) => {
    if (event.userId === memberId.value) {
      recipientPresence.value = event.status;
    }
  });
  ensureSocketRoom();
});

watch([workspaceRef, memberId], async () => {
  await hydrateDm();
  await ensurePresenceRealtime();
  ensureSocketRoom();
});

watch(connectionError, (value) => {
  if (value) {
    presenceError.value = value;
  }
});

onBeforeUnmount(() => {
  if (removePresenceListener) {
    removePresenceListener();
    removePresenceListener = null;
  }
  if (socketRef.value) {
    socketRef.value.disconnect();
    socketRef.value = null;
  }
});

useHead({
  title: computed(() => `AppChat | ${workspace.value.name} / ${recipientName.value}`),
});
</script>
