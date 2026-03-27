<template>
  <p class="mt-0.5 text-[14px] font-normal leading-5 text-[#1D1C1D]" v-html="formattedText" />
</template>

<script setup lang="ts">
const props = defineProps<{ text: string }>();

const formattedText = computed(() =>
  props.text
    .replace(/@([a-zA-Z0-9_]+)/g, '<span class="font-medium text-[#1264A3]">@$1</span>')
    .replace(/#([a-zA-Z0-9_-]+)/g, '<span class="font-medium text-[#1264A3]">#$1</span>'),
);
</script>
