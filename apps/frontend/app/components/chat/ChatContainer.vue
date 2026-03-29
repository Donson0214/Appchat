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
      @mention-click="onMentionClick"
      @toggle-reaction="onToggleReaction"
      @toggle-pin="onTogglePin"
    />
    <MessageInput
      :workspace-id="channel.workspaceId"
      :channel-ref="channel.channelRef"
      :channel-name="channel.name"
      :is-direct-message="channel.isDirectMessage"
      @send="onSend"
    />
  </div>
</template>

<script setup lang="ts">
import MessageInput from "~/components/chat/MessageInput.vue";
import MessageList from "~/components/chat/MessageList.vue";
const emit = defineEmits<{
  (event: "send-message", content: string): void;
  (event: "open-thread", message: {
    id: string;
    parentMessageId?: string | null;
    initials: string;
    color: string;
    authorId?: string;
    name: string;
    time: string;
    pinned?: boolean;
    text: string;
    mentions?: Array<{ userId: string | null; displayName: string; mentionKey: string; start: number; end: number }>;
    replies?: number;
    lastReply?: string;
    replyUsers?: Array<{ initials: string; color: string }>;
    reactions?: Array<{ emoji: string; count: number; reactedByMe?: boolean }>;
    attachment?: { name: string; size: string };
  }): void;
  (event: "mention-click", mention: { userId: string | null; displayName: string; mentionKey: string }): void;
  (event: "toggle-reaction", payload: { messageId: string; emoji: string }): void;
  (event: "toggle-pin", messageId: string): void;
}>();

defineProps<{
  channel: {
    workspaceId?: string;
    channelRef?: string;
    name: string;
    description: string;
    isDirectMessage?: boolean;
    showWelcome?: boolean;
    showTopReactions?: boolean;
    typingNotice?: string;
    topReactions?: Array<{ emoji: string; count: number }>;
    messages: Array<{
      id: string;
      parentMessageId?: string | null;
      initials: string;
      color: string;
      authorId?: string;
      name: string;
      time: string;
      pinned?: boolean;
      text: string;
      mentions?: Array<{ userId: string | null; displayName: string; mentionKey: string; start: number; end: number }>;
      replies?: number;
      lastReply?: string;
      replyUsers?: Array<{ initials: string; color: string }>;
      reactions?: Array<{ emoji: string; count: number; reactedByMe?: boolean }>;
      attachment?: { name: string; size: string };
    }>;
  };
}>();

const onSend = (content: string) => {
  emit("send-message", content);
};

const onOpenThread = (message: {
  id: string;
  parentMessageId?: string | null;
  initials: string;
  color: string;
  authorId?: string;
  name: string;
  time: string;
  pinned?: boolean;
  text: string;
  mentions?: Array<{ userId: string | null; displayName: string; mentionKey: string; start: number; end: number }>;
  replies?: number;
  lastReply?: string;
  replyUsers?: Array<{ initials: string; color: string }>;
  reactions?: Array<{ emoji: string; count: number; reactedByMe?: boolean }>;
  attachment?: { name: string; size: string };
}) => {
  emit("open-thread", message);
};

const onMentionClick = (mention: { userId: string | null; displayName: string; mentionKey: string }) => {
  emit("mention-click", mention);
};

const onToggleReaction = (payload: { messageId: string; emoji: string }) => {
  emit("toggle-reaction", payload);
};

const onTogglePin = (messageId: string) => {
  emit("toggle-pin", messageId);
};
</script>
