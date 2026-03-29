<template>
  <aside class="flex h-full w-[84px] flex-col items-center justify-between border-r border-rose-950/60 bg-gradient-to-b from-[#ff5a7a] via-[#b12656] to-[#3f0d2e] py-4">
    <div class="flex w-full flex-col items-center gap-2.5">
      <button
        v-for="(item, index) in workspaces"
        :key="item.id"
        class="relative flex h-[58px] w-[58px] items-center justify-center rounded-[14px] text-[35px] font-semibold text-white transition-all duration-200 ease-in-out hover:brightness-110"
        :class="item.bg"
        type="button"
        @click="selectWorkspace(item.id)"
      >
        {{ item.label }}
        <span v-if="item.id === workspace.id" class="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-indigo-500" />
      </button>

    </div>

    <div class="relative mb-1">
      <button
        ref="avatarButtonRef"
        class="relative flex h-[54px] w-[54px] items-center justify-center rounded-[14px] bg-indigo-500 text-[29px] font-semibold text-white"
        @click="toggleProfileMenu"
      >
        {{ userInitial }}
        <span class="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[#5b1538] bg-emerald-400" />
      </button>

      <div
        v-if="isProfileMenuOpen"
        ref="menuRef"
        class="absolute bottom-0 left-[68px] z-50 w-[336px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_14px_28px_rgba(15,23,42,0.2)]"
      >
        <div class="border-b border-slate-200 px-5 py-4">
          <p class="text-[17px] font-semibold leading-none text-slate-800">{{ userFullName }}</p>
          <p class="mt-2 text-[13px] leading-none text-slate-500">{{ userEmail }}</p>
        </div>

        <button
          class="flex w-full items-center gap-3 px-5 py-3 text-left text-[17px] font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-100"
          type="button"
          @click="isProfileMenuOpen = false"
        >
          <svg viewBox="0 0 20 20" class="h-5 w-5 fill-amber-400">
            <path d="M10 2.5a.8.8 0 0 1 .7 1.2 5.8 5.8 0 1 0 5.6 8.5.8.8 0 0 1 1.4.7A7.4 7.4 0 1 1 10 2.5Z" />
          </svg>
          <span>Set yourself as away</span>
        </button>

        <button
          class="flex w-full items-center gap-3 px-5 py-3 text-left text-[17px] font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-100"
          type="button"
          @click="isProfileMenuOpen = false"
        >
          <svg viewBox="0 0 20 20" class="h-5 w-5 fill-violet-200">
            <path d="M4.2 6.8C5.9 5 8 4.1 10.3 4.1c2.4 0 4.5.9 6.2 2.7a4.3 4.3 0 0 1 0 6.1c-1.7 1.7-3.8 2.6-6.2 2.6-2.3 0-4.4-.9-6.1-2.6a4.3 4.3 0 0 1 0-6.1Z" />
          </svg>
          <span>Set a status</span>
        </button>

        <div class="border-t border-slate-200 px-5 py-3">
          <button
            class="text-[17px] font-medium text-red-500 transition-colors duration-200 hover:text-red-600"
            type="button"
            @click="handleSignOut"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
const { workspace, workspaceInitial, workspaces: workspaceList, loadWorkspace, saveWorkspace } = useWorkspace();
const { fetchChannels } = useChannelApi();
const { setStatus } = usePresenceApi();
const router = useRouter();

const userInitial = ref("A");
const userFullName = ref("Alex Morgan");
const userEmail = ref("alex.morgan@acme.io");
const isProfileMenuOpen = ref(false);
const menuRef = ref<HTMLElement | null>(null);
const avatarButtonRef = ref<HTMLElement | null>(null);

const badgeColors = ["bg-indigo-500", "bg-emerald-500", "bg-amber-600", "bg-cyan-600", "bg-pink-600"];

const workspaces = computed(() => {
  if (!workspaceList.value.length) {
    return [{ id: workspace.value.id, label: workspaceInitial.value, bg: badgeColors[0] }];
  }

  return workspaceList.value.map((item, index) => ({
    id: item.id,
    label: (item.name?.[0] || "W").toUpperCase(),
    bg: badgeColors[index % badgeColors.length],
  }));
});

onMounted(() => {
  loadWorkspace();
  const rawUser = localStorage.getItem("appchat_user");
  if (rawUser) {
    try {
      const user = JSON.parse(rawUser) as { fullName?: string; email?: string };
      const source = user.fullName || user.email || "A";
      userInitial.value = source.charAt(0).toUpperCase();
      userFullName.value = user.fullName || userEmail.value.split("@")[0] || "Alex Morgan";
      userEmail.value = user.email || userEmail.value;
    } catch {
      userInitial.value = "A";
    }
  }

  document.addEventListener("mousedown", onClickOutside);
  document.addEventListener("keydown", onEscClose);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", onClickOutside);
  document.removeEventListener("keydown", onEscClose);
});

const toggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value;
};

const onClickOutside = (event: MouseEvent) => {
  const target = event.target as Node;
  if (
    isProfileMenuOpen.value &&
    menuRef.value &&
    avatarButtonRef.value &&
    !menuRef.value.contains(target) &&
    !avatarButtonRef.value.contains(target)
  ) {
    isProfileMenuOpen.value = false;
  }
};

const onEscClose = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    isProfileMenuOpen.value = false;
  }
};

const handleSignOut = async () => {
  try {
    await setStatus("offline");
  } catch {
    // best-effort only
  }
  localStorage.removeItem("appchat_access_token");
  localStorage.removeItem("appchat_user");
  localStorage.removeItem("appchat_workspace");
  await navigateTo("/sign-in");
};

const selectWorkspace = async (workspaceId: string) => {
  const selected = workspaceList.value.find((item) => item.id === workspaceId);
  if (!selected) {
    return;
  }

  saveWorkspace(selected);

  try {
    const channels = await fetchChannels(selected.id);
    const defaultChannel = channels.find((channel) => channel.name === "general") ?? channels[0];
    if (defaultChannel) {
      await router.push(`/workspace/${selected.id}/channel/${defaultChannel.id}`);
      return;
    }
  } catch {
    // ignore and use fallback route
  }

  await router.push(`/workspace/${selected.id}/channel/general`);
};

</script>
