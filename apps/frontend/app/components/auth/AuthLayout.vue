<template>
  <div class="relative min-h-screen bg-[#f3f4f6] px-6 pt-[108px]">
    <button
      class="fixed right-5 top-5 inline-flex h-7 w-7 items-center justify-center text-slate-500"
      type="button"
      aria-label="Toggle theme"
    >
      <svg class="h-[18px] w-[18px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a.75.75 0 0 1 .77 1.1A7.5 7.5 0 0 0 19.9 12a.75.75 0 0 1 1.1.8z" />
      </svg>
    </button>

    <div class="mx-auto flex w-full max-w-[386px] flex-col items-center">
      <div class="mb-6 text-center">
        <div
          class="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-[9px] bg-gradient-to-b from-indigo-500 to-indigo-600 shadow-[0_4px_10px_rgba(99,102,241,0.20)]"
          aria-hidden="true"
        >
          <svg class="h-5 w-5 fill-white" viewBox="0 0 24 24">
            <path d="M6 6.75A2.75 2.75 0 0 1 8.75 4h6.5A2.75 2.75 0 0 1 18 6.75v4.5A2.75 2.75 0 0 1 15.25 14H12.4a.7.7 0 0 0-.5.2l-1.95 1.9a.9.9 0 0 1-1.53-.65V14H8.75A2.75 2.75 0 0 1 6 11.25z" />
            <path d="M9 9h6v1.5H9zm0 2.5h4v1.5H9z" fill="#eef2ff" />
          </svg>
        </div>
        <h1 class="m-0 text-[50px] font-bold leading-[1.1] tracking-[-0.02em] text-slate-950">AppChat</h1>
        <p class="mt-2 text-[18px] font-normal leading-[1.25] text-slate-600">{{ subtitle }}</p>
      </div>

      <div
        class="flex w-full flex-col gap-2.5 rounded-[10px] border border-slate-300 bg-[#f3f4f6] p-6 shadow-[0_1px_2px_rgba(15,23,42,0.07),0_6px_20px_rgba(15,23,42,0.04)]"
      >
        <slot />
      </div>

      <p class="mt-[18px] text-[16px] leading-tight text-slate-600">
        {{ bottomText }}
        <NuxtLink class="ml-1.5 font-semibold text-indigo-600" :to="bottomLinkTo">{{ bottomLinkLabel }}</NuxtLink>
      </p>
      <p class="mt-2.5 text-[14px] text-slate-400">Demo: enter any email &amp; password to continue</p>
    </div>

    <button
      class="fixed bottom-3.5 right-4 h-8 w-8 rounded-full border border-slate-300 bg-slate-50 text-lg leading-none text-slate-700"
      type="button"
      aria-label="Help"
    >
      ?
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  subtitle: string;
  bottomText: string;
  bottomLinkLabel: string;
  bottomLinkTo: string;
}>();
</script>
