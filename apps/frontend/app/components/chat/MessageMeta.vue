<template>
  <div class="flex items-baseline gap-2.5">
    <h3 class="text-[18px] font-medium leading-6 text-slate-900">{{ name }}</h3>
    <p class="text-[15px] font-normal text-slate-400">{{ time }}</p>
    <p v-if="pinned" class="inline-flex items-center gap-1 text-[15px] font-normal text-amber-500">
      <svg viewBox="0 0 20 20" class="h-3.5 w-3.5 fill-current">
        <path d="M12.4 2.8 17 7.4a1 1 0 0 1-1.4 1.4l-.5-.5-2 2-.1 4.7a1 1 0 0 1-1.7.7l-2-2-2.2 2.2a1 1 0 1 1-1.4-1.4l2.2-2.2-2-2a1 1 0 0 1 .7-1.7l4.7-.1 2-2-.5-.5a1 1 0 0 1 1.4-1.4Z" />
      </svg>
      <span>pinned</span>
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name: string;
  time: string;
  pinned?: boolean;
}>();
</script>
