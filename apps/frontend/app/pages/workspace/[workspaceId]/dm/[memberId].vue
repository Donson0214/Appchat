<template>
  <div class="h-screen overflow-hidden bg-white text-slate-800">
    <div class="flex h-full">
      <Sidebar />
      <WorkspaceSidebar />

      <main class="flex min-w-0 flex-1 flex-col">
        <AppHeader :channel="headerChannel" />
        <ChatContainer :channel="chatChannel" @send-message="handleSendMessage" />
      </main>

      <RightPanel />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import Sidebar from "~/components/layout/Sidebar.vue";
import WorkspaceSidebar from "~/components/layout/WorkspaceSidebar.vue";
import Header from "~/components/layout/Header.vue";
import ChatContainer from "~/components/chat/ChatContainer.vue";
import RightPanel from "~/components/layout/RightPanel.vue";
import { useWorkspace } from "../../../../composables/use-workspace";

type ChatMessage = {
  id: string;
  initials: string;
  color: string;
  name: string;
  time: string;
  text: string;
};

type DirectMessageView = {
  memberId: string;
  name: string;
  role: string;
  presenceLabel: string;
  messages: ChatMessage[];
};

const AppHeader = Header;
const route = useRoute();
const { loadWorkspace } = useWorkspace();
loadWorkspace();

const memberId = computed(() => String(route.params.memberId ?? "sarah-chen"));

const directMessages: Record<string, DirectMessageView> = {
  "sarah-chen": {
    memberId: "sarah-chen",
    name: "Sarah Chen",
    role: "Senior Frontend Engineer",
    presenceLabel: "online",
    messages: [
      {
        id: "dm-1",
        initials: "SC",
        color: "bg-pink-500",
        name: "Sarah Chen",
        time: "9:45 AM",
        text: "Hey! Can you review the new button variants I pushed?",
      },
      {
        id: "dm-2",
        initials: "AM",
        color: "bg-indigo-500",
        name: "Alex Morgan",
        time: "9:47 AM",
        text: "On it! Will check in 10 mins",
      },
      {
        id: "dm-3",
        initials: "SC",
        color: "bg-pink-500",
        name: "Sarah Chen",
        time: "9:48 AM",
        text: "No rush, whenever works. Also - are we still on for the design sync at 3?",
      },
    ],
  },
  "marcus-webb": {
    memberId: "marcus-webb",
    name: "Marcus Webb",
    role: "Staff Product Designer",
    presenceLabel: "online",
    messages: [
      {
        id: "dm-4",
        initials: "MW",
        color: "bg-emerald-500",
        name: "Marcus Webb",
        time: "10:05 AM",
        text: "Pushed updated channel icon set. Want me to wire it into the sidebar now?",
      },
    ],
  },
  "jordan-kim": {
    memberId: "jordan-kim",
    name: "Jordan Kim",
    role: "Backend Engineer",
    presenceLabel: "away",
    messages: [
      {
        id: "dm-5",
        initials: "JK",
        color: "bg-amber-500",
        name: "Jordan Kim",
        time: "11:11 AM",
        text: "Will share endpoint contracts in an hour.",
      },
    ],
  },
  "priya-patel": {
    memberId: "priya-patel",
    name: "Priya Patel",
    role: "Product Manager",
    presenceLabel: "dnd",
    messages: [
      {
        id: "dm-6",
        initials: "PP",
        color: "bg-indigo-500",
        name: "Priya Patel",
        time: "1:02 PM",
        text: "Can you join the roadmap sync at 4?",
      },
    ],
  },
};

const activeConversation = computed<DirectMessageView>(() => {
  return (
    directMessages[memberId.value] ?? {
      memberId: memberId.value,
      name: memberId.value.replace(/-/g, " ").replace(/\b\w/g, (s) => s.toUpperCase()),
      role: "Workspace Member",
      presenceLabel: "online",
      messages: [],
    }
  );
});

const liveMessages = ref<ChatMessage[]>([]);

const headerChannel = computed(() => ({
  name: activeConversation.value.name,
  description: activeConversation.value.role,
  isDirectMessage: true,
  presenceLabel: activeConversation.value.presenceLabel,
}));

const chatChannel = computed(() => ({
  name: activeConversation.value.name,
  description: activeConversation.value.role,
  isDirectMessage: true,
  messages: [...activeConversation.value.messages, ...liveMessages.value],
}));

const handleSendMessage = (content: string) => {
  liveMessages.value = [
    ...liveMessages.value,
    {
      id: `local-${Date.now()}`,
      initials: "AM",
      color: "bg-indigo-500",
      name: "Alex Morgan",
      time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      text: content,
    },
  ];
};
</script>
