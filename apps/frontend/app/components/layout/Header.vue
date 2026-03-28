<template>
  <header class="relative flex h-[92px] items-center justify-between border-b border-slate-300 px-6">
    <div>
      <div class="flex items-center gap-3">
        <template v-if="channel.isDirectMessage">
          <h1 class="text-[38px] font-semibold leading-none tracking-[-0.015em] text-[#1D1C1D]">{{ channel.name }}</h1>
          <span
            class="inline-flex h-6 items-center rounded-md bg-emerald-500 px-2.5 text-[14px] font-semibold leading-none text-white"
          >
            {{ channel.presenceLabel || "online" }}
          </span>
        </template>
        <template v-else>
          <h1 class="text-[28px] font-semibold leading-none tracking-[-0.015em] text-[#1D1C1D]">#{{ channel.name }}</h1>
          <span class="pt-0.5 text-[16px] font-normal text-[#8f95a3]">{{ channel.members }} members</span>
        </template>
      </div>
      <p class="mt-1 text-[16px] font-normal leading-6 text-[#8f95a3]">{{ channel.description }}</p>
    </div>

    <div class="flex items-center gap-4 text-[#64748b]">
      <button
        v-if="!channel.isDirectMessage"
        class="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[#64748b] transition-colors duration-150 hover:bg-slate-100 hover:text-[#334155]"
      >
        <svg viewBox="0 0 20 20" class="h-[15px] w-[15px] fill-current">
          <path d="M9.1 2.7c.3-.9 1.5-.9 1.8 0l1.4 3.3 3.6.3c1 .1 1.4 1.3.6 2l-2.8 2.3.9 3.5c.2 1-.8 1.7-1.7 1.2L10 13.4 6.9 15.3c-.8.5-1.9-.2-1.6-1.2l.9-3.5-2.8-2.3c-.8-.7-.4-1.9.6-2L7.6 6l1.5-3.3Z" />
        </svg>
        <span class="text-[14px] font-medium leading-none">{{ channel.starCount }}</span>
      </button>

      <button
        type="button"
        class="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-150 hover:bg-slate-100"
        @click="openSearch"
      >
        <svg viewBox="0 0 20 20" class="h-5 w-5 fill-current">
          <path d="M8.6 3a5.6 5.6 0 1 1-3.9 9.6L2.6 15a1 1 0 1 0 1.4 1.4l2.1-2.1A5.6 5.6 0 0 1 8.6 3Zm0 1.8a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Z" />
        </svg>
      </button>

      <button
        type="button"
        ref="notificationButtonRef"
        class="relative inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-150 hover:bg-slate-100"
        @click="toggleNotifications"
      >
        <svg viewBox="0 0 20 20" class="h-5 w-5 fill-current">
          <path d="M10 2.5a5 5 0 0 0-5 5V9c0 .8-.3 1.5-.9 2.1l-.2.2A1.3 1.3 0 0 0 4.8 14h10.4a1.3 1.3 0 0 0 .9-2.2l-.2-.2A3 3 0 0 1 15 9V7.5a5 5 0 0 0-5-5Zm0 15a2.3 2.3 0 0 0 2.2-1.8H7.8A2.3 2.3 0 0 0 10 17.5Z" />
        </svg>
        <span class="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-indigo-500" />
      </button>

      <button class="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-150 hover:bg-slate-100">
        <svg viewBox="0 0 20 20" class="h-5 w-5 fill-current">
          <path d="M3 7.2a2.2 2.2 0 0 1 2.2-2.2h6.6A2.2 2.2 0 0 1 14 7.2v5.6a2.2 2.2 0 0 1-2.2 2.2H5.2A2.2 2.2 0 0 1 3 12.8V7.2Zm12.3.4 2.8-1.5A1.3 1.3 0 0 1 20 7.2v5.6a1.3 1.3 0 0 1-1.9 1.1l-2.8-1.5V7.6Z" />
        </svg>
      </button>
    </div>

    <div
      v-if="isNotificationOpen"
      ref="notificationRef"
      class="absolute right-4 top-[84px] z-30"
    >
      <NotificationPanel @close="isNotificationOpen = false" />
    </div>

    <div
      v-if="isSearchOpen"
      class="fixed inset-0 z-40 flex items-start justify-center bg-black/40 pt-[72px] backdrop-blur-[3px]"
      @click.self="isSearchOpen = false"
    >
      <div class="w-[534px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.2)]">
        <div class="flex h-[46px] items-center border-b border-slate-200 px-4">
          <svg viewBox="0 0 20 20" class="h-4 w-4 fill-[#94a3b8]">
            <path d="M8.6 3a5.6 5.6 0 1 1-3.9 9.6L2.6 15a1 1 0 1 0 1.4 1.4l2.1-2.1A5.6 5.6 0 0 1 8.6 3Zm0 1.8a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Z" />
          </svg>
          <input
            type="text"
            class="ml-3 flex-1 border-none bg-transparent text-[14px] font-normal text-slate-700 outline-none placeholder:text-slate-400"
            placeholder="Search messages, channels, people..."
            autofocus
          />
          <span class="inline-flex h-5 items-center rounded-md border border-slate-200 px-2 text-[11px] font-medium text-slate-400">ESC</span>
        </div>

        <div class="flex h-[40px] items-center gap-1 border-b border-slate-200 px-3">
          <button
            v-for="tab in searchTabs"
            :key="tab"
            type="button"
            class="rounded-md px-3 py-1 text-[13px] font-medium transition-colors"
            :class="activeSearchTab === tab ? 'bg-indigo-100 text-indigo-600' : 'text-slate-500 hover:bg-slate-100'"
            @click="activeSearchTab = tab"
          >
            {{ tab }}
          </button>
        </div>

        <div class="flex flex-col items-center justify-center px-4 py-8">
          <p class="text-center text-[16px] font-medium leading-6 text-slate-500">Search across all channels, messages, and people</p>
          <div class="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span
              v-for="tag in searchTags"
              :key="tag"
              class="inline-flex h-7 items-center rounded-md border border-slate-200 bg-slate-50 px-3 text-[13px] font-medium text-slate-600"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import NotificationPanel from "./NotificationPanel.vue";

defineProps<{
  channel: {
    name: string;
    description: string;
    members?: number;
    starCount?: number;
    isDirectMessage?: boolean;
    presenceLabel?: string;
  };
}>();

const searchTabs = ["All", "Messages", "Channels", "People", "Files"];
const searchTags = ["design system", "API migration", "deployment", "standup"];

const activeSearchTab = ref("All");
const isSearchOpen = ref(false);
const isNotificationOpen = ref(false);
const notificationRef = ref<HTMLElement | null>(null);
const notificationButtonRef = ref<HTMLElement | null>(null);

const toggleNotifications = () => {
  isNotificationOpen.value = !isNotificationOpen.value;
};

const openSearch = () => {
  activeSearchTab.value = "All";
  isSearchOpen.value = true;
};

const handleClickOutside = (event: MouseEvent) => {
  if (!isNotificationOpen.value) {
    return;
  }

  const target = event.target as Node | null;
  if (!target) {
    return;
  }

  const panel = notificationRef.value;
  const trigger = notificationButtonRef.value;
  if (panel && !panel.contains(target) && trigger && !trigger.contains(target)) {
    isNotificationOpen.value = false;
  }
};

const handleEsc = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    isSearchOpen.value = false;
    isNotificationOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
  window.addEventListener("keydown", handleEsc);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleClickOutside);
  window.removeEventListener("keydown", handleEsc);
});
</script>
