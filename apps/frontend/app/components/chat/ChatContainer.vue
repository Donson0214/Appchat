<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <MessageList
      :channel-name="channel.name"
      :channel-description="channel.description"
      :show-welcome="channel.showWelcome"
      :show-top-reactions="channel.showTopReactions"
      :typing-notice="channel.typingNotice"
      :top-reactions="channel.topReactions"
      :messages="channel.messages"
      @open-thread="onOpenThread"
    />
    <MessageInput :channel-name="channel.name" :is-direct-message="channel.isDirectMessage" @send="onSend" />
  </div>
</template>

<script setup lang="ts">
import MessageInput from "~/components/chat/MessageInput.vue";
import MessageList from "~/components/chat/MessageList.vue";
const emit = defineEmits<{
  (event: "send-message", content: string): void;
  (event: "open-thread", message: {
    id: string;
    initials: string;
    color: string;
    name: string;
    time: string;
    pinned?: boolean;
    text: string;
    replies?: number;
    lastReply?: string;
    replyUsers?: Array<{ initials: string; color: string }>;
    reactions?: Array<{ emoji: string; count: number }>;
    attachment?: { name: string; size: string };
  }): void;
}>();

defineProps<{
  channel: {
    name: string;
    description: string;
    isDirectMessage?: boolean;
    showWelcome?: boolean;
    showTopReactions?: boolean;
    typingNotice?: string;
    topReactions?: Array<{ emoji: string; count: number }>;
    messages: Array<{
      id: string;
      initials: string;
      color: string;
      name: string;
      time: string;
      pinned?: boolean;
      text: string;
      replies?: number;
      lastReply?: string;
      replyUsers?: Array<{ initials: string; color: string }>;
      reactions?: Array<{ emoji: string; count: number }>;
      attachment?: { name: string; size: string };
    }>;
  };
}>();

const onSend = (content: string) => {
  emit("send-message", content);
};

const onOpenThread = (message: {
  id: string;
  initials: string;
  color: string;
  name: string;
  time: string;
  pinned?: boolean;
  text: string;
  replies?: number;
  lastReply?: string;
  replyUsers?: Array<{ initials: string; color: string }>;
  reactions?: Array<{ emoji: string; count: number }>;
  attachment?: { name: string; size: string };
}) => {
  emit("open-thread", message);
};
</script>
