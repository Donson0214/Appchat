<template>
  <aside v-if="isOpen" class="flex h-full w-[380px] flex-col border-l border-slate-300 bg-white">
    <div class="flex h-[52px] items-center justify-between border-b border-slate-200 px-3">
      <div class="flex items-center gap-1">
        <button
          v-for="tab in tabs"
          :key="tab"
          type="button"
          class="rounded-md px-3 py-1.5 text-[14px] font-medium transition-colors duration-150"
          :class="activeTab === tab ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50'"
          @click="switchTab(tab)"
        >
          {{ tab }}
        </button>
      </div>
      <button
        type="button"
        class="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        @click="$emit('close')"
      >
        <svg viewBox="0 0 20 20" class="h-4 w-4 fill-current">
          <path d="M5.3 5.3a1 1 0 0 1 1.4 0L10 8.6l3.3-3.3a1 1 0 1 1 1.4 1.4L11.4 10l3.3 3.3a1 1 0 0 1-1.4 1.4L10 11.4l-3.3 3.3a1 1 0 1 1-1.4-1.4l3.3-3.3-3.3-3.3a1 1 0 0 1 0-1.4Z" />
        </svg>
      </button>
    </div>

    <div v-if="panelError" class="border-b border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
      {{ panelError }}
    </div>

    <div class="flex-1 overflow-y-auto px-4 py-4">
      <template v-if="activeTab === 'Thread'">
        <div v-if="threadLoading" class="text-sm text-slate-500">Loading thread...</div>
        <template v-else-if="threadRoot">
          <article class="flex gap-3">
            <span
              class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[16px] font-semibold text-white"
              :class="threadRoot.color"
            >
              {{ threadRoot.initials }}
            </span>
            <div class="min-w-0">
              <div class="flex items-baseline gap-2">
                <p class="text-[17px] font-semibold leading-tight text-[#1d1c1d]">{{ threadRoot.name }}</p>
                <span class="text-[14px] font-normal text-[#9ca3af]">{{ threadRoot.time }}</span>
              </div>
              <MessageContent :text="threadRoot.text" :mentions="threadRoot.mentions" @mention-click="onMentionClick" />
              <div class="mt-2 flex flex-wrap items-center gap-2">
                <button
                  v-for="reaction in threadRoot.reactions"
                  :key="reaction.emoji"
                  type="button"
                  class="inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[13px] font-medium"
                  :class="reaction.reactedByMe ? 'border-indigo-300 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600'"
                  @click="toggleReaction(threadRoot.id, reaction)"
                >
                  <span>{{ reaction.emoji }}</span>
                  <span>{{ reaction.count }}</span>
                </button>
                <button
                  type="button"
                  class="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
                  @click="togglePin(threadRoot)"
                >
                  {{ threadRoot.pinned ? "Unpin" : "Pin" }}
                </button>
              </div>
            </div>
          </article>

          <div class="my-4 border-t border-slate-200" />
          <p class="mb-3 text-[15px] font-medium text-slate-400">{{ threadReplies.length }} replies</p>

          <div class="space-y-4">
            <article v-for="reply in threadReplies" :key="reply.id" class="flex gap-3">
              <span
                class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[15px] font-semibold text-white"
                :class="reply.color"
              >
                {{ reply.initials }}
              </span>
              <div class="min-w-0">
                <div class="flex items-baseline gap-2">
                  <p class="text-[17px] font-semibold leading-tight text-[#1d1c1d]">{{ reply.name }}</p>
                  <span class="text-[14px] text-[#9ca3af]">{{ reply.time }}</span>
                </div>
                <MessageContent :text="reply.text" :mentions="reply.mentions" @mention-click="onMentionClick" />
                <div class="mt-2 flex items-center gap-2">
                  <button
                    v-for="reaction in reply.reactions"
                    :key="`${reply.id}-${reaction.emoji}`"
                    type="button"
                    class="inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[13px] font-medium"
                    :class="reaction.reactedByMe ? 'border-indigo-300 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600'"
                    @click="toggleReaction(reply.id, reaction)"
                  >
                    <span>{{ reaction.emoji }}</span>
                    <span>{{ reaction.count }}</span>
                  </button>
                </div>
              </div>
            </article>
          </div>
        </template>
      </template>

      <template v-else-if="activeTab === 'Profile'">
        <div v-if="profileLoading" class="text-sm text-slate-500">Loading profile...</div>
        <div v-else-if="profileCard" class="rounded-md border border-slate-200 p-3">
          <p class="text-sm font-semibold text-slate-900">{{ profileCard.name }}</p>
          <p class="mt-1 text-xs text-slate-500">{{ profileCard.email }}</p>
          <p class="mt-2 text-xs text-slate-500">Role: <span class="font-medium text-slate-700">{{ profileCard.role }}</span></p>
          <p class="mt-1 text-xs text-slate-500">Status: <span class="font-medium text-slate-700">{{ profileCard.status }}</span></p>
        </div>
        <p v-else class="text-sm text-slate-500">No profile selected.</p>
      </template>

      <template v-else-if="activeTab === 'Pinned'">
        <div v-if="pinsLoading" class="text-sm text-slate-500">Loading pinned messages...</div>
        <div v-else-if="pins.length === 0" class="text-sm text-slate-500">No pinned messages in this channel.</div>
        <div v-else class="space-y-3">
          <button
            v-for="item in pins"
            :key="item.id"
            type="button"
            class="w-full rounded-md border border-slate-200 p-3 text-left hover:bg-slate-50"
            @click="$emit('jump-to-message', item.id)"
          >
            <p class="text-xs font-semibold text-slate-800">{{ item.author.name }}</p>
            <p class="mt-1 line-clamp-2 text-sm text-slate-600">{{ item.content }}</p>
          </button>
        </div>
      </template>

      <template v-else>
        <div class="mb-3 flex items-center gap-2">
          <input
            v-model="searchQuery"
            type="text"
            class="h-9 flex-1 rounded-md border border-slate-300 px-2.5 text-sm outline-none focus:border-indigo-400"
            placeholder="Search workspace..."
            @keydown.enter.prevent="runSearch"
          />
          <select
            v-model="searchScope"
            class="h-9 rounded-md border border-slate-300 px-2 text-xs outline-none focus:border-indigo-400"
          >
            <option value="messages">Messages</option>
            <option value="people">People</option>
            <option value="channels">Channels</option>
          </select>
          <button
            type="button"
            class="h-9 rounded-md bg-indigo-600 px-3 text-xs font-semibold text-white hover:bg-indigo-700"
            @click="runSearch"
          >
            Search
          </button>
        </div>
        <div v-if="searchLoading" class="text-sm text-slate-500">Searching...</div>
        <div v-else-if="searchResults.length === 0" class="text-sm text-slate-500">No results.</div>
        <div v-else class="space-y-2">
          <div v-for="(item, index) in searchResults" :key="index" class="rounded-md border border-slate-200 p-2 text-sm text-slate-700">
            <pre class="whitespace-pre-wrap">{{ renderSearchResult(item) }}</pre>
          </div>
        </div>
      </template>
    </div>

    <div v-if="activeTab === 'Thread'" class="border-t border-slate-200 p-3">
      <div class="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2">
        <input
          v-model="replyDraft"
          type="text"
          class="h-8 flex-1 bg-transparent text-[15px] text-slate-700 outline-none placeholder:text-slate-400"
          placeholder="Reply in thread..."
          @keydown.enter.prevent="submitReply"
        />
        <button
          class="inline-flex h-9 w-9 items-center justify-center rounded-md text-white"
          :class="replyDraft.trim() ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-300'"
          @click="submitReply"
        >
          <svg viewBox="0 0 20 20" class="h-4 w-4 fill-current">
            <path d="M2.4 10.8 15.5 4c1-.5 2 .5 1.5 1.5L10.2 18.6c-.4.8-1.6.7-1.8-.2L7 12.8 1.4 11.8c-.9-.2-1.1-1.4 0-1.8Zm5.2.2.8 3.1 4.4-8.5L7.6 11Z" />
          </svg>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { io, type Socket } from "socket.io-client";
