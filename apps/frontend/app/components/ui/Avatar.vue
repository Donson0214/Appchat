<template>
  <div
    :class="[
      'inline-flex items-center justify-center rounded-md font-semibold text-white',
      size === 'sm' ? 'h-6 w-6 text-[11px]' : 'h-8 w-8 text-[13px]',
      color,
    ]"
  >
    <slot>{{ initials }}</slot>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    initials?: string;
    size?: 'sm' | 'md';
    color?: string;
  }>(),
  {
    initials: 'U',
    size: 'md',
    color: 'bg-indigo-500',
  },
);
</script>
