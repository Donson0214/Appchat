<template>
  <div class="mt-2 flex flex-wrap items-center gap-2">
    <button
      v-for="reaction in reactions"
      :key="reaction.emoji"
      class="inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[14px] font-medium transition-colors duration-200"
      :class="
        reaction.reactedByMe
          ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
          : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-100'
      "
      type="button"
      @click="$emit('toggle-reaction', reaction.emoji)"
    >
      <span class="text-[16px] leading-none">{{ reaction.emoji }}</span>
      <span>{{ reaction.count }}</span>
    </button>

    <button
      v-if="replies"
      type="button"
      class="inline-flex items-center gap-1 text-[15px] leading-6"
      @click="$emit('open-thread')"
    >
      <span
        v-for="reply in replyUsers"
        :key="reply.initials"
        class="inline-flex h-7 w-7 items-center justify-center rounded-md text-[12px] font-semibold text-white"
        :class="reply.color"
      >
        {{ reply.initials }}
      </span>
      <span class="ml-1 font-semibold text-indigo-600">{{ replies }} replies</span>
      <span class="font-normal text-slate-400">{{ lastReply }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  (event: "open-thread"): void;
  (event: "toggle-reaction", emoji: string): void;
}>();

defineProps<{
  reactions?: Array<{ emoji: string; count: number; reactedByMe?: boolean }>;
  replies?: number;
  lastReply?: string;
  replyUsers?: Array<{ initials: string; color: string }>;
}>();
</script>