import { useMessageApi } from "../../composables/use-message-api";
import { usePresenceApi, type PresenceStatus } from "../../composables/use-presence-api";
import { getValidAccessToken } from "../../utils/auth-session";
import MessageContent from "../chat/MessageContent.vue";

type UiMessage = {
  id: string;
  author: { id?: string; name: string; email: string };
  initials: string;
  color: string;
  name: string;
  time: string;
  text: string;
  mentions: Array<{ userId: string | null; displayName: string; mentionKey: string; start: number; end: number }>;
  reactions: Array<{ emoji: string; count: number; reactedByMe: boolean }>;
  pinned: boolean;
};

const props = withDefaults(
  defineProps<{
    isOpen?: boolean;
    workspaceId?: string;
    channelRef?: string;
    threadMessage?: {
      id: string;
      authorId?: string;
      name: string;
      text: string;
    } | null;
    profileHint?: { userId?: string | null; name?: string } | null;
  }>(),
  {
    isOpen: false,
    workspaceId: "",
    channelRef: "",
    threadMessage: null,
    profileHint: null,
  },
);

const emit = defineEmits<{
  (event: "close"): void;
  (event: "jump-to-message", messageId: string): void;
  (event: "profile-selected", profile: { userId: string | null; name: string }): void;
}>();

