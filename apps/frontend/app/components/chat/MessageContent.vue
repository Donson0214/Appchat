<template>
  <p class="mt-0.5 text-[16px] font-normal leading-7 text-slate-800" v-html="formattedText" />
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ text: string }>();

const formattedText = computed(() =>
  props.text.replace(/@([a-zA-Z0-9_]+)/g, '<span class="font-semibold text-indigo-600">@$1</span>'),
);
</script>
