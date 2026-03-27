<template>
  <div class="h-screen overflow-hidden bg-[#f8f8fa] text-[#1d1c1d]">
    <div class="flex h-full">
      <Sidebar />
      <WorkspaceSidebar />

      <main class="flex min-w-0 flex-1 flex-col bg-white">
        <AppHeader :channel="headerChannel" />
        <ChatContainer :channel="chatChannel" />
      </main>

      <RightPanel v-if="isThreadPanelOpen" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from "~/components/layout/Sidebar.vue";
import WorkspaceSidebar from "~/components/layout/WorkspaceSidebar.vue";
import Header from "~/components/layout/Header.vue";
import ChatContainer from "~/components/chat/ChatContainer.vue";
import RightPanel from "~/components/layout/RightPanel.vue";

const AppHeader = Header;

const route = useRoute();
const { workspace, loadWorkspace } = useWorkspace();
const { listChannels, listMessages } = useChatApi();
const { isOpen: isThreadPanelOpen } = useThreadPanel();

type ChannelView = {
  name: string;
  description: string;
  members: number;
  starCount: number;
  showWelcome?: boolean;
  showTopReactions?: boolean;
  typingNotice?: string;
  topReactions?: Array<{ emoji: string; count: number }>;
  messages: Array<{
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
  }>;
};

const channelId = computed(() => String(route.params.channelId ?? ""));
const channels = ref<Array<{ id: string; name: string; description: string | null }>>([]);
const chatChannel = ref<ChannelView>({
  name: "general",
  description: "Channel messages",
  members: 0,
  starCount: 0,
  showWelcome: true,
  messages: [],
});

const initialsFor = (value: string) => {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "U";
  if (parts.length === 1) return parts.at(0)?.[0]?.toUpperCase() ?? "U";
  return `${parts.at(0)?.[0] ?? ""}${parts.at(1)?.[0] ?? ""}`.toUpperCase();
};

const formatTime = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
};

const loadChatData = async () => {
  if (!workspace.value.id) {
    return;
  }

  const channelList = await listChannels(workspace.value.id);
  channels.value = channelList.map((channel) => ({
    id: channel.id,
    name: channel.name,
    description: channel.description,
  }));

  const selected = channels.value.find((channel) => channel.id === channelId.value) ?? channels.value[0];

  if (!selected) {
    chatChannel.value = {
      name: "general",
      description: "No channels yet",
      members: 0,
      starCount: 0,
      showWelcome: true,
      messages: [],
    };
    return;
  }

  if (selected.id !== channelId.value) {
    await navigateTo(`/workspace/${workspace.value.slug}/channel/${selected.id}`, { replace: true });
    return;
  }

  const response = await listMessages(selected.id, 30);

  chatChannel.value = {
    name: selected.name,
    description: selected.description || "Team conversation",
    members: 0,
    starCount: 0,
    showWelcome: response.data.length === 0,
    messages: response.data.map((message, index) => {
      const displayName = message.user?.name || message.user?.email || "User";
      return {
        id: message.id,
        initials: initialsFor(displayName),
        color: ["bg-emerald-500", "bg-indigo-500", "bg-amber-500", "bg-pink-500"][index % 4] ?? "bg-slate-500",
        name: displayName,
        time: formatTime(message.createdAt),
        text: message.content,
      };
    }),
  };
};

onMounted(async () => {
  loadWorkspace();
  await loadChatData();
});

watch(
  [() => workspace.value.id, () => channelId.value],
  async () => {
    await loadChatData();
  },
);

const headerChannel = computed(() => ({
  name: chatChannel.value.name,
  description: chatChannel.value.description,
  members: chatChannel.value.members,
  starCount: chatChannel.value.starCount,
}));

useHead({
  title: computed(() => `AppChat | ${workspace.value.slug} / #${chatChannel.value.name}`),
});
</script>