const tabs = ["Thread", "Profile", "Pinned", "Search"];
const activeTab = ref("Thread");
const panelError = ref("");

const threadLoading = ref(false);
const threadRoot = ref<UiMessage | null>(null);
const threadReplies = ref<UiMessage[]>([]);
const replyDraft = ref("");

const profileLoading = ref(false);
const profileCard = ref<{ name: string; email: string; role: string; status: PresenceStatus } | null>(null);

const pinsLoading = ref(false);
const pins = ref<Array<{ id: string; content: string; author: { name: string } }>>([]);

const searchLoading = ref(false);
const searchQuery = ref("");
const searchScope = ref<"messages" | "people" | "channels">("messages");
const searchResults = ref<unknown[]>([]);

const unreadSocketRef = ref<Socket | null>(null);

const { fetchThread, sendReply, addReaction, removeReaction, pinMessage, unpinMessage, fetchPinned, searchWorkspace } = useMessageApi();
const { fetchWorkspacePresence } = usePresenceApi();

const palette = ["bg-indigo-500", "bg-emerald-500", "bg-amber-500", "bg-pink-500", "bg-cyan-500"];
const colorFor = (name: string) => {
  const seed = name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return palette[seed % palette.length];
};
const initialsFor = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
const toTime = (iso: string) => {
  const dt = new Date(iso);
  if (Number.isNaN(dt.valueOf())) return "";
  return dt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
};

const currentThreadRootId = computed(() => props.threadMessage?.id || "");

const toUi = (dto: {
  id: string;
  content: string;
  createdAt: string;
  mentions?: Array<{ userId: string | null; displayName: string; mentionKey: string; start: number; end: number }>;
  reactions?: Array<{ emoji: string; count: number; reactedByMe: boolean }>;
  pinned?: boolean;
  author: { id?: string; name: string; email: string };
}): UiMessage => ({
  id: dto.id,
  author: dto.author,
  initials: initialsFor(dto.author.name),
  color: colorFor(dto.author.name),
  name: dto.author.name,
  time: toTime(dto.createdAt),
  text: dto.content,
  mentions: dto.mentions || [],
  reactions: dto.reactions || [],
  pinned: Boolean(dto.pinned),
});

const loadThread = async () => {
  if (!props.workspaceId || !props.channelRef || !props.threadMessage?.id) {
    threadRoot.value = null;
    threadReplies.value = [];
    return;
  }

  threadLoading.value = true;
  panelError.value = "";
  try {
    const payload = await fetchThread(props.workspaceId, props.channelRef, props.threadMessage.id);
    threadRoot.value = toUi(payload.root);
    threadReplies.value = payload.replies.map(toUi);
  } catch {
    panelError.value = "Unable to load thread.";
  } finally {
    threadLoading.value = false;
  }
};

const submitReply = async () => {
  const content = replyDraft.value.trim();
  if (!content || !currentThreadRootId.value) {
    return;
  }

  panelError.value = "";
  try {
    const created = await sendReply(props.workspaceId, props.channelRef, currentThreadRootId.value, content);
    threadReplies.value = [...threadReplies.value, toUi(created)];
    replyDraft.value = "";
  } catch {
    panelError.value = "Unable to send reply.";
  }
};

const toggleReaction = async (
  messageId: string,
  reaction: { emoji: string; reactedByMe?: boolean },
) => {
  panelError.value = "";
  try {
    if (reaction.reactedByMe) {
      await removeReaction(props.workspaceId, props.channelRef, messageId, reaction.emoji);
    } else {
      await addReaction(props.workspaceId, props.channelRef, messageId, reaction.emoji);
    }
  } catch {
    panelError.value = "Unable to update reaction.";
  }
};

const togglePin = async (message: UiMessage) => {
  panelError.value = "";
  try {
    if (message.pinned) {
      await unpinMessage(props.workspaceId, props.channelRef, message.id);
      message.pinned = false;
    } else {
      await pinMessage(props.workspaceId, props.channelRef, message.id);
      message.pinned = true;
    }
  } catch {
    panelError.value = "Unable to update pin state.";
  }
};

const loadPins = async () => {
  pinsLoading.value = true;
  panelError.value = "";
  try {
    const items = await fetchPinned(props.workspaceId, props.channelRef);
    pins.value = items.map((item) => ({
      id: item.id,
      content: item.content,
      author: { name: item.author.name },
    }));
  } catch {
    panelError.value = "Unable to load pinned messages.";
  } finally {
    pinsLoading.value = false;
  }
};

