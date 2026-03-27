<template>
  <div class="min-h-screen bg-[#f8fafc] text-[#0f172a]">
    <header class="flex h-[46px] items-center border-b border-slate-200 bg-white">
      <button
        type="button"
        class="inline-flex h-full items-center gap-2 border-r border-slate-200 px-4 text-[13px] font-medium text-slate-500 transition-colors duration-150 hover:bg-slate-50"
        @click="goBackToApp"
      >
        <svg viewBox="0 0 20 20" class="h-4 w-4 fill-current">
          <path d="M11.8 4.4a1 1 0 0 1 0 1.4L7.6 10l4.2 4.2a1 1 0 0 1-1.4 1.4L5.5 10.7a1 1 0 0 1 0-1.4l4.9-4.9a1 1 0 0 1 1.4 0Z"/>
        </svg>
        <span>Back to AppChat</span>
      </button>
      <div class="px-4 text-[14px] font-semibold text-[#111827]">Settings</div>
    </header>

    <div class="mx-auto flex max-w-[1240px] gap-8 px-8 py-8">
      <aside class="w-[260px] pt-1">
        <nav class="space-y-1">
          <button
            v-for="item in tabs"
            :key="item.key"
            type="button"
            class="flex h-10 w-full items-center gap-3 rounded-md px-3 text-left text-[14px] font-medium leading-none transition-colors duration-150"
            :class="activeTab === item.key ? 'bg-indigo-100 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'"
            @click="activeTab = item.key"
          >
            <span class="inline-flex h-4 w-4 items-center justify-center" v-html="item.icon" />
            <span class="truncate">{{ item.label }}</span>
          </button>
        </nav>
      </aside>

      <section class="min-h-[660px] flex-1 rounded-lg border border-slate-200 bg-white p-6">
        <div v-if="activeTab === 'profile'">
          <h2 class="text-[34px] font-semibold leading-none text-[#111827]">Profile</h2>
          <p class="mt-2 text-[14px] leading-6 text-slate-500">Update your personal information and preferences.</p>

          <div class="mt-5 flex items-center gap-3">
            <div class="flex h-14 w-14 items-center justify-center rounded-md bg-indigo-500 text-[16px] font-semibold text-white">AM</div>
            <div>
              <button class="h-8 rounded-md border border-slate-300 px-4 text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-50">Change photo</button>
              <p class="mt-1 text-[12px] text-slate-400">JPG, PNG or GIF. Max 5MB.</p>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-x-4 gap-y-3">
            <label class="block text-[13px] font-medium text-slate-800">Full name
              <input v-model="profile.fullName" class="mt-1 h-8 w-full rounded-md border border-slate-300 px-3 text-[13px] text-slate-800 outline-none focus:border-indigo-400" />
            </label>
            <label class="block text-[13px] font-medium text-slate-800">Job title
              <input v-model="profile.jobTitle" class="mt-1 h-8 w-full rounded-md border border-slate-300 px-3 text-[13px] text-slate-800 outline-none focus:border-indigo-400" />
            </label>
            <label class="block text-[13px] font-medium text-slate-800">Email
              <input v-model="profile.email" class="mt-1 h-8 w-full rounded-md border border-slate-300 px-3 text-[13px] text-slate-500 outline-none focus:border-indigo-400" />
            </label>
            <label class="block text-[13px] font-medium text-slate-800">Status
              <input v-model="profile.status" placeholder="What's your status?" class="mt-1 h-8 w-full rounded-md border border-slate-300 px-3 text-[13px] text-slate-600 outline-none placeholder:text-slate-400 focus:border-indigo-400" />
            </label>
          </div>

          <button class="mt-7 h-8 rounded-md bg-indigo-500 px-5 text-[13px] font-semibold text-white transition-colors hover:bg-indigo-600">Save changes</button>
        </div>

        <div v-else-if="activeTab === 'notifications'">
          <h2 class="text-[34px] font-semibold leading-none text-[#111827]">Notifications</h2>
          <p class="mt-2 text-[14px] leading-6 text-slate-500">Control when and how you receive notifications.</p>

          <p class="mt-6 text-[12px] font-bold tracking-[0.06em] text-slate-500">IN-APP NOTIFICATIONS</p>
          <div class="mt-2 overflow-hidden rounded-md border border-slate-200">
            <div v-for="row in inAppNotificationRows" :key="row.key" class="flex items-center justify-between border-b border-slate-200 px-4 py-3 last:border-b-0">
              <div>
                <p class="text-[14px] font-medium leading-5 text-slate-800">{{ row.title }}</p>
                <p class="mt-0.5 text-[12px] leading-4 text-slate-400">{{ row.description }}</p>
              </div>
              <button type="button" class="relative h-6 w-10 rounded-full transition-colors" :class="notificationToggles[row.key] ? 'bg-indigo-500' : 'bg-slate-200'" @click="notificationToggles[row.key] = !notificationToggles[row.key]">
                <span class="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white transition-all" :class="notificationToggles[row.key] ? 'left-[22px]' : 'left-[2px]'" />
              </button>
            </div>
          </div>

          <p class="mt-6 text-[12px] font-bold tracking-[0.06em] text-slate-500">OTHER</p>
          <div class="mt-2 overflow-hidden rounded-md border border-slate-200">
            <div v-for="row in otherNotificationRows" :key="row.key" class="flex items-center justify-between border-b border-slate-200 px-4 py-3 last:border-b-0">
              <div>
                <p class="text-[14px] font-medium leading-5 text-slate-800">{{ row.title }}</p>
                <p class="mt-0.5 text-[12px] leading-4 text-slate-400">{{ row.description }}</p>
              </div>
              <button type="button" class="relative h-6 w-10 rounded-full transition-colors" :class="notificationToggles[row.key] ? 'bg-indigo-500' : 'bg-slate-200'" @click="notificationToggles[row.key] = !notificationToggles[row.key]">
                <span class="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white transition-all" :class="notificationToggles[row.key] ? 'left-[22px]' : 'left-[2px]'" />
              </button>
            </div>
          </div>
        </div>

        <div v-else-if="activeTab === 'appearance'">
          <h2 class="text-[34px] font-semibold leading-none text-[#111827]">Appearance</h2>
          <p class="mt-2 text-[14px] leading-6 text-slate-500">Customize how AppChat looks and feels.</p>

          <p class="mt-6 text-[12px] font-bold tracking-[0.06em] text-slate-500">THEME</p>
          <div class="mt-2 grid grid-cols-2 gap-2">
            <button type="button" class="rounded-md border p-2 text-center" :class="appearance.theme === 'light' ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300'" @click="appearance.theme = 'light'">
              <div class="h-10 rounded-sm border border-slate-200 bg-white" />
              <p class="mt-2 text-[13px] font-medium" :class="appearance.theme === 'light' ? 'text-indigo-600' : 'text-slate-600'">Light</p>
            </button>
            <button type="button" class="rounded-md border p-2 text-center" :class="appearance.theme === 'dark' ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300'" @click="appearance.theme = 'dark'">
              <div class="h-10 rounded-sm bg-[#0f172a]" />
              <p class="mt-2 text-[13px] font-medium" :class="appearance.theme === 'dark' ? 'text-indigo-600' : 'text-slate-600'">Dark</p>
            </button>
          </div>

          <p class="mt-6 text-[12px] font-bold tracking-[0.06em] text-slate-500">MESSAGE DENSITY</p>
          <div class="mt-2 grid grid-cols-2 gap-2">
            <button type="button" class="h-8 rounded-md border text-[13px] font-medium" :class="appearance.density === 'comfortable' ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-slate-300 text-slate-600'" @click="appearance.density = 'comfortable'">Comfortable</button>
            <button type="button" class="h-8 rounded-md border text-[13px] font-medium" :class="appearance.density === 'compact' ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-slate-300 text-slate-600'" @click="appearance.density = 'compact'">Compact</button>
          </div>

          <p class="mt-6 text-[12px] font-bold tracking-[0.06em] text-slate-500">FONT SIZE</p>
          <div class="mt-2 grid grid-cols-3 gap-2">
            <button type="button" class="h-8 rounded-md border text-[13px] font-medium" :class="appearance.fontSize === 'small' ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-slate-300 text-slate-600'" @click="appearance.fontSize = 'small'">Small</button>
            <button type="button" class="h-8 rounded-md border text-[13px] font-medium" :class="appearance.fontSize === 'default' ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-slate-300 text-slate-600'" @click="appearance.fontSize = 'default'">Default</button>
            <button type="button" class="h-8 rounded-md border text-[13px] font-medium" :class="appearance.fontSize === 'large' ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-slate-300 text-slate-600'" @click="appearance.fontSize = 'large'">Large</button>
          </div>
        </div>

        <div v-else-if="activeTab === 'privacy'">
          <h2 class="text-[34px] font-semibold leading-none text-[#111827]">Privacy & Security</h2>
          <p class="mt-2 text-[14px] leading-6 text-slate-500">Manage your privacy settings and security options.</p>

          <div class="mt-6 overflow-hidden rounded-md border border-slate-200">
            <div v-for="row in privacyRows" :key="row.key" class="flex items-center justify-between border-b border-slate-200 px-4 py-3 last:border-b-0">
              <div>
                <p class="text-[14px] font-medium leading-5 text-slate-800">{{ row.title }}</p>
                <p class="mt-0.5 text-[12px] leading-4 text-slate-400">{{ row.description }}</p>
              </div>
              <button type="button" class="relative h-6 w-10 rounded-full transition-colors" :class="privacyToggles[row.key] ? 'bg-indigo-500' : 'bg-slate-200'" @click="privacyToggles[row.key] = !privacyToggles[row.key]">
                <span class="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white transition-all" :class="privacyToggles[row.key] ? 'left-[22px]' : 'left-[2px]'" />
              </button>
            </div>
          </div>
        </div>

        <div v-else>
          <h2 class="text-[34px] font-semibold leading-none text-[#111827]">Language & Region</h2>
          <p class="mt-2 text-[14px] leading-6 text-slate-500">Set your preferred language and timezone.</p>

          <div class="mt-6 space-y-4">
            <label class="block text-[13px] font-medium text-slate-800">Language
              <select v-model="languageRegion.language" class="mt-1 h-8 w-full rounded-md border border-slate-300 px-3 text-[13px] text-slate-800 outline-none focus:border-indigo-400">
                <option>English (US)</option>
                <option>English (UK)</option>
                <option>Filipino</option>
              </select>
            </label>
            <label class="block text-[13px] font-medium text-slate-800">Timezone
              <select v-model="languageRegion.timezone" class="mt-1 h-8 w-full rounded-md border border-slate-300 px-3 text-[13px] text-slate-800 outline-none focus:border-indigo-400">
                <option>Eastern Time (UTC-5)</option>
                <option>Singapore Time (UTC+8)</option>
                <option>Pacific Time (UTC-8)</option>
              </select>
            </label>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
