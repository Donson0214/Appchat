<template>
  <div class="mt-1.5 flex flex-wrap items-center gap-1.5">
    <button
      v-for="reaction in reactions"
      :key="reaction.emoji"
      class="inline-flex items-center gap-1 rounded-[8px] border border-[#e5e7eb] bg-[#f1f2f4] px-2 py-0.5 text-[12px] font-medium text-[#616061] transition hover:bg-[#e8eaed]"
      type="button"
    >
      <span class="text-[13px] leading-none">{{ reaction.emoji }}</span>
      <span>{{ reaction.count }}</span>
    </button>

    <button
      v-if="replies"
      type="button"
      class="inline-flex items-center gap-1 text-[13px] leading-[18px]"
      @click="$emit('openThread')"
    >
      <span
        v-for="reply in replyUsers"
        :key="reply.initials"
        class="inline-flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-semibold text-white"
        :class="reply.color"
      >
        {{ reply.initials }}
      </span>
      <span class="ml-1 font-semibold text-indigo-600">{{ replies }} replies</span>
      <span class="font-normal text-[#8f95a3]">{{ lastReply }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  openThread: [];
}>();

defineProps<{
  reactions?: Array<{ emoji: string; count: number }>;
  replies?: number;
  lastReply?: string;
  replyUsers?: Array<{ initials: string; color: string }>;
}>();
</script>
