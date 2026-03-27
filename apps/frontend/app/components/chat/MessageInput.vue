<template>
  <div class="border-t border-slate-300 px-6 pb-6 pt-3">
    <div class="rounded-md border border-slate-300 bg-white">
      <div class="flex items-center gap-4 border-b border-slate-200 px-5 py-3 text-slate-400">
        <button class="text-[16px] font-semibold text-slate-500">B</button>
        <button class="text-[16px]">I</button>
        <span class="h-5 w-px bg-slate-300" />
        <button class="inline-flex h-5 w-5 items-center justify-center">
          <svg viewBox="0 0 20 20" class="h-4 w-4 fill-current">
            <path d="M7.2 13.8a3 3 0 0 1 0-4.3L9 7.6a3 3 0 0 1 4.2 4.3l-.6.6a1 1 0 1 1-1.4-1.4l.6-.6a1 1 0 1 0-1.4-1.4L8.6 11a1 1 0 1 0 1.4 1.4l.4-.4a1 1 0 1 1 1.4 1.4l-.4.4a3 3 0 0 1-4.2 0Zm5.6-7.6a3 3 0 0 1 0 4.2L11 12.3a3 3 0 1 1-4.2-4.3l.6-.6a1 1 0 1 1 1.4 1.4l-.6.6a1 1 0 1 0 1.4 1.4l1.8-1.8a1 1 0 0 0-1.4-1.4l-.4.4A1 1 0 1 1 8.2 6.6l.4-.4a3 3 0 0 1 4.2 0Z" />
          </svg>
        </button>
        <button class="inline-flex h-5 w-5 items-center justify-center">
          <svg viewBox="0 0 20 20" class="h-4 w-4 fill-current">
            <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h9A1.5 1.5 0 0 1 16 5.5v1A1.5 1.5 0 0 1 14.5 8h-9A1.5 1.5 0 0 1 4 6.5v-1ZM4 10.5A1.5 1.5 0 0 1 5.5 9h9a1.5 1.5 0 1 1 0 3h-9A1.5 1.5 0 0 1 4 10.5ZM5.5 14a1.5 1.5 0 1 0 0 3h9a1.5 1.5 0 1 0 0-3h-9Z" />
          </svg>
        </button>
        <button class="inline-flex h-5 w-5 items-center justify-center">
          <svg viewBox="0 0 20 20" class="h-4 w-4 fill-current">
            <path d="M6.2 5.2a1 1 0 0 1 1.4 0L10 7.6l2.4-2.4a1 1 0 0 1 1.4 1.4L11.4 9l2.4 2.4a1 1 0 0 1-1.4 1.4L10 10.4l-2.4 2.4a1 1 0 0 1-1.4-1.4L8.6 9 6.2 6.6a1 1 0 0 1 0-1.4Z" />
          </svg>
        </button>
      </div>

      <textarea
        class="h-[86px] w-full resize-none bg-transparent px-5 py-4 text-[16px] font-normal leading-7 text-slate-700 placeholder:font-normal placeholder:text-slate-400 focus:outline-none"
        :placeholder="`Message #${channelName}`"
      />

      <div class="flex items-center justify-between px-4 pb-4 text-slate-400">
        <div class="flex items-center gap-4">
          <button class="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-200 hover:bg-slate-100">
            <svg viewBox="0 0 20 20" class="h-5 w-5 fill-current">
              <path d="M6.3 2.5a3 3 0 0 1 3 3v7.8a1.7 1.7 0 1 0 3.4 0V5.7a3.7 3.7 0 1 0-7.4 0v7.8a5.4 5.4 0 0 0 10.8 0V8a1 1 0 1 1 2 0v5.4a7.4 7.4 0 1 1-14.8 0V5.7a5.7 5.7 0 1 1 11.4 0v7.6a3.7 3.7 0 1 1-7.4 0V5.5a1 1 0 0 1 2 0v7.8a1.7 1.7 0 1 0 3.4 0V5.7a3 3 0 0 0-3-3Z" />
            </svg>
          </button>
          <button class="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-200 hover:bg-slate-100">
            <svg viewBox="0 0 20 20" class="h-5 w-5 fill-current">
              <path d="M10 2.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15Zm0 2a5.5 5.5 0 0 1 4.4 8.8h-8.8A5.5 5.5 0 0 1 10 4.5Zm0 11a5.5 5.5 0 0 1-2.8-.8h5.6a5.5 5.5 0 0 1-2.8.8Zm-2.2-5a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Zm4.4 0a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Z" />
            </svg>
          </button>
          <button class="inline-flex h-8 w-8 items-center justify-center rounded-md text-[26px] leading-none transition-colors duration-200 hover:bg-slate-100">@</button>
        </div>

        <button
          class="inline-flex h-11 w-11 items-center justify-center rounded-md bg-indigo-300 text-[18px] text-white transition-all duration-200 ease-in-out hover:-translate-y-px hover:brightness-105"
        >
          <svg viewBox="0 0 20 20" class="h-5 w-5 fill-current">
            <path d="M2.4 10.8 15.5 4c1-.5 2 .5 1.5 1.5L10.2 18.6c-.4.8-1.6.7-1.8-.2L7 12.8 1.4 11.8c-.9-.2-1.1-1.4 0-1.8Zm5.2.2.8 3.1 4.4-8.5L7.6 11Z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    channelName?: string;
  }>(),
  {
    channelName: "general",
  },
);
</script>
