<template>
  <div class="w-[340px] overflow-hidden rounded-[8px] border border-[#E8E8E8] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
    <div class="flex items-center justify-between border-b border-[#E8E8E8] px-4 py-3">
      <h3 class="text-[16px] font-semibold leading-6 text-[#1D1C1D]">Notifications</h3>
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="text-[14px] font-medium leading-5 text-[#1264A3] transition-colors duration-200 hover:opacity-85"
          @click="onMarkAllRead"
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

    <div v-if="errorText" class="border-b border-red-100 bg-red-50 px-4 py-2 text-xs text-red-700">
      {{ errorText }}
    </div>

    <div class="max-h-[420px] overflow-y-auto bg-white [scrollbar-width:thin]">
      <div v-if="loading" class="px-4 py-6 text-center text-sm text-slate-500">Loading notifications...</div>

      <article
        v-for="item in notifications"
        :key="item.id"
        class="relative flex cursor-pointer items-start gap-3 border-b border-[#E8E8E8] px-4 py-[11px] transition-colors duration-150 ease-in-out hover:bg-[#F4F4F5]"
        @click="openNotification(item)"
      >
        <div class="relative">
          <div class="flex h-8 w-8 items-center justify-center rounded-[8px] bg-indigo-500 text-[14px] font-semibold text-white">
            @
          </div>
          <span
            class="absolute -bottom-1 -right-1 inline-flex h-[14px] w-[14px] items-center justify-center rounded-full border-2 border-white bg-indigo-500 text-[8px] font-medium text-white"
          >
            @
          </span>
        </div>

        <div class="min-w-0 pr-5">
          <p class="text-[14px] font-normal leading-5 text-[#1D1C1D]">
            <span class="font-semibold text-[#1D1C1D]">Mention</span>
            <span> {{ item.preview }}</span>
            <span class="font-medium text-[#1264A3]"> #{{ item.channel.name }}</span>
          </p>
          <p class="mt-1 text-[12px] font-normal leading-none text-[#616061]">{{ formatTime(item.createdAt) }}</p>
        </div>

        <span
          v-if="!item.isRead"
          class="absolute right-4 top-1/2 h-[7px] w-[7px] -translate-y-1/2 rounded-full bg-[#1264A3]"
        />
      </article>

      <div v-if="!loading && notifications.length === 0" class="px-4 py-6 text-center text-sm text-slate-500">
        No notifications yet.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useNotificationApi, type NotificationItem } from "../../composables/use-notification-api";

const emit = defineEmits<{
  close: [];
}>();

const router = useRouter();
const { fetchNotifications, markAllRead, markRead } = useNotificationApi();

const notifications = ref<NotificationItem[]>([]);
const loading = ref(false);
const errorText = ref("");

const formatTime = (iso: string) => {
  const dt = new Date(iso);
  if (Number.isNaN(dt.valueOf())) {
    return "now";
  }
  return dt.toLocaleString();
};

const refreshNotifications = async () => {
  loading.value = true;
  errorText.value = "";

  try {
    notifications.value = await fetchNotifications();
  } catch {
    errorText.value = "Unable to load notifications.";
  } finally {
    loading.value = false;
  }
};

const onMarkAllRead = async () => {
  try {
    await markAllRead();
    notifications.value = notifications.value.map((item) => ({ ...item, isRead: true }));
  } catch {
    errorText.value = "Unable to mark notifications as read.";
  }
};

const openNotification = async (item: NotificationItem) => {
  try {
    if (!item.isRead) {
      await markRead([item.id]);
      notifications.value = notifications.value.map((current) =>
        current.id === item.id ? { ...current, isRead: true } : current,
      );
    }

    await router.push(`/workspace/${item.workspaceId}/channel/${item.channel.id}`);
    emit("close");
  } catch {
    errorText.value = "Unable to open notification target.";
  }
};

onMounted(async () => {
  await refreshNotifications();
});
</script>
