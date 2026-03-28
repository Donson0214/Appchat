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
          @click="activeTab = tab"
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

    <div class="flex-1 overflow-y-auto px-4 py-4">
      <template v-if="activeTab === 'Thread' && threadMessage">
        <article class="flex gap-3">
          <span
            class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[16px] font-semibold text-white"
            :class="threadMessage.color"
          >
            {{ threadMessage.initials }}
          </span>
          <div class="min-w-0">
            <div class="flex items-baseline gap-2">
              <p class="text-[17px] font-semibold leading-tight text-[#1d1c1d]">{{ threadMessage.name }}</p>
              <span class="text-[14px] font-normal text-[#9ca3af]">{{ threadMessage.time }}</span>
            </div>
            <p class="mt-1 text-[16px] leading-[1.35] text-[#1d1c1d]">{{ threadMessage.text }}</p>

            <div v-if="threadMessage.reactions?.length" class="mt-3 flex flex-wrap items-center gap-2">
              <button
                v-for="reaction in threadMessage.reactions"
                :key="reaction.emoji"
                type="button"
                class="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[14px] font-medium text-slate-600"
              >
                <span class="text-[15px]">{{ reaction.emoji }}</span>
                <span>{{ reaction.count }}</span>
              </button>
            </div>
          </div>
        </article>

        <div class="my-4 border-t border-slate-200" />
        <p class="mb-3 text-[15px] font-medium text-slate-400">{{ computedReplies.length }} replies</p>

        <div class="space-y-4">
          <article v-for="reply in computedReplies" :key="reply.id" class="flex gap-3">
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
              <p class="mt-1 text-[16px] leading-[1.35] text-[#1d1c1d]">{{ reply.text }}</p>
              <div v-if="reply.reactions?.length" class="mt-2 flex items-center gap-2">
                <button
                  v-for="reaction in reply.reactions"
                  :key="reaction.emoji"
                  type="button"
                  class="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[14px] font-medium text-slate-600"
                >
                  <span class="text-[15px]">{{ reaction.emoji }}</span>
                  <span>{{ reaction.count }}</span>
                </button>
              </div>
            </div>
          </article>
        </div>
      </template>
    </div>

    <div class="border-t border-slate-200 p-3">
      <div class="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2">
        <input
          type="text"
          class="h-8 flex-1 bg-transparent text-[15px] text-slate-700 outline-none placeholder:text-slate-400"
          placeholder="Reply in thread..."
        />
        <button class="inline-flex h-9 w-9 items-center justify-center rounded-md bg-indigo-300 text-white">
          <svg viewBox="0 0 20 20" class="h-4 w-4 fill-current">
            <path d="M2.4 10.8 15.5 4c1-.5 2 .5 1.5 1.5L10.2 18.6c-.4.8-1.6.7-1.8-.2L7 12.8 1.4 11.8c-.9-.2-1.1-1.4 0-1.8Zm5.2.2.8 3.1 4.4-8.5L7.6 11Z" />
          </svg>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

type MessageShape = {
  id: string;
  initials: string;
  color: string;
  name: string;
  time: string;
  text: string;
  reactions?: Array<{ emoji: string; count: number }>;
  replies?: number;
};

const props = defineProps<{
  isOpen?: boolean;
  threadMessage?: MessageShape | null;
}>();

defineEmits<{
  (event: "close"): void;
}>();

const tabs = ["Thread", "Profile", "Pinned", "Search"];
const activeTab = ref("Thread");

watch(
  () => props.threadMessage?.id,
  () => {
    activeTab.value = "Thread";
  },
);

const computedReplies = computed(() => {
  const root = props.threadMessage;
  if (!root) return [];

  const fallback = [
    {
      id: `${root.id}-r1`,
      initials: "MW",
      color: "bg-emerald-500",
      name: "Marcus Webb",
      time: "10:35 AM",
      text: "This is huge! The auto-layout changes alone will save hours of work.",
      reactions: [{ emoji: "💯", count: 2 }],
    },
    {
      id: `${root.id}-r2`,
      initials: "PP",
      color: "bg-indigo-500",
      name: "Priya Patel",
      time: "10:40 AM",
      text: "Love the new color token names — much more semantic than before.",
    },
    {
      id: `${root.id}-r3`,
      initials: "JK",
      color: "bg-amber-500",
      name: "Jordan Kim",
      time: "10:52 AM",
      text: "Can we schedule a quick sync to walk through the implementation guide?",
    },
    {
      id: `${root.id}-r4`,
      initials: "SC",
      color: "bg-pink-500",
      name: "Sarah Chen",
      time: "11:01 AM",
      text: "Absolutely! How does Thursday 2 PM sound? I can do a live walkthrough.",
      reactions: [{ emoji: "👍", count: 3 }],
    },
  ];

  const count = Math.max(1, Math.min(root.replies ?? 4, fallback.length));
  return fallback.slice(0, count);
});
</script>
