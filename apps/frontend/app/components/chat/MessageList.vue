<template>
  <div class="flex-1 overflow-y-auto px-4 py-4">
    <div v-if="showTopReactions" class="mb-4 flex items-center gap-2">
      <button
        v-for="reaction in topReactions"
        :key="reaction.emoji"
        type="button"
        class="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1 text-[15px] font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-100"
      >
        <span>{{ reaction.emoji }}</span>
        <span>{{ reaction.count }}</span>
      </button>
      <button
        type="button"
        class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 bg-white text-[20px] text-slate-500 transition-colors duration-150 hover:bg-slate-100"
      >
        +
      </button>
    </div>

    <div v-if="showWelcome" class="mb-5">
      <div class="inline-flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-slate-400">
        <span class="text-[28px] leading-none">#</span>
      </div>
      <h2 class="mt-3 text-[40px] font-semibold leading-none text-[#111827]">Welcome to #{{ channelName }}</h2>
      <p class="mt-2 text-[16px] text-[#64748b]">{{ channelDescription }}</p>
    </div>

    <div v-if="typingNotice" class="mb-4 flex items-center gap-2 text-[15px] text-[#64748b]">
      <span class="inline-flex items-center gap-1 text-slate-400">
        <span class="h-1.5 w-1.5 rounded-full bg-slate-400" />
        <span class="h-1.5 w-1.5 rounded-full bg-slate-400" />
        <span class="h-1.5 w-1.5 rounded-full bg-slate-400" />
      </span>
      <span>{{ typingNotice }}</span>
    </div>

    <div class="space-y-1">
      <MessageItem
        v-for="message in messages"
        :key="message.id"
        :message="message"
        @open-thread="emit('open-thread', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import MessageItem from "~/components/chat/MessageItem.vue";

const emit = defineEmits<{
  (event: "open-thread", message: {
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
  }): void;
}>();

defineProps<{
  channelName: string;
  channelDescription: string;
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
}>();
</script>
