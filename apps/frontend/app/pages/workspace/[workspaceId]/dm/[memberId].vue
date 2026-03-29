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

        <div v-if="isLoading" class="flex flex-1 items-center justify-center text-slate-500">Loading direct message...</div>
        <ChatContainer v-else :channel="chatChannel" @send-message="handleSendMessage" />
      </main>

      <RightPanel :is-open="false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { io, type Socket } from "socket.io-client";
import Sidebar from "~/components/layout/Sidebar.vue";
import WorkspaceSidebar from "~/components/layout/WorkspaceSidebar.vue";
import Header from "~/components/layout/Header.vue";
import ChatContainer from "~/components/chat/ChatContainer.vue";
import RightPanel from "~/components/layout/RightPanel.vue";
import { useWorkspace } from "../../../../composables/use-workspace";
import { useDmApi } from "../../../../composables/use-dm-api";
import { useMessageApi } from "../../../../composables/use-message-api";
import { usePresenceApi } from "../../../../composables/use-presence-api";
import { getValidAccessToken } from "../../../../utils/auth-session";

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

const workspaceRef = computed(() => String(route.params.workspaceId ?? workspace.value.id ?? ""));
const memberId = computed(() => String(route.params.memberId ?? ""));

const dmChannelRef = ref("");
const recipientName = ref("Direct message");
const recipientRole = ref("Workspace member");
const recipientPresence = ref("offline");
const messages = ref<ChatMessage[]>([]);
const isLoading = ref(true);
const pageError = ref("");

const socketRef = ref<Socket | null>(null);
const activeSocketRoom = ref("");

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
    }
  } catch {
    // Presence should not block DM rendering.
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

onMounted(async () => {
  await loadWorkspace();
  await hydrateDm();
  ensureSocketRoom();
});

watch([workspaceRef, memberId], async () => {
  await hydrateDm();
  ensureSocketRoom();
});

onBeforeUnmount(() => {
  if (socketRef.value) {
    socketRef.value.disconnect();
    socketRef.value = null;
  }
});

useHead({
  title: computed(() => `AppChat | ${workspace.value.name} / ${recipientName.value}`),
});
</script>
