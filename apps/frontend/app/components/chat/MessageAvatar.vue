<template>
  <Avatar size="md" :color="color" :initials="initials" class="mt-0.5" />
</template>

<script setup lang="ts">
import Avatar from "~/components/ui/Avatar.vue";

defineProps<{
  initials: string;
  color: string;
}>();
</script>
