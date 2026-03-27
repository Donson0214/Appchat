<template>
  <div class="w-[340px] overflow-hidden rounded-[8px] border border-[#E8E8E8] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
    <div class="flex items-center justify-between border-b border-[#E8E8E8] px-4 py-3">
      <h3 class="text-[16px] font-semibold leading-6 text-[#1D1C1D]">Notifications</h3>
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="text-[14px] font-medium leading-5 text-[#1264A3] transition-colors duration-200 hover:opacity-85"
          @click="markAllRead"
        >
          Mark all read
        </button>
        <button
          type="button"
          class="inline-flex h-6 w-6 items-center justify-center rounded-md text-[#8A8A8A] transition-colors duration-200 hover:bg-[#F4F4F5]"
          @click="$emit('close')"
        >
          <svg viewBox="0 0 20 20" class="h-4 w-4 fill-current">
            <path d="M6.2 6.2a1 1 0 0 1 1.4 0L10 8.6l2.4-2.4a1 1 0 0 1 1.4 1.4L11.4 10l2.4 2.4a1 1 0 0 1-1.4 1.4L10 11.4l-2.4 2.4a1 1 0 0 1-1.4-1.4L8.6 10 6.2 7.6a1 1 0 0 1 0-1.4Z" />
          </svg>
        </button>
      </div>
    </div>

    <div class="max-h-[420px] overflow-y-auto bg-white [scrollbar-width:thin]">
      <article
        v-for="item in notifications"
        :key="item.id"
        class="relative flex cursor-pointer items-start gap-3 border-b border-[#E8E8E8] px-4 py-[11px] transition-colors duration-150 ease-in-out hover:bg-[#F4F4F5]"
      >
        <div class="relative">
          <div class="flex h-8 w-8 items-center justify-center rounded-[8px] text-[14px] font-semibold text-white" :class="item.avatarColor">
            {{ item.initials }}
          </div>
          <span
            class="absolute -bottom-1 -right-1 inline-flex h-[14px] w-[14px] items-center justify-center rounded-full border-2 border-white text-[8px] font-medium text-white"
            :class="item.badgeColor"
          >
            {{ item.badge }}
          </span>
        </div>

        <div class="min-w-0 pr-5">
          <p class="text-[14px] font-normal leading-5 text-[#1D1C1D]">
            <span class="font-semibold text-[#1D1C1D]">{{ item.name }}</span>
            <template v-if="item.type === 'mention'">
              <span> {{ item.prefix }} {{ item.message }}</span>
            </template>
            <template v-else-if="item.type === 'thread'">
              <span> replied in thread: "{{ item.message }}"</span>
            </template>
            <template v-else-if="item.type === 'reaction'">
              <span> reacted <span class="mx-0.5 inline-block align-baseline text-[16px] leading-none">{{ item.emoji }}</span> to your message</span>
            </template>
            <span class="font-medium text-[#1264A3]"> {{ item.channel }}</span>
          </p>
          <p class="mt-1 text-[12px] font-normal leading-none text-[#616061]">{{ item.time }}</p>
        </div>

        <span
          v-if="item.unread"
          class="absolute right-4 top-1/2 h-[7px] w-[7px] -translate-y-1/2 rounded-full bg-[#1264A3]"
        />
      </article>
    </div>

    <div class="flex items-center justify-center border-t border-[#E8E8E8] bg-white px-4 py-3">
      <button
        type="button"
        class="text-[14px] font-medium text-[#1264A3] transition-colors duration-200 hover:opacity-85"
      >
        View all notifications
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
type NotificationType = "mention" | "thread" | "reaction";

const notifications = ref<
  Array<{
    id: string;
    initials: string;
    avatarColor: string;
    badge: string;
    badgeColor: string;
    name: string;
    type: NotificationType;
    prefix?: string;
    message: string;
    emoji?: string;
    channel: string;
    time: string;
    unread: boolean;
  }>
>([
  {
    id: "1",
    initials: "SC",
    avatarColor: "bg-pink-500",
    badge: "@",
    badgeColor: "bg-indigo-500",
    name: "Sarah Chen",
    type: "mention",
    prefix: "@alex",
    message: "can you review the PR?",
    channel: "#general",
    time: "5m ago",
    unread: true,
  },
  {
    id: "2",
    initials: "JK",
    avatarColor: "bg-amber-500",
    badge: "💬",
    badgeColor: "bg-blue-500",
    name: "Jordan Kim",
    type: "thread",
    message: "Looks good to merge",
    channel: "#engineering",
    time: "12m ago",
    unread: true,
  },
  {
    id: "3",
    initials: "MW",
    avatarColor: "bg-emerald-500",
    badge: "😊",
    badgeColor: "bg-orange-400",
    name: "Marcus Webb",
    type: "reaction",
    message: "",
    emoji: "\uD83C\uDF89",
    channel: "#design",
    time: "1h ago",
    unread: true,
  },
  {
    id: "4",
    initials: "PP",
    avatarColor: "bg-violet-500",
    badge: "@",
    badgeColor: "bg-indigo-500",
    name: "Priya Patel",
    type: "mention",
    prefix: "@channel",
    message: "Q2 roadmap is ready for review",
    channel: "#general",
    time: "2h ago",
    unread: false,
  },
]);

const markAllRead = () => {
  notifications.value = notifications.value.map((item) => ({ ...item, unread: false }));
};

defineEmits<{
  close: [];
}>();
</script>
