<template>
  <div class="flex-1 overflow-y-auto px-4 py-3">
    <div v-if="showTopReactions" class="mb-3 flex items-center gap-1.5">
      <button
        v-for="reaction in topReactions"
        :key="reaction.emoji"
        type="button"
        class="inline-flex items-center gap-1 rounded-[8px] border border-[#e5e7eb] bg-[#f1f2f4] px-2 py-0.5 text-[12px] font-medium text-[#616061]"
      >
        <span>{{ reaction.emoji }}</span>
        <span>{{ reaction.count }}</span>
      </button>
      <button type="button" class="inline-flex h-6 w-6 items-center justify-center rounded-[8px] border border-[#e5e7eb] bg-white text-[16px] text-[#8f95a3]">+</button>
    </div>

    <div v-if="showWelcome" class="mb-4">
      <div class="inline-flex h-11 w-11 items-center justify-center rounded-[8px] bg-[#f1f2f4] text-[#9ca3af]">
        <span class="text-[22px] leading-none">#</span>
      </div>
      <h2 class="mt-3 text-[36px] font-bold leading-none text-[#1d1c1d]">Welcome to #{{ channelName }}</h2>
      <p class="mt-1.5 text-[14px] leading-5 text-[#6b6f76]">{{ channelDescription }}</p>
    </div>

    <div v-if="typingNotice" class="mb-3 flex items-center gap-2 text-[13px] text-[#6b6f76]">
      <span class="inline-flex items-center gap-1 text-[#9ca3af]">
        <span class="h-1.5 w-1.5 rounded-full bg-[#9ca3af]" />
        <span class="h-1.5 w-1.5 rounded-full bg-[#9ca3af]" />
        <span class="h-1.5 w-1.5 rounded-full bg-[#9ca3af]" />
      </span>
      <span>{{ typingNotice }}</span>
    </div>

    <div class="space-y-3">
      <MessageItem v-for="message in messages" :key="message.id" :message="message" />
    </div>
  </div>
</template>

<script setup lang="ts">
import MessageItem from "~/components/chat/MessageItem.vue";

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
