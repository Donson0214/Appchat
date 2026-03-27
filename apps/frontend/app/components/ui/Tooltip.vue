<template>
  <span class="group relative inline-flex">
    <slot />
    <span class="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 rounded-md bg-slate-900 px-2 py-1 text-xs text-white group-hover:block">
      {{ text }}
    </span>
  </span>
</template>

<script setup lang="ts">
defineProps<{ text: string }>();
</script>
