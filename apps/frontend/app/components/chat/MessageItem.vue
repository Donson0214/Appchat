<template>
  <article class="flex gap-3">
    <MessageAvatar :initials="message.initials" :color="message.color" />
    <div class="min-w-0 flex-1">
      <MessageMeta :name="message.name" :time="message.time" :pinned="message.pinned" />
      <MessageContent :text="message.text" />
      <MessageReactions :replies="message.replies" :lastReply="message.lastReply" :reactions="message.reactions" />
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{ message: any }>();
</script>
