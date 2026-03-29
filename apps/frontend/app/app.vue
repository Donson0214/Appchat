<template>
  <div class="min-h-screen bg-white">
    <template v-if="isBooting">
      <div class="fixed inset-0 z-[999] grid place-items-center bg-white text-slate-500">
        <div class="flex items-center gap-2 text-sm">
          <span class="h-2.5 w-2.5 animate-pulse rounded-full bg-slate-400" />
          <span>Loading...</span>
        </div>
      </div>
    </template>
    <template v-else>
      <div
        v-if="presenceRuntimeError"
        class="fixed inset-x-0 top-0 z-[70] border-b border-amber-200 bg-amber-50 px-3 py-2 text-center text-xs text-amber-800"
      >
        {{ presenceRuntimeError }}
      </div>
      <NuxtPage />
    </template>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { usePresenceApi } from "./composables/use-presence-api";
import { getAuthHeadersOrNull, getValidAccessToken } from "./utils/auth-session";

const route = useRoute();
const config = useRuntimeConfig();
const { setStatus } = usePresenceApi();
const presenceRuntimeError = ref("");
const isBooting = ref(true);

const markOnlineIfAuthenticated = async () => {
  if (!getValidAccessToken()) {
    return;
  }

  try {
    await setStatus("online");
    presenceRuntimeError.value = "";
  } catch {
    presenceRuntimeError.value = "Unable to mark you online.";
  }
};

const sendOfflineOnExit = () => {
  if (!process.client) return;
  const headers = getAuthHeadersOrNull();
  const apiBase = config.public.apiBaseUrl?.toString().trim() || "https://localhost:3000";
  const normalizedApiBase = apiBase.startsWith("http://localhost:3000")
    ? apiBase.replace("http://localhost:3000", "https://localhost:3000")
    : apiBase;

  if (!headers?.Authorization) return;

  void fetch(`${normalizedApiBase}/presence/status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: headers.Authorization,
    },
    body: JSON.stringify({ status: "offline" }),
    keepalive: true,
  }).catch(() => undefined);
};

onMounted(async () => {
  window.setTimeout(() => {
    isBooting.value = false;
  }, 280);

  await markOnlineIfAuthenticated();
  window.addEventListener("beforeunload", sendOfflineOnExit);
  window.addEventListener("pagehide", sendOfflineOnExit);
});

watch(
  () => route.fullPath,
  async () => {
    await markOnlineIfAuthenticated();
  },
);

onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", sendOfflineOnExit);
  window.removeEventListener("pagehide", sendOfflineOnExit);
});
</script>
