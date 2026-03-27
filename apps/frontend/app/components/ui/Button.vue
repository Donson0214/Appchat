<template>
  <button
    :class="[
      'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 ease-in-out disabled:cursor-not-allowed disabled:opacity-50',
      variantClass,
      sizeClass,
    ]"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'ghost' | 'soft';
    size?: 'sm' | 'md';
  }>(),
  {
    variant: 'primary',
    size: 'md',
  },
);

const variantClass = computed(() => {
  if (props.variant === 'ghost') return 'bg-transparent text-slate-500 hover:bg-slate-100';
  if (props.variant === 'soft') return 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200';
  return 'bg-gradient-to-r from-indigo-400 to-indigo-500 text-white hover:brightness-105';
});

const sizeClass = computed(() => (props.size === 'sm' ? 'h-8 px-3 text-sm' : 'h-10 px-4 text-[15px]'));
</script>