const runSearch = async () => {
  searchLoading.value = true;
  panelError.value = "";
  try {
    const result = await searchWorkspace(props.workspaceId, searchQuery.value, searchScope.value);
    searchResults.value = result.items;
  } catch {
    panelError.value = "Search failed.";
  } finally {
    searchLoading.value = false;
  }
};

const renderSearchResult = (item: unknown) => JSON.stringify(item, null, 1);

const loadProfile = async () => {
  profileLoading.value = true;
  panelError.value = "";

  const targetUserId = props.profileHint?.userId || props.threadMessage?.authorId || threadRoot.value?.author.id;
  try {
    const members = await fetchWorkspacePresence(props.workspaceId);
    const found = members.find((member) => member.id === targetUserId) ?? members.find((member) => member.name === props.profileHint?.name);
    if (!found) {
      profileCard.value = null;
      return;
    }

    profileCard.value = {
      name: found.name,
      email: found.email,
      role: found.role,
      status: found.status,
    };
    emit("profile-selected", { userId: found.id, name: found.name });
  } catch {
    panelError.value = "Unable to load profile.";
  } finally {
    profileLoading.value = false;
  }
};

const switchTab = async (tab: string) => {
  activeTab.value = tab;
  if (tab === "Thread") {
    await loadThread();
  } else if (tab === "Profile") {
    await loadProfile();
  } else if (tab === "Pinned") {
    await loadPins();
  }
};

const onMentionClick = (mention: { userId: string | null; displayName: string; mentionKey: string }) => {
  activeTab.value = "Profile";
  void loadProfile();
  emit("profile-selected", { userId: mention.userId, name: mention.displayName });
};

const connectRealtime = () => {
  if (typeof window === "undefined") return;
  if (!props.workspaceId || !props.channelRef) return;
  if (unreadSocketRef.value) return;

  const token = getValidAccessToken();
  if (!token) return;

  const config = useRuntimeConfig();
  const base = (config.public.apiBaseUrl || "").trim() || "https://localhost:3000";
  unreadSocketRef.value = io(`${base}/ws`, {
    transports: ["websocket"],
    withCredentials: true,
    auth: { token },
    extraHeaders: { Authorization: `Bearer ${token}` },
  });
  unreadSocketRef.value.emit("join-room", { workspaceId: props.workspaceId, channelRef: props.channelRef });

  unreadSocketRef.value.on("thread:reply-created", (payload: { rootMessageId: string; reply: unknown }) => {
    if (payload.rootMessageId !== currentThreadRootId.value) {
      return;
    }
    const reply = toUi(payload.reply as any);
    if (!threadReplies.value.some((item) => item.id === reply.id)) {
      threadReplies.value = [...threadReplies.value, reply];
    }
  });

  unreadSocketRef.value.on(
    "message:reaction-updated",
    (payload: { messageId: string; reactions: Array<{ emoji: string; count: number; reactedByMe: boolean }> }) => {
      if (threadRoot.value?.id === payload.messageId) {
        threadRoot.value = { ...threadRoot.value, reactions: payload.reactions };
      }
      threadReplies.value = threadReplies.value.map((item) =>
        item.id === payload.messageId ? { ...item, reactions: payload.reactions } : item,
      );
    },
  );

  unreadSocketRef.value.on("message:pinned", (payload: { messageId: string }) => {
    if (threadRoot.value?.id === payload.messageId) {
      threadRoot.value = { ...threadRoot.value, pinned: true };
    }
  });

  unreadSocketRef.value.on("message:unpinned", (payload: { messageId: string }) => {
    if (threadRoot.value?.id === payload.messageId) {
      threadRoot.value = { ...threadRoot.value, pinned: false };
    }
  });
};

watch(
  () => [props.workspaceId, props.channelRef, props.threadMessage?.id],
  async () => {
    if (!props.isOpen) {
      return;
    }
    activeTab.value = "Thread";
    await loadThread();
    connectRealtime();
  },
  { immediate: true },
);

watch(
  () => props.profileHint,
  async () => {
    if (!props.profileHint) return;
    activeTab.value = "Profile";
    await loadProfile();
  },
  { deep: true },
);

watch(
  () => props.isOpen,
  async (open) => {
    if (!open) {
      return;
    }
    await loadThread();
    connectRealtime();
  },
);

onBeforeUnmount(() => {
  if (unreadSocketRef.value) {
    unreadSocketRef.value.disconnect();
    unreadSocketRef.value = null;
  }
});
</script>
