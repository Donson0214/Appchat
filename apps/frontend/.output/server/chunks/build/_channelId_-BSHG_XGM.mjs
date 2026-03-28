globalThis.__timing__.logStart('Load chunks/build/_channelId_-BSHG_XGM');import { defineComponent, computed, ref, watch, mergeProps, unref, hasInjectionContext, inject, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _sfc_main$f, a as _sfc_main$b, b as _sfc_main$9, c as _sfc_main$1, d as _sfc_main$2 } from './RightPanel-B3bYzzbV.mjs';
import { useRoute } from 'vue-router';
import { u as useWorkspace, a as useChannelApi } from './use-channel-api-CR8gUnIE.mjs';
import { a as useRuntimeConfig, u as useNuxtApp } from './server.mjs';
import { u as useHead$1, h as headSymbol } from '../routes/renderer.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

function injectHead(nuxtApp) {
  const nuxt = nuxtApp || useNuxtApp();
  return nuxt.ssrContext?.head || nuxt.runWithContext(() => {
    if (hasInjectionContext()) {
      const head = inject(headSymbol);
      if (!head) {
        throw new Error("[nuxt] [unhead] Missing Unhead instance.");
      }
      return head;
    }
  });
}
function useHead(input, options = {}) {
  const head = options.head || injectHead(options.nuxt);
  return useHead$1(input, { head, ...options });
}
const getApiBaseUrl = (rawBaseUrl) => {
  const trimmed = (rawBaseUrl || "").trim();
  if (!trimmed) {
    return "https://localhost:3000";
  }
  if (trimmed.startsWith("http://localhost:3000")) {
    return trimmed.replace("http://localhost:3000", "https://localhost:3000");
  }
  return trimmed;
};
const getAuthHeaders = () => {
  {
    return {};
  }
};
const useMessageApi = () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = getApiBaseUrl(config.public.apiBaseUrl);
  const fetchMessages = async (workspaceId, channelRef) => {
    return $fetch(
      `${apiBaseUrl}/workspaces/${workspaceId}/channels/${channelRef}/messages`,
      { headers: getAuthHeaders() }
    );
  };
  const sendMessage = async (workspaceId, channelRef, content) => {
    return $fetch(
      `${apiBaseUrl}/workspaces/${workspaceId}/channels/${channelRef}/messages`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: { content }
      }
    );
  };
  return {
    fetchMessages,
    sendMessage
  };
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[channelId]",
  __ssrInlineRender: true,
  setup(__props) {
    const AppHeader = _sfc_main$9;
    const route = useRoute();
    const { workspace } = useWorkspace();
    const { fetchChannels } = useChannelApi();
    const { fetchMessages, sendMessage } = useMessageApi();
    const channelId = computed(() => String(route.params.channelId ?? "general"));
    const workspaceId = computed(() => String(route.params.workspaceId ?? workspace.value.id));
    const apiChannels = ref([]);
    const cachedChannels = ref([]);
    const apiMessages = ref(null);
    ref(null);
    ref("");
    const isThreadPanelOpen = ref(false);
    const selectedThreadMessage = ref(null);
    watch([workspaceId, channelId], () => {
      void hydrateLiveChannel();
    });
    const channels = {
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
            reactions: [{ emoji: "👍", count: 2 }]
          },
          {
            id: "g2",
            initials: "PP",
            color: "bg-indigo-500",
            name: "Priya Patel",
            time: "10:45 AM",
            pinned: true,
            text: "Quick heads-up: team standup has moved to 10:00 AM starting next week. Calendar invites going out shortly. Please update your schedules."
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
              { initials: "MW", color: "bg-emerald-500" }
            ]
          },
          {
            id: "g4",
            initials: "AM",
            color: "bg-indigo-500",
            name: "Alex Morgan",
            time: "11:08 AM",
            text: "Great progress @jordan! Let me know if you need anything from the design side for the new API response flows."
          },
          {
            id: "g5",
            initials: "TB",
            color: "bg-red-500",
            name: "Tom Bradley",
            time: "11:30 AM",
            text: "Deployment pipeline is looking solid. Added extra health checks and rollback procedures. Detailed report attached.",
            attachment: { name: "deployment-report-march.pdf", size: "2.4 MB" }
          },
          {
            id: "g6",
            initials: "SC",
            color: "bg-pink-500",
            name: "Sarah Chen",
            time: "2:12 PM",
            text: "Reminder: design review at 3 PM today in the usual Huddle link. Everyone welcome - it should only take ~20 minutes.",
            reactions: [{ emoji: "👀", count: 4 }]
          },
          {
            id: "g7",
            initials: "MW",
            color: "bg-emerald-500",
            name: "Marcus Webb",
            time: "2:15 PM",
            text: "I'll have the wireframes ready before then. Also bringing the updated component specs for review."
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
              { emoji: "👏", count: 2 }
            ]
          }
        ]
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
              { initials: "MW", color: "bg-emerald-500" }
            ]
          },
          {
            id: "d2",
            initials: "AM",
            color: "bg-indigo-500",
            name: "Alex Morgan",
            time: "9:30 AM",
            text: "The new color system is 🔥. Really loving how the semantic tokens map to the primitive palette. Makes dark mode trivial.",
            reactions: [{ emoji: "💯", count: 3 }]
          },
          {
            id: "d3",
            initials: "SC",
            color: "bg-pink-500",
            name: "Sarah Chen",
            time: "10:02 AM",
            text: "Implementation note: I've updated all the Tailwind tokens to match the new system. The tw-config.js changes are in the PR.",
            attachment: { name: "design-tokens-v2.json", size: "45 KB" }
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
              { initials: "MW", color: "bg-emerald-500" }
            ]
          }
        ]
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
              { initials: "MW", color: "bg-emerald-500" }
            ]
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
              { emoji: "🚀", count: 2 }
            ]
          },
          {
            id: "e3",
            initials: "SC",
            color: "bg-pink-500",
            name: "Sarah Chen",
            time: "10:15 AM",
            text: "Reminder: we're deprecating `useOldFetch` hook end of this sprint. Please migrate to `useQuery` - docs in the wiki."
          },
          {
            id: "e4",
            initials: "JK",
            color: "bg-amber-500",
            name: "Jordan Kim",
            time: "1:30 PM",
            text: "Database indexes are updated. Read queries on the messages table should be 3x faster now. Let me know if you see any regressions.",
            reactions: [{ emoji: "⚡", count: 4 }]
          }
        ]
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
            reactions: [{ emoji: "☕", count: 3 }]
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
              { emoji: "👏", count: 2 }
            ],
            replies: 7,
            lastReply: "Last reply 2h ago",
            replyUsers: [
              { initials: "SC", color: "bg-pink-500" },
              { initials: "MW", color: "bg-emerald-500" }
            ]
          },
          {
            id: "r3",
            initials: "JK",
            color: "bg-amber-500",
            name: "Jordan Kim",
            time: "2:00 PM",
            text: "PSA: the coffee machine on floor 3 is fixed 🎉",
            reactions: [{ emoji: "🎉", count: 6 }]
          }
        ]
      },
      announcements: {
        name: "announcements",
        members: 6,
        description: "Important company announcements",
        starCount: 0,
        showWelcome: true,
        typingNotice: "Marcus Webb is typing...",
        messages: []
      },
      leadership: {
        name: "leadership",
        members: 2,
        description: "Leadership team discussions",
        starCount: 0,
        showWelcome: true,
        messages: []
      }
    };
    const UUID_LIKE_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    computed(
      () => `appchat_channel_directory_${workspaceId.value || workspace.value.id || "default"}`
    );
    const normalizeRef = (value) => value.toLowerCase().trim();
    const isUuidLike = (value) => UUID_LIKE_REGEX.test(value);
    const toDisplayLabel = (rawRef) => {
      const normalized = normalizeRef(rawRef);
      if (!normalized || isUuidLike(normalized)) {
        return "channel";
      }
      return normalized.replace(/-/g, " ");
    };
    const dedupeDirectory = (list) => {
      const map = /* @__PURE__ */ new Map();
      for (const item of list) {
        const normalized = {
          id: String(item.id),
          name: normalizeRef(item.name || item.slug || item.id),
          slug: normalizeRef(item.slug || item.name || item.id),
          description: String(item.description || ""),
          membersCount: Number(item.membersCount || 0),
          private: Boolean(item.private)
        };
        const keys = [
          `id:${normalized.id}`,
          `slug:${normalized.slug}`,
          `name:${normalized.name}`
        ];
        for (const key of keys) {
          map.set(key, normalized);
        }
      }
      const unique = /* @__PURE__ */ new Map();
      for (const item of map.values()) {
        if (!unique.has(item.id)) {
          unique.set(item.id, item);
        }
      }
      return [...unique.values()];
    };
    const mergeIntoChannelCache = (items) => {
      const merged = dedupeDirectory([...cachedChannels.value, ...items]);
      cachedChannels.value = merged;
    };
    const fallbackChannelDirectory = computed(
      () => Object.entries(channels).map(([key, value]) => ({
        id: key,
        name: key,
        slug: key,
        description: value.description,
        membersCount: value.members,
        private: false
      }))
    );
    const findChannelMeta = (directory, rawRef) => {
      const normalized = normalizeRef(rawRef);
      return directory.find(
        (item) => item.id === rawRef || normalizeRef(item.slug) === normalized || normalizeRef(item.name) === normalized
      );
    };
    const resolvedChannelMeta = computed(() => {
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
          private: fromApi.private
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
          private: fromCache.private
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
          private: fromFallback.private
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
        private: false
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
    const activeChannel = computed(() => {
      const key = activeChannelKey.value;
      const fallback = key ? channels[key] : void 0;
      const resolved = resolvedChannelMeta.value;
      if (fallback) {
        return {
          ...fallback,
          name: resolved.displayName || fallback.name,
          description: resolved.description || fallback.description,
          members: resolved.membersCount ?? fallback.members,
          messages: apiMessages.value ?? fallback.messages
        };
      }
      return {
        name: resolved.displayName,
        members: resolved.membersCount || 1,
        description: resolved.description,
        starCount: 0,
        showWelcome: true,
        messages: apiMessages.value ?? []
      };
    });
    const headerChannel = computed(() => ({
      name: activeChannel.value.name,
      description: activeChannel.value.description,
      members: activeChannel.value.members,
      starCount: activeChannel.value.starCount
    }));
    const chatChannel = computed(() => activeChannel.value);
    useHead({
      title: computed(() => `AppChat | ${workspace.value.name} / #${resolvedChannelMeta.value.displayName}`)
    });
    const colorPool = [
      "bg-indigo-500",
      "bg-emerald-500",
      "bg-amber-500",
      "bg-pink-500",
      "bg-red-500",
      "bg-cyan-500"
    ];
    const nameToColor = (name) => {
      const seed = name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
      return colorPool[seed % colorPool.length];
    };
    const toInitials = (name) => {
      return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("");
    };
    const toUiMessage = (message) => {
      const dt = new Date(message.createdAt);
      const formattedTime = Number.isNaN(dt.valueOf()) ? "" : dt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      return {
        id: message.id,
        initials: toInitials(message.author.name),
        color: nameToColor(message.author.name),
        name: message.author.name,
        time: formattedTime,
        text: message.content
      };
    };
    const upsertIncomingMessage = (ui) => {
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
          private: item.private
        }));
        mergeIntoChannelCache(apiChannels.value);
      } catch {
        apiChannels.value = [];
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
      },
      { immediate: true }
    );
    const handleSendMessage = async (content) => {
      try {
        const created = await sendMessage(workspaceId.value, channelId.value, content);
        const ui = toUiMessage(created);
        upsertIncomingMessage(ui);
      } catch {
      }
    };
    const handleOpenThread = (message) => {
      selectedThreadMessage.value = message;
      isThreadPanelOpen.value = true;
    };
    const closeThreadPanel = () => {
      isThreadPanelOpen.value = false;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "h-screen overflow-hidden bg-white text-slate-800" }, _attrs))}><div class="flex h-full">`);
      _push(ssrRenderComponent(_sfc_main$f, null, null, _parent));
      _push(ssrRenderComponent(_sfc_main$b, null, null, _parent));
      _push(`<main class="flex min-w-0 flex-1 flex-col">`);
      _push(ssrRenderComponent(unref(AppHeader), { channel: headerChannel.value }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        channel: chatChannel.value,
        onSendMessage: handleSendMessage,
        onOpenThread: handleOpenThread
      }, null, _parent));
      _push(`</main>`);
      _push(ssrRenderComponent(_sfc_main$2, {
        "is-open": isThreadPanelOpen.value,
        "thread-message": selectedThreadMessage.value,
        onClose: closeThreadPanel
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/workspace/[workspaceId]/channel/[channelId].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };;globalThis.__timing__.logEnd('Load chunks/build/_channelId_-BSHG_XGM');
//# sourceMappingURL=_channelId_-BSHG_XGM.mjs.map
