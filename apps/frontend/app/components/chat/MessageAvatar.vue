<template>
  <Avatar :initials="initials" :color="color" size="md" />
</template>

<script setup lang="ts">
defineProps<{ initials: string; color: string }>();
</script>
