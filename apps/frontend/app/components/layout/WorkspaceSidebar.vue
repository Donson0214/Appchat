<template>
  <div class="flex h-full w-[292px] flex-col border-r border-slate-200 bg-[#f8fafc]">
    <div class="h-[76px] border-b border-slate-200 px-4 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-500 text-[16px] font-bold text-white">A</div>
          <p class="text-[40px] font-semibold text-slate-900">Acme Inc</p>
        </div>
        <span class="text-slate-400">⌄</span>
      </div>
    </div>

    <ChannelSidebar />

    <div class="mt-auto flex h-[62px] items-center justify-between border-t border-slate-200 px-5 text-slate-500">
      <div class="flex items-center gap-5 text-[22px]">
        <span>◐</span>
        <span>⚙</span>
        <span>◉</span>
      </div>
      <span class="text-[24px]">⇥</span>
    </div>
  </div>
</template>
