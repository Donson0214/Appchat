<template>
  <div class="flex-1 overflow-y-auto px-6 py-5">
    <div class="mb-4 flex items-center gap-2">
      <div class="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-1 text-[14px] text-slate-600">
        <span>👍</span><span>2</span>
      </div>
      <button class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-400">+</button>
    </div>

    <div class="space-y-6">
      <MessageItem v-for="message in messages" :key="message.id" :message="message" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ messages: any[] }>();
</script>
