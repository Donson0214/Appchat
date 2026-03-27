<template>
  <div class="h-screen overflow-hidden bg-white text-slate-800">
    <div class="flex h-full">
      <Sidebar />
      <WorkspaceSidebar />

      <main class="flex min-w-0 flex-1 flex-col">
        <AppHeader :channel="headerChannel" />
        <ChatContainer :channel="chatChannel" />
      </main>

      <RightPanel />
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from "~/components/layout/Sidebar.vue";
import WorkspaceSidebar from "~/components/layout/WorkspaceSidebar.vue";
import Header from "~/components/layout/Header.vue";
import ChatContainer from "~/components/chat/ChatContainer.vue";
import RightPanel from "~/components/layout/RightPanel.vue";

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

const AppHeader = Header;

const route = useRoute();
const { workspace, loadWorkspace } = useWorkspace();

const channelId = computed(() => String(route.params.channelId ?? "general"));

onMounted(() => {
  loadWorkspace();
});

useHead({
  title: computed(() => `AppChat | ${workspace.value.slug} / #${channelId.value}`),
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

const activeChannel = computed<ChannelView>(() => {
  const key = channelId.value.toLowerCase();
  if (channels[key]) {
    return channels[key];
  }

  const prettyName = key.replace(/-/g, " ");
  return {
    name: key,
    members: 1,
    description: `${prettyName.charAt(0).toUpperCase()}${prettyName.slice(1)} discussions`,
    starCount: 0,
    showWelcome: true,
    messages: [],
  };
});

const headerChannel = computed(() => ({
  name: activeChannel.value.name,
  description: activeChannel.value.description,
  members: activeChannel.value.members,
  starCount: activeChannel.value.starCount,
}));

const chatChannel = computed(() => activeChannel.value);
</script>
