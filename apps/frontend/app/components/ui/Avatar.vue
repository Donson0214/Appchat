<template>
  <div
    :class="[
      'inline-flex items-center justify-center rounded-md font-semibold text-white',
      size === 'sm' ? 'h-8 w-8 text-sm' : 'h-11 w-11 text-base',
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