type TabKey = "profile" | "notifications" | "appearance" | "privacy" | "language";

type ToggleKey =
  | "mentions"
  | "directMessages"
  | "channelActivity"
  | "reactions"
  | "emailDigest"
  | "soundAlerts"
  | "desktopNotifications";

type PrivacyToggleKey = "readReceipts" | "onlineStatus" | "twoFactorAuthentication";

const tabs: Array<{ key: TabKey; label: string; icon: string }> = [
  {
    key: "profile",
    label: "Profile",
    icon: '<svg viewBox="0 0 20 20" class="h-4 w-4 fill-current"><path d="M10 2.5a3.4 3.4 0 1 1 0 6.8 3.4 3.4 0 0 1 0-6.8ZM4 16c0-3 2.7-5.2 6-5.2s6 2.2 6 5.2v.5H4V16Z"/></svg>',
  },
  {
    key: "notifications",
    label: "Notifications",
    icon: '<svg viewBox="0 0 20 20" class="h-4 w-4 fill-current"><path d="M10 2.5a5 5 0 0 0-5 5V9c0 .8-.3 1.5-.9 2.1l-.2.2A1.3 1.3 0 0 0 4.8 14h10.4a1.3 1.3 0 0 0 .9-2.2l-.2-.2A3 3 0 0 1 15 9V7.5a5 5 0 0 0-5-5Zm0 15a2.3 2.3 0 0 0 2.2-1.8H7.8A2.3 2.3 0 0 0 10 17.5Z"/></svg>',
  },
  {
    key: "appearance",
    label: "Appearance",
    icon: '<svg viewBox="0 0 20 20" class="h-4 w-4 fill-current"><path d="m15.2 2.8 2 2a1 1 0 0 1 0 1.4l-8.9 8.9-3.6.9.9-3.6 8.9-8.9a1 1 0 0 1 1.4 0ZM4 17h12a1 1 0 1 1 0 2H4a1 1 0 1 1 0-2Z"/></svg>',
  },
  {
    key: "privacy",
    label: "Privacy & Security",
    icon: '<svg viewBox="0 0 20 20" class="h-4 w-4 fill-current"><path d="M10 2.2 4 4.6v4.8c0 4 2.5 7 6 8.4 3.5-1.4 6-4.4 6-8.4V4.6L10 2.2Zm0 5a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6Z"/></svg>',
  },
  {
    key: "language",
    label: "Language & Region",
    icon: '<svg viewBox="0 0 20 20" class="h-4 w-4 fill-current"><path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm5.8 7H13c-.1-1.7-.5-3.3-1.2-4.5A6.1 6.1 0 0 1 15.8 9ZM10 3.8c.7 1.2 1.2 3 1.3 5.2H8.7c.1-2.2.6-4 1.3-5.2ZM4.2 11H7c.1 1.7.5 3.3 1.2 4.5A6.1 6.1 0 0 1 4.2 11Zm0-2A6.1 6.1 0 0 1 8.2 4.5C7.5 5.7 7.1 7.3 7 9H4.2Zm5.8 7.2c-.7-1.2-1.2-3-1.3-5.2h2.6c-.1 2.2-.6 4-1.3 5.2Zm1.8-.7c.7-1.2 1.1-2.8 1.2-4.5h2.8a6.1 6.1 0 0 1-4 4.5Z"/></svg>',
  },
];

