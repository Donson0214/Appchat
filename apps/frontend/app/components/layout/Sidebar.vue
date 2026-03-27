<template>
  <aside class="flex h-full w-[84px] flex-col items-center justify-between border-r border-slate-800 bg-[#0f1a35] py-4">
    <div class="flex w-full flex-col items-center gap-2">
      <button
        v-for="(item, index) in workspaces"
        :key="item.id"
        class="relative flex h-[58px] w-[58px] items-center justify-center rounded-[14px] text-[32px] font-bold text-white transition-all duration-200 hover:brightness-110"
        :class="item.bg"
      >
        {{ item.label }}
        <span v-if="index === 0" class="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-indigo-500" />
      </button>
      <button class="mt-2 flex h-[58px] w-[58px] items-center justify-center rounded-[14px] border border-dashed border-slate-500 text-[28px] text-slate-300 transition-all duration-200 hover:bg-slate-800">
        +
      </button>
    </div>

    <button class="relative mb-1 flex h-[54px] w-[54px] items-center justify-center rounded-[14px] bg-indigo-500 text-[24px] font-bold text-white">
      AM
      <span class="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[#0f1a35] bg-emerald-400"></span>
    </button>
  </aside>
</template>

<script setup lang="ts">
const workspaces = [
  { id: 'a', label: 'A', bg: 'bg-indigo-500' },
  { id: 's', label: 'S', bg: 'bg-emerald-500' },
  { id: 'o', label: 'O', bg: 'bg-amber-600' },
];
</script>
