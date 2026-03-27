<template>
  <div class="flex-1 overflow-y-auto px-3 py-3">
    <nav class="space-y-2 text-[17px] text-slate-700">
      <a class="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-slate-100" href="#"><span>⌂</span>Home</a>
      <a class="flex items-center justify-between rounded-md px-2 py-2 hover:bg-slate-100" href="#"><span class="flex items-center gap-3"><span>📥</span>Inbox</span><Badge>18</Badge></a>
    </nav>

    <div class="mt-4">
      <p class="mb-2 flex items-center gap-2 px-2 text-[12px] font-bold tracking-wide text-slate-500"><span>⌄</span>CHANNELS</p>
      <div class="space-y-1 text-[18px] text-slate-600">
        <a class="flex items-center gap-3 rounded-md bg-indigo-50 px-3 py-2 text-indigo-600" href="#"><span>#</span>general</a>
        <a class="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-slate-100" href="#"><span>#</span>design</a>
        <a class="flex items-center justify-between rounded-md px-3 py-2 hover:bg-slate-100" href="#"><span class="flex items-center gap-3"><span>#</span>engineering</span><Badge>12</Badge></a>
        <a class="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-slate-100" href="#"><span>#</span>random</a>
        <a class="flex items-center justify-between rounded-md px-3 py-2 hover:bg-slate-100" href="#"><span class="flex items-center gap-3"><span>#</span>announceme...</span><Badge>1</Badge></a>
        <a class="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-slate-100" href="#"><span>🔒</span>leadership</a>
        <a class="flex items-center gap-3 rounded-md px-3 py-2 text-slate-400 hover:bg-slate-100" href="#"><span>＋</span>Add channel</a>
      </div>
    </div>

    <div class="mt-4">
      <p class="mb-2 flex items-center gap-2 px-2 text-[12px] font-bold tracking-wide text-slate-500"><span>⌄</span>DIRECT MESSAGES</p>
      <div class="space-y-2">
        <a class="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-slate-100" href="#">
          <span class="flex items-center gap-2"><Avatar size="sm" color="bg-pink-500" initials="SC" /><span class="text-[17px] text-slate-700">Sarah Chen</span></span>
          <Badge>2</Badge>
        </a>
        <a class="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-slate-100" href="#">
          <Avatar size="sm" color="bg-emerald-500" initials="MW" /><span class="text-[17px] text-slate-700">Marcus Webb</span>
        </a>
      </div>
    </div>
  </div>
</template>