const activeTab = ref<TabKey>("profile");

const profile = reactive({
  fullName: "Alex Morgan",
  jobTitle: "Product Designer",
  email: "alex.morgan@acme.io",
  status: "",
});

const notificationToggles = reactive<Record<ToggleKey, boolean>>({
  mentions: true,
  directMessages: true,
  channelActivity: false,
  reactions: true,
  emailDigest: false,
  soundAlerts: true,
  desktopNotifications: true,
});

const privacyToggles = reactive<Record<PrivacyToggleKey, boolean>>({
  readReceipts: true,
  onlineStatus: true,
  twoFactorAuthentication: false,
});

const appearance = reactive({
  theme: "light",
  density: "comfortable",
  fontSize: "default",
});

const languageRegion = reactive({
  language: "English (US)",
  timezone: "Eastern Time (UTC-5)",
});

const inAppNotificationRows: Array<{ key: ToggleKey; title: string; description: string }> = [
  {
    key: "mentions",
    title: "Mentions & keywords",
    description: "When someone @mentions you or uses a keyword",
  },
  {
    key: "directMessages",
    title: "Direct messages",
    description: "All new DMs and DM replies",
  },
  {
    key: "channelActivity",
    title: "Channel activity",
    description: "All new messages in channels you follow",
  },
  {
    key: "reactions",
    title: "Reactions",
    description: "When someone reacts to your messages",
  },
];

