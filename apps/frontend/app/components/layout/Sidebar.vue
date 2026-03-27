<template>
  <aside class="flex h-full w-[72px] flex-col items-center justify-between border-r border-[#202940] bg-[#111a34] py-8">
    <div class="flex w-full flex-col items-center gap-3">
      <button
        v-for="(item, index) in workspaces"
        :key="item.id"
        class="relative flex h-11 w-11 items-center justify-center rounded-[10px] text-[20px] font-semibold text-white transition hover:brightness-110"
        :class="item.bg"
      >
        {{ item.label }}
        <span v-if="index === 0" class="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-indigo-500" />
      </button>

      <button
        class="mt-2 flex h-11 w-11 items-center justify-center rounded-[10px] border border-dashed border-[#314063] text-[24px] leading-none text-[#8f98b1] transition hover:bg-[#1c2748]"
      >
        +
      </button>
    </div>

    <div class="relative">
      <button
        ref="avatarButtonRef"
        class="relative flex h-10 w-10 items-center justify-center rounded-[10px] bg-indigo-500 text-[16px] font-semibold text-white"
        @click="toggleProfileMenu"
      >
        {{ userInitial }}
        <span class="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-[#111a34] bg-emerald-400" />
      </button>

      <div
        v-if="isProfileMenuOpen"
        ref="menuRef"
        class="absolute bottom-0 left-[56px] z-50 w-[280px] overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-[0_10px_24px_rgba(15,23,42,0.18)]"
      >
        <div class="border-b border-[#e5e7eb] px-4 py-3">
          <p class="text-[14px] font-semibold text-[#1d1c1d]">{{ userFullName }}</p>
          <p class="mt-1 text-[12px] text-[#6b7280]">{{ userEmail }}</p>
        </div>

        <button
          class="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[13px] text-[#374151] transition hover:bg-[#f8f8fa]"
          type="button"
          @click="isProfileMenuOpen = false"
        >
          <svg viewBox="0 0 20 20" class="h-4 w-4 fill-amber-400">
            <path d="M10 2.5a.8.8 0 0 1 .7 1.2 5.8 5.8 0 1 0 5.6 8.5.8.8 0 0 1 1.4.7A7.4 7.4 0 1 1 10 2.5Z" />
          </svg>
          <span>Set yourself as away</span>
        </button>

        <button
          class="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[13px] text-[#374151] transition hover:bg-[#f8f8fa]"
          type="button"
          @click="isProfileMenuOpen = false"
        >
          <svg viewBox="0 0 20 20" class="h-4 w-4 fill-violet-200">
            <path d="M4.2 6.8C5.9 5 8 4.1 10.3 4.1c2.4 0 4.5.9 6.2 2.7a4.3 4.3 0 0 1 0 6.1c-1.7 1.7-3.8 2.6-6.2 2.6-2.3 0-4.4-.9-6.1-2.6a4.3 4.3 0 0 1 0-6.1Z" />
          </svg>
          <span>Set a status</span>
        </button>

        <div class="border-t border-[#e5e7eb] px-4 py-2.5">
          <button
            class="text-[13px] font-medium text-red-500 transition hover:text-red-600"
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
const { workspaceInitial, loadWorkspace } = useWorkspace();

const userInitial = ref("A");
const userFullName = ref("Alex Morgan");
const userEmail = ref("alex.morgan@acme.io");
const isProfileMenuOpen = ref(false);
const menuRef = ref<HTMLElement | null>(null);
const avatarButtonRef = ref<HTMLElement | null>(null);

const workspaces = computed(() => [
  { id: "a", label: workspaceInitial.value, bg: "bg-indigo-500" },
  { id: "s", label: "S", bg: "bg-emerald-500" },
  { id: "o", label: "O", bg: "bg-amber-600" },
]);

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
  localStorage.removeItem("appchat_access_token");
  localStorage.removeItem("appchat_user");
  localStorage.removeItem("appchat_workspace");
  await navigateTo("/sign-in");
};
</script>
