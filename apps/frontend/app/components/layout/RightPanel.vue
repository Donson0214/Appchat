<template>
  <aside class="hidden h-full w-[340px] flex-col border-l border-[#e5e7eb] bg-[#f8f8fa] xl:flex">
    <header class="flex h-[52px] items-center justify-between border-b border-[#e5e7eb] px-3">
      <div class="flex items-center gap-4">
        <button
          v-for="tab in tabs"
          :key="tab"
          type="button"
          class="pb-1 text-[13px] font-medium leading-4 transition-colors"
          :class="activeTab === tab ? 'border-b-2 border-[#1d1c1d] text-[#1d1c1d] font-semibold' : 'text-[#6b7280]'"
          @click="activeTab = tab"
        >
          {{ tab }}
        </button>
      </div>
      <button class="inline-flex h-6 w-6 items-center justify-center rounded-md text-[#9ca3af] hover:bg-[#eef0f5]" @click="closeThread">
        <svg viewBox="0 0 20 20" class="h-4 w-4 fill-current">
          <path d="M5.2 5.2a1 1 0 0 1 1.4 0L10 8.6l3.4-3.4a1 1 0 1 1 1.4 1.4L11.4 10l3.4 3.4a1 1 0 0 1-1.4 1.4L10 11.4l-3.4 3.4a1 1 0 0 1-1.4-1.4L8.6 10 5.2 6.6a1 1 0 0 1 0-1.4Z" />
        </svg>
      </button>
    </header>

    <div class="flex-1 overflow-y-auto px-3 py-3">
      <article class="rounded-md border border-[#e5e7eb] bg-white p-3">
        <div class="flex gap-2.5">
          <Avatar :initials="activeMessage?.initials ?? 'SC'" :color="activeMessage?.color ?? 'bg-pink-500'" />
          <div class="min-w-0">
            <div class="flex items-baseline gap-2">
              <p class="text-[13px] font-semibold leading-[18px] text-[#1D1C1D]">{{ activeMessage?.name ?? 'Sarah Chen' }}</p>
              <p class="text-[12px] font-normal leading-4 text-[#6B6F76]">{{ activeMessage?.time ?? '10:23 AM' }}</p>
            </div>
            <p class="mt-0.5 text-[14px] font-normal leading-5 text-[#1D1C1D]">
              {{ activeMessage?.text ?? 'Select a message and click reply to open this thread.' }}
            </p>
            <div v-if="activeMessage?.reactions?.length" class="mt-2 flex gap-1.5">
              <span
                v-for="reaction in activeMessage.reactions"
                :key="`${reaction.emoji}-${reaction.count}`"
                class="inline-flex items-center gap-1 rounded-[8px] border border-[#e5e7eb] bg-[#f1f2f4] px-2 py-0.5 text-[12px] font-medium text-[#616061]"
              >
                {{ reaction.emoji }} {{ reaction.count }}
              </span>
            </div>
          </div>
        </div>
      </article>

      <p class="mt-3 text-[13px] font-medium text-[#8f95a3]">4 replies</p>

      <div class="mt-2 space-y-2">
        <article v-for="item in replies" :key="item.id" class="rounded-md px-1 py-1">
          <div class="flex gap-2.5">
            <Avatar :initials="item.initials" :color="item.color" />
            <div>
              <div class="flex items-baseline gap-2">
                <p class="text-[13px] font-semibold leading-[18px] text-[#1D1C1D]">{{ item.name }}</p>
                <p class="text-[12px] font-normal leading-4 text-[#6B6F76]">{{ item.time }}</p>
              </div>
              <p class="mt-0.5 text-[14px] font-normal leading-5 text-[#1D1C1D]">{{ item.text }}</p>
            </div>
          </div>
        </article>
      </div>
    </div>

    <div class="border-t border-[#e5e7eb] p-3">
      <div class="rounded-[10px] border border-[#dfe3e8] bg-white px-3 py-2.5">
        <input class="w-full bg-transparent text-[14px] leading-5 text-[#1d1c1d] placeholder:text-[#9ca3af] focus:outline-none" placeholder="Reply in thread..." />
        <div class="mt-2 flex justify-end">
          <button class="inline-flex h-8 w-8 items-center justify-center rounded-md bg-indigo-300 text-white">
            <svg viewBox="0 0 20 20" class="h-4 w-4 fill-current">
              <path d="M2.4 10.8 15.5 4c1-.5 2 .5 1.5 1.5L10.2 18.6c-.4.8-1.6.7-1.8-.2L7 12.8 1.4 11.8c-.9-.2-1.1-1.4 0-1.8Zm5.2.2.8 3.1 4.4-8.5L7.6 11Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import Avatar from "~/components/ui/Avatar.vue";

const tabs = ["Thread", "Profile", "Pinned", "Search"];
const activeTab = ref("Thread");
const { activeMessage, closeThread } = useThreadPanel();

const replies = [
  { id: "1", initials: "MW", color: "bg-emerald-500", name: "Marcus Webb", time: "10:35 AM", text: "This is huge! The auto-layout changes alone will save hours." },
  { id: "2", initials: "PP", color: "bg-indigo-500", name: "Priya Patel", time: "10:40 AM", text: "Love the new color token names. Much cleaner." },
  { id: "3", initials: "JK", color: "bg-amber-500", name: "Jordan Kim", time: "10:52 AM", text: "Can we schedule a quick sync to walk through the guide?" },
  { id: "4", initials: "SC", color: "bg-pink-500", name: "Sarah Chen", time: "11:01 AM", text: "Absolutely. Thursday 2 PM works, I can do a walkthrough." },
];
</script>