const otherNotificationRows: Array<{ key: ToggleKey; title: string; description: string }> = [
  {
    key: "emailDigest",
    title: "Email digest",
    description: "Daily summary of missed activity",
  },
  {
    key: "soundAlerts",
    title: "Sound alerts",
    description: "Play a sound for new notifications",
  },
  {
    key: "desktopNotifications",
    title: "Desktop notifications",
    description: "Show desktop notifications when active",
  },
];

const privacyRows: Array<{ key: PrivacyToggleKey; title: string; description: string }> = [
  {
    key: "readReceipts",
    title: "Read receipts",
    description: "Let others see when you've read their messages",
  },
  {
    key: "onlineStatus",
    title: "Show online status",
    description: "Show when you're active to other members",
  },
  {
    key: "twoFactorAuthentication",
    title: "Two-factor authentication",
    description: "Add an extra layer of security to your account",
  },
];

const goBackToApp = async () => {
  const raw = process.client ? localStorage.getItem("appchat_workspace") : null;
  if (raw) {
    try {
      const ws = JSON.parse(raw) as { slug?: string };
      if (ws.slug) {
        await navigateTo(`/workspace/${ws.slug}/channel/general`);
        return;
      }
    } catch {
      // ignore
    }
  }

  await navigateTo("/");
};
</script>
