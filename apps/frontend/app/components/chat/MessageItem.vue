<template>
  <article class="group relative -mx-2 rounded-md px-2 py-1.5 transition-colors duration-150 hover:bg-slate-100/80">
    <div class="flex gap-3.5">
      <MessageAvatar :initials="message.initials" :color="message.color" />

      <div class="min-w-0 flex-1 pr-40">
        <MessageMeta :name="message.name" :time="message.time" :pinned="message.pinned" />
        <MessageContent :text="message.text" :mentions="message.mentions" @mention-click="onMentionClick" />

        <div
          v-if="message.attachment"
          class="mt-2 inline-flex min-w-[280px] items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2"
        >
          <div class="flex items-center gap-3">
            <span class="inline-flex h-8 w-8 items-center justify-center rounded-md bg-violet-100 text-violet-400">
              <svg viewBox="0 0 20 20" class="h-4 w-4 fill-current">
                <path d="M5 2.8A1.8 1.8 0 0 0 3.2 4.6v10.8A1.8 1.8 0 0 0 5 17.2h10a1.8 1.8 0 0 0 1.8-1.8V7.8l-5-5H5Zm6 1.7 4.1 4.1h-2.6a1.5 1.5 0 0 1-1.5-1.5V4.5Z" />
              </svg>
            </span>
            <div>
              <p class="max-w-[240px] truncate text-[15px] font-medium text-[#1d1c1d]">{{ message.attachment.name }}</p>
              <p class="text-[13px] text-[#8f95a3]">{{ message.attachment.size }}</p>
            </div>
          </div>
          <button type="button" class="inline-flex h-7 w-7 items-center justify-center rounded-md text-[#8f95a3] transition-colors hover:bg-white hover:text-[#616061]">
            <svg viewBox="0 0 20 20" class="h-4 w-4 fill-current">
              <path d="M9 3a1 1 0 0 1 2 0v7.6l2.1-2.2a1 1 0 0 1 1.4 1.4l-3.8 3.9a1 1 0 0 1-1.4 0L5.5 9.8a1 1 0 1 1 1.4-1.4L9 10.6V3Zm-5 11.5a1 1 0 0 1 1 1v.3c0 .1.1.2.2.2h9.6a.2.2 0 0 0 .2-.2v-.3a1 1 0 1 1 2 0v.3a2.2 2.2 0 0 1-2.2 2.2H5.2A2.2 2.2 0 0 1 3 15.8v-.3a1 1 0 0 1 1-1Z" />
            </svg>
          </button>
        </div>

        <MessageReactions
          :reactions="message.reactions"
          :replies="message.replies"
          :last-reply="message.lastReply"
          :reply-users="message.replyUsers"
          @open-thread="openThread"
          @toggle-reaction="(emoji) => emit('toggle-reaction', { messageId: message.id, emoji })"
        />
      </div>
    </div>

    <div class="pointer-events-none absolute right-2 top-2 opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100">
      <div class="inline-flex items-center gap-0.5 rounded-md border border-slate-200 bg-white p-1 shadow-[0_1px_6px_rgba(15,23,42,0.12)]">
        <button
          type="button"
          class="inline-flex h-6 w-6 items-center justify-center rounded text-[#94a3b8] hover:bg-slate-100 hover:text-[#475569]"
          title="Add reaction"
          @click="emit('toggle-reaction', { messageId: message.id, emoji: '👍' })"
        >
          <svg viewBox="0 0 20 20" class="h-4 w-4 fill-current">
            <path d="M10 2.8a7.2 7.2 0 1 0 0 14.4 7.2 7.2 0 0 0 0-14.4Zm0 1.9a5.3 5.3 0 0 1 4.2 8.5H5.8A5.3 5.3 0 0 1 10 4.7Zm0 10.6a5.3 5.3 0 0 1-2.6-.7h5.2a5.3 5.3 0 0 1-2.6.7Zm-2-5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm4 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
          </svg>
        </button>
        <button
          type="button"
          class="inline-flex h-6 w-6 items-center justify-center rounded text-[#94a3b8] hover:bg-slate-100 hover:text-[#475569]"
          title="Reply in thread"
          @click="openThread"
        >
          <svg viewBox="0 0 20 20" class="h-4 w-4 fill-current">
            <path d="M3.5 4.8A1.8 1.8 0 0 1 5.3 3h9.4a1.8 1.8 0 0 1 1.8 1.8v6.4a1.8 1.8 0 0 1-1.8 1.8H9.2l-3.6 3a.8.8 0 0 1-1.3-.6V13A1.8 1.8 0 0 1 2.5 11.2V4.8h1Z" />
          </svg>
        </button>
        <button
          type="button"
          class="inline-flex h-6 w-6 items-center justify-center rounded text-[#94a3b8] hover:bg-slate-100 hover:text-[#475569]"
          title="Pin message"
          @click="emit('toggle-pin', message.id)"
        >
          <svg viewBox="0 0 20 20" class="h-4 w-4 fill-current">
            <path d="M5 3h10a1 1 0 0 1 1 1v13a.8.8 0 0 1-1.3.6L10 14l-4.7 3.6A.8.8 0 0 1 4 17V4a1 1 0 0 1 1-1Z" />
          </svg>
        </button>
        <button type="button" class="inline-flex h-6 w-6 items-center justify-center rounded text-[#94a3b8] hover:bg-slate-100 hover:text-[#475569]" title="More actions">
          <svg viewBox="0 0 20 20" class="h-4 w-4 fill-current">
            <path d="M4.5 8.8a1.3 1.3 0 1 1 0 2.5 1.3 1.3 0 0 1 0-2.5Zm5.5 0a1.3 1.3 0 1 1 0 2.5 1.3 1.3 0 0 1 0-2.5Zm5.5 0a1.3 1.3 0 1 1 0 2.5 1.3 1.3 0 0 1 0-2.5Z" />
          </svg>
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import MessageAvatar from "~/components/chat/MessageAvatar.vue";
import MessageContent from "~/components/chat/MessageContent.vue";
import MessageMeta from "~/components/chat/MessageMeta.vue";
import MessageReactions from "~/components/chat/MessageReactions.vue";

const props = defineProps<{
  message: {
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
  };
}>();

const emit = defineEmits<{
  (event: "open-thread", message: (typeof props)["message"]): void;
  (event: "mention-click", mention: { userId: string | null; displayName: string; mentionKey: string }): void;
  (event: "toggle-reaction", payload: { messageId: string; emoji: string }): void;
  (event: "toggle-pin", messageId: string): void;
}>();

const openThread = () => {
  emit("open-thread", props.message);
};

const onMentionClick = (mention: {
  userId: string | null;
  displayName: string;
  mentionKey: string;
}) => {
  emit("mention-click", mention);
};
</script>
