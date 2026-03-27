globalThis.__timing__.logStart('Load chunks/build/_channelId_-D2yZ-CY1');import { defineComponent, computed, mergeProps, unref, ref, resolveComponent, hasInjectionContext, inject, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrRenderSlot } from 'vue/server-renderer';
import { u as useWorkspace } from './use-workspace-6sM3_VsR.mjs';
import { a as useRoute, _ as _export_sfc, u as useNuxtApp } from './server.mjs';
import { useRouter } from 'vue-router';
import { u as useHead$1, h as headSymbol } from '../routes/renderer.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

function injectHead(nuxtApp) {
  const nuxt = nuxtApp || useNuxtApp();
  return nuxt.ssrContext?.head || nuxt.runWithContext(() => {
    if (hasInjectionContext()) {
      const head = inject(headSymbol);
      if (!head) {
        throw new Error("[nuxt] [unhead] Missing Unhead instance.");
      }
      return head;
    }
  });
}
function useHead(input, options = {}) {
  const head = options.head || injectHead(options.nuxt);
  return useHead$1(input, { head, ...options });
}
const _sfc_main$e = /* @__PURE__ */ defineComponent({
  __name: "Sidebar",
  __ssrInlineRender: true,
  setup(__props) {
    const { workspaceInitial } = useWorkspace();
    const userInitial = ref("A");
    const userFullName = ref("Alex Morgan");
    const userEmail = ref("alex.morgan@acme.io");
    const isProfileMenuOpen = ref(false);
    ref(null);
    ref(null);
    const workspaces = computed(() => [
      { id: "a", label: workspaceInitial.value, bg: "bg-indigo-500" },
      { id: "s", label: "S", bg: "bg-emerald-500" },
      { id: "o", label: "O", bg: "bg-amber-600" }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<aside${ssrRenderAttrs(mergeProps({ class: "flex h-full w-[84px] flex-col items-center justify-between border-r border-slate-800 bg-[#0d1b3a] py-4" }, _attrs))}><div class="flex w-full flex-col items-center gap-2.5"><!--[-->`);
      ssrRenderList(unref(workspaces), (item, index) => {
        _push(`<button class="${ssrRenderClass([item.bg, "relative flex h-[58px] w-[58px] items-center justify-center rounded-[14px] text-[35px] font-semibold text-white transition-all duration-200 ease-in-out hover:brightness-110"])}">${ssrInterpolate(item.label)} `);
        if (index === 0) {
          _push(`<span class="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-indigo-500"></span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button>`);
      });
      _push(`<!--]--><button class="mt-3 flex h-[58px] w-[58px] items-center justify-center rounded-[14px] border border-dashed border-slate-600 text-[30px] leading-none text-slate-400 transition-all duration-200 ease-in-out hover:bg-slate-800"> + </button></div><div class="relative mb-1"><button class="relative flex h-[54px] w-[54px] items-center justify-center rounded-[14px] bg-indigo-500 text-[29px] font-semibold text-white">${ssrInterpolate(unref(userInitial))} <span class="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[#0d1b3a] bg-emerald-400"></span></button>`);
      if (unref(isProfileMenuOpen)) {
        _push(`<div class="absolute bottom-0 left-[68px] z-50 w-[336px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_14px_28px_rgba(15,23,42,0.2)]"><div class="border-b border-slate-200 px-5 py-4"><p class="text-[17px] font-semibold leading-none text-slate-800">${ssrInterpolate(unref(userFullName))}</p><p class="mt-2 text-[13px] leading-none text-slate-500">${ssrInterpolate(unref(userEmail))}</p></div><button class="flex w-full items-center gap-3 px-5 py-3 text-left text-[17px] font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-100" type="button"><svg viewBox="0 0 20 20" class="h-5 w-5 fill-amber-400"><path d="M10 2.5a.8.8 0 0 1 .7 1.2 5.8 5.8 0 1 0 5.6 8.5.8.8 0 0 1 1.4.7A7.4 7.4 0 1 1 10 2.5Z"></path></svg><span>Set yourself as away</span></button><button class="flex w-full items-center gap-3 px-5 py-3 text-left text-[17px] font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-100" type="button"><svg viewBox="0 0 20 20" class="h-5 w-5 fill-violet-200"><path d="M4.2 6.8C5.9 5 8 4.1 10.3 4.1c2.4 0 4.5.9 6.2 2.7a4.3 4.3 0 0 1 0 6.1c-1.7 1.7-3.8 2.6-6.2 2.6-2.3 0-4.4-.9-6.1-2.6a4.3 4.3 0 0 1 0-6.1Z"></path></svg><span>Set a status</span></button><div class="border-t border-slate-200 px-5 py-3"><button class="text-[17px] font-medium text-red-500 transition-colors duration-200 hover:text-red-600" type="button"> Sign out </button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></aside>`);
    };
  }
});
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/Sidebar.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const _sfc_main$d = /* @__PURE__ */ defineComponent({
  __name: "WorkspaceSidebar",
  __ssrInlineRender: true,
  setup(__props) {
    const { workspace, workspaceInitial } = useWorkspace();
    useRouter();
    const isWorkspaceMenuOpen = ref(false);
    ref(null);
    const workspaceOptions = [
      { id: "local-default", name: "Acme Inc", slug: "acme", members: "47 members", roleLabel: "admin", badgeColor: "bg-indigo-500" },
      { id: "side-project", name: "Side Project", slug: "side-project", members: "5 members", roleLabel: "member", badgeColor: "bg-emerald-500" },
      { id: "oss-community", name: "OSS Community", slug: "oss-community", members: "312 members", roleLabel: "member", badgeColor: "bg-amber-500" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ChannelSidebar = resolveComponent("ChannelSidebar");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex h-full w-[292px] flex-col border-r border-slate-300 bg-[#f8fafc]" }, _attrs))}><div class="relative flex h-[84px] items-center justify-between border-b border-slate-300 px-4"><button type="button" class="flex items-center gap-3 rounded-md p-1 transition-colors duration-200 hover:bg-slate-100"><div class="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-500 text-[20px] font-semibold text-white">${ssrInterpolate(unref(workspaceInitial))}</div><p class="text-[40px] font-semibold leading-none text-slate-900">${ssrInterpolate(unref(workspace).name)}</p></button><button type="button" class="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors duration-200 hover:bg-slate-200/70"><svg viewBox="0 0 20 20" class="h-4 w-4 fill-current"><path d="M5.3 7.7a1 1 0 0 1 1.4 0L10 11l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z"></path></svg></button>`);
      if (isWorkspaceMenuOpen.value) {
        _push(`<div class="absolute left-4 top-[72px] z-50 w-[220px] overflow-hidden rounded-md border border-slate-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.2)]"><div class="p-2"><!--[-->`);
        ssrRenderList(workspaceOptions, (item) => {
          _push(`<button type="button" class="flex w-full items-center justify-between rounded-md px-2 py-2 text-left transition-colors duration-150 hover:bg-slate-50"><div class="flex items-center gap-3"><span class="${ssrRenderClass([item.badgeColor, "inline-flex h-8 w-8 items-center justify-center rounded-md text-[14px] font-semibold text-white"])}">${ssrInterpolate(item.name[0]?.toUpperCase())}</span><div class="leading-tight"><p class="text-[14px] font-semibold text-slate-900">${ssrInterpolate(item.name)}</p><p class="mt-0.5 text-[12px] text-slate-400">${ssrInterpolate(item.members)} - ${ssrInterpolate(item.roleLabel)}</p></div></div>`);
          if (unref(workspace).slug === item.slug) {
            _push(`<svg viewBox="0 0 20 20" class="h-4 w-4 fill-indigo-500"><path d="M15.8 6.2a1 1 0 0 1 0 1.4l-6 6a1 1 0 0 1-1.4 0l-3-3a1 1 0 0 1 1.4-1.4L9 11.4l5.3-5.2a1 1 0 0 1 1.4 0Z"></path></svg>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</button>`);
        });
        _push(`<!--]--></div><div class="border-t border-slate-200 p-2"><button type="button" class="flex w-full items-center justify-center gap-2 rounded-md px-2 py-2 text-[13px] font-medium text-indigo-500 transition-colors duration-150 hover:bg-indigo-50"><span class="text-[16px] leading-none">+</span><span>Create or join workspace</span></button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_component_ChannelSidebar, null, null, _parent));
      _push(`<div class="mt-auto flex h-[66px] items-center justify-between border-t border-slate-300 px-5 text-slate-500"><div class="flex items-center gap-4"><button class="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-200 hover:bg-slate-200/70"><svg viewBox="0 0 20 20" class="h-5 w-5 fill-current"><path d="M10 2.5a.8.8 0 0 1 .7 1.2 5.8 5.8 0 1 0 5.6 8.5.8.8 0 0 1 1.4.7A7.4 7.4 0 1 1 10 2.5Z"></path></svg></button><button class="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-200 hover:bg-slate-200/70"><svg viewBox="0 0 20 20" class="h-5 w-5 fill-current"><path d="M8.5 2.5h3l.3 1.8a5.8 5.8 0 0 1 1.5.9l1.7-.8 2.1 2.1-.8 1.7c.4.5.7 1 .9 1.5l1.8.3v3l-1.8.3a5.8 5.8 0 0 1-.9 1.5l.8 1.7-2.1 2.1-1.7-.8c-.5.4-1 .7-1.5.9l-.3 1.8h-3l-.3-1.8a5.8 5.8 0 0 1-1.5-.9l-1.7.8-2.1-2.1.8-1.7a5.8 5.8 0 0 1-.9-1.5L1 11.5v-3l1.8-.3c.2-.5.5-1 .9-1.5L2.9 5l2.1-2.1 1.7.8c.5-.4 1-.7 1.5-.9l.3-1.8Zm1.5 5.3a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4Z"></path></svg></button><button class="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-200 hover:bg-slate-200/70"><svg viewBox="0 0 20 20" class="h-5 w-5 fill-current"><path d="M6.8 9a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm6.4 1.2a2.6 2.6 0 1 1 0-5.2 2.6 2.6 0 0 1 0 5.2ZM2.5 15.7A4.7 4.7 0 0 1 7.2 11h.7a4.7 4.7 0 0 1 4.7 4.7v.8H2.5v-.8Zm10.2.8v-.8c0-1.2-.4-2.3-1-3.2.4-.1.8-.2 1.3-.2h.4a4 4 0 0 1 4 4v.2h-4.7Z"></path></svg></button></div><button class="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-200 hover:bg-slate-200/70"><svg viewBox="0 0 20 20" class="h-5 w-5 fill-current"><path d="M11 3.5a1 1 0 1 1 2 0v2h2.5a2 2 0 0 1 2 2V14a2 2 0 0 1-2 2H13v2a1 1 0 1 1-2 0v-2h-3a1 1 0 0 1 0-2h6.5a.5.5 0 0 0 .5-.5V7.5a.5.5 0 0 0-.5-.5H8A1 1 0 1 1 8 5h3V3.5ZM4.3 6.3a1 1 0 0 1 1.4 0l2.5 2.5a1 1 0 1 1-1.4 1.4L6 9.4V15a1 1 0 1 1-2 0V9.4l-.8.8a1 1 0 0 1-1.4-1.4l2.5-2.5Z"></path></svg></button></div></div>`);
    };
  }
});
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/WorkspaceSidebar.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const _sfc_main$c = /* @__PURE__ */ defineComponent({
  __name: "NotificationPanel",
  __ssrInlineRender: true,
  emits: ["close"],
  setup(__props) {
    const notifications = ref([
      {
        id: "1",
        initials: "SC",
        avatarColor: "bg-pink-500",
        badge: "@",
        badgeColor: "bg-indigo-500",
        name: "Sarah Chen",
        type: "mention",
        prefix: "@alex",
        message: "can you review the PR?",
        channel: "#general",
        time: "5m ago",
        unread: true
      },
      {
        id: "2",
        initials: "JK",
        avatarColor: "bg-amber-500",
        badge: "💬",
        badgeColor: "bg-blue-500",
        name: "Jordan Kim",
        type: "thread",
        message: "Looks good to merge",
        channel: "#engineering",
        time: "12m ago",
        unread: true
      },
      {
        id: "3",
        initials: "MW",
        avatarColor: "bg-emerald-500",
        badge: "😊",
        badgeColor: "bg-orange-400",
        name: "Marcus Webb",
        type: "reaction",
        message: "",
        emoji: "🎉",
        channel: "#design",
        time: "1h ago",
        unread: true
      },
      {
        id: "4",
        initials: "PP",
        avatarColor: "bg-violet-500",
        badge: "@",
        badgeColor: "bg-indigo-500",
        name: "Priya Patel",
        type: "mention",
        prefix: "@channel",
        message: "Q2 roadmap is ready for review",
        channel: "#general",
        time: "2h ago",
        unread: false
      }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-[340px] overflow-hidden rounded-[8px] border border-[#E8E8E8] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]" }, _attrs))}><div class="flex items-center justify-between border-b border-[#E8E8E8] px-4 py-3"><h3 class="text-[16px] font-semibold leading-6 text-[#1D1C1D]">Notifications</h3><div class="flex items-center gap-3"><button type="button" class="text-[14px] font-medium leading-5 text-[#1264A3] transition-colors duration-200 hover:opacity-85"> Mark all read </button><button type="button" class="inline-flex h-6 w-6 items-center justify-center rounded-md text-[#8A8A8A] transition-colors duration-200 hover:bg-[#F4F4F5]"><svg viewBox="0 0 20 20" class="h-4 w-4 fill-current"><path d="M6.2 6.2a1 1 0 0 1 1.4 0L10 8.6l2.4-2.4a1 1 0 0 1 1.4 1.4L11.4 10l2.4 2.4a1 1 0 0 1-1.4 1.4L10 11.4l-2.4 2.4a1 1 0 0 1-1.4-1.4L8.6 10 6.2 7.6a1 1 0 0 1 0-1.4Z"></path></svg></button></div></div><div class="max-h-[420px] overflow-y-auto bg-white [scrollbar-width:thin]"><!--[-->`);
      ssrRenderList(unref(notifications), (item) => {
        _push(`<article class="relative flex cursor-pointer items-start gap-3 border-b border-[#E8E8E8] px-4 py-[11px] transition-colors duration-150 ease-in-out hover:bg-[#F4F4F5]"><div class="relative"><div class="${ssrRenderClass([item.avatarColor, "flex h-8 w-8 items-center justify-center rounded-[8px] text-[14px] font-semibold text-white"])}">${ssrInterpolate(item.initials)}</div><span class="${ssrRenderClass([item.badgeColor, "absolute -bottom-1 -right-1 inline-flex h-[14px] w-[14px] items-center justify-center rounded-full border-2 border-white text-[8px] font-medium text-white"])}">${ssrInterpolate(item.badge)}</span></div><div class="min-w-0 pr-5"><p class="text-[14px] font-normal leading-5 text-[#1D1C1D]"><span class="font-semibold text-[#1D1C1D]">${ssrInterpolate(item.name)}</span>`);
        if (item.type === "mention") {
          _push(`<span>${ssrInterpolate(item.prefix)} ${ssrInterpolate(item.message)}</span>`);
        } else if (item.type === "thread") {
          _push(`<span> replied in thread: &quot;${ssrInterpolate(item.message)}&quot;</span>`);
        } else if (item.type === "reaction") {
          _push(`<span> reacted <span class="mx-0.5 inline-block align-baseline text-[16px] leading-none">${ssrInterpolate(item.emoji)}</span> to your message</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span class="font-medium text-[#1264A3]">${ssrInterpolate(item.channel)}</span></p><p class="mt-1 text-[12px] font-normal leading-none text-[#616061]">${ssrInterpolate(item.time)}</p></div>`);
        if (item.unread) {
          _push(`<span class="absolute right-4 top-1/2 h-[7px] w-[7px] -translate-y-1/2 rounded-full bg-[#1264A3]"></span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</article>`);
      });
      _push(`<!--]--></div><div class="flex items-center justify-center border-t border-[#E8E8E8] bg-white px-4 py-3"><button type="button" class="text-[14px] font-medium text-[#1264A3] transition-colors duration-200 hover:opacity-85"> View all notifications </button></div></div>`);
    };
  }
});
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/NotificationPanel.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const _sfc_main$b = /* @__PURE__ */ defineComponent({
  __name: "Header",
  __ssrInlineRender: true,
  props: {
    channel: {}
  },
  setup(__props) {
    const searchTabs = ["All", "Messages", "Channels", "People", "Files"];
    const searchTags = ["design system", "API migration", "deployment", "standup"];
    const activeSearchTab = ref("All");
    const isSearchOpen = ref(false);
    const isNotificationOpen = ref(false);
    ref(null);
    ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "relative flex h-[92px] items-center justify-between border-b border-slate-300 px-6" }, _attrs))}><div><div class="flex items-center gap-3"><h1 class="text-[28px] font-semibold leading-none tracking-[-0.015em] text-[#1D1C1D]">#${ssrInterpolate(__props.channel.name)}</h1><span class="pt-0.5 text-[16px] font-normal text-[#8f95a3]">${ssrInterpolate(__props.channel.members)} members</span></div><p class="mt-1 text-[16px] font-normal leading-6 text-[#8f95a3]">${ssrInterpolate(__props.channel.description)}</p></div><div class="flex items-center gap-4 text-[#64748b]"><button class="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[#64748b] transition-colors duration-150 hover:bg-slate-100 hover:text-[#334155]"><svg viewBox="0 0 20 20" class="h-[15px] w-[15px] fill-current"><path d="M9.1 2.7c.3-.9 1.5-.9 1.8 0l1.4 3.3 3.6.3c1 .1 1.4 1.3.6 2l-2.8 2.3.9 3.5c.2 1-.8 1.7-1.7 1.2L10 13.4 6.9 15.3c-.8.5-1.9-.2-1.6-1.2l.9-3.5-2.8-2.3c-.8-.7-.4-1.9.6-2L7.6 6l1.5-3.3Z"></path></svg><span class="text-[14px] font-medium leading-none">${ssrInterpolate(__props.channel.starCount)}</span></button><button type="button" class="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-150 hover:bg-slate-100"><svg viewBox="0 0 20 20" class="h-5 w-5 fill-current"><path d="M8.6 3a5.6 5.6 0 1 1-3.9 9.6L2.6 15a1 1 0 1 0 1.4 1.4l2.1-2.1A5.6 5.6 0 0 1 8.6 3Zm0 1.8a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Z"></path></svg></button><button type="button" class="relative inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-150 hover:bg-slate-100"><svg viewBox="0 0 20 20" class="h-5 w-5 fill-current"><path d="M10 2.5a5 5 0 0 0-5 5V9c0 .8-.3 1.5-.9 2.1l-.2.2A1.3 1.3 0 0 0 4.8 14h10.4a1.3 1.3 0 0 0 .9-2.2l-.2-.2A3 3 0 0 1 15 9V7.5a5 5 0 0 0-5-5Zm0 15a2.3 2.3 0 0 0 2.2-1.8H7.8A2.3 2.3 0 0 0 10 17.5Z"></path></svg><span class="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-indigo-500"></span></button><button class="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-150 hover:bg-slate-100"><svg viewBox="0 0 20 20" class="h-5 w-5 fill-current"><path d="M3 7.2a2.2 2.2 0 0 1 2.2-2.2h6.6A2.2 2.2 0 0 1 14 7.2v5.6a2.2 2.2 0 0 1-2.2 2.2H5.2A2.2 2.2 0 0 1 3 12.8V7.2Zm12.3.4 2.8-1.5A1.3 1.3 0 0 1 20 7.2v5.6a1.3 1.3 0 0 1-1.9 1.1l-2.8-1.5V7.6Z"></path></svg></button></div>`);
      if (isNotificationOpen.value) {
        _push(`<div class="absolute right-4 top-[84px] z-30">`);
        _push(ssrRenderComponent(_sfc_main$c, {
          onClose: ($event) => isNotificationOpen.value = false
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (isSearchOpen.value) {
        _push(`<div class="fixed inset-0 z-40 flex items-start justify-center bg-black/40 pt-[72px] backdrop-blur-[3px]"><div class="w-[534px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.2)]"><div class="flex h-[46px] items-center border-b border-slate-200 px-4"><svg viewBox="0 0 20 20" class="h-4 w-4 fill-[#94a3b8]"><path d="M8.6 3a5.6 5.6 0 1 1-3.9 9.6L2.6 15a1 1 0 1 0 1.4 1.4l2.1-2.1A5.6 5.6 0 0 1 8.6 3Zm0 1.8a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Z"></path></svg><input type="text" class="ml-3 flex-1 border-none bg-transparent text-[14px] font-normal text-slate-700 outline-none placeholder:text-slate-400" placeholder="Search messages, channels, people..." autofocus><span class="inline-flex h-5 items-center rounded-md border border-slate-200 px-2 text-[11px] font-medium text-slate-400">ESC</span></div><div class="flex h-[40px] items-center gap-1 border-b border-slate-200 px-3"><!--[-->`);
        ssrRenderList(searchTabs, (tab) => {
          _push(`<button type="button" class="${ssrRenderClass([activeSearchTab.value === tab ? "bg-indigo-100 text-indigo-600" : "text-slate-500 hover:bg-slate-100", "rounded-md px-3 py-1 text-[13px] font-medium transition-colors"])}">${ssrInterpolate(tab)}</button>`);
        });
        _push(`<!--]--></div><div class="flex flex-col items-center justify-center px-4 py-8"><p class="text-center text-[16px] font-medium leading-6 text-slate-500">Search across all channels, messages, and people</p><div class="mt-4 flex flex-wrap items-center justify-center gap-2"><!--[-->`);
        ssrRenderList(searchTags, (tag) => {
          _push(`<span class="inline-flex h-7 items-center rounded-md border border-slate-200 bg-slate-50 px-3 text-[13px] font-medium text-slate-600">${ssrInterpolate(tag)}</span>`);
        });
        _push(`<!--]--></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</header>`);
    };
  }
});
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/Header.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "MessageInput",
  __ssrInlineRender: true,
  props: {
    channelName: { default: "general" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "border-t border-slate-300 px-6 pb-6 pt-3" }, _attrs))}><div class="rounded-md border border-slate-300 bg-white"><div class="flex items-center gap-4 border-b border-slate-200 px-5 py-3 text-slate-400"><button class="text-[16px] font-semibold text-slate-500">B</button><button class="text-[16px]">I</button><span class="h-5 w-px bg-slate-300"></span><button class="inline-flex h-5 w-5 items-center justify-center"><svg viewBox="0 0 20 20" class="h-4 w-4 fill-current"><path d="M7.2 13.8a3 3 0 0 1 0-4.3L9 7.6a3 3 0 0 1 4.2 4.3l-.6.6a1 1 0 1 1-1.4-1.4l.6-.6a1 1 0 1 0-1.4-1.4L8.6 11a1 1 0 1 0 1.4 1.4l.4-.4a1 1 0 1 1 1.4 1.4l-.4.4a3 3 0 0 1-4.2 0Zm5.6-7.6a3 3 0 0 1 0 4.2L11 12.3a3 3 0 1 1-4.2-4.3l.6-.6a1 1 0 1 1 1.4 1.4l-.6.6a1 1 0 1 0 1.4 1.4l1.8-1.8a1 1 0 0 0-1.4-1.4l-.4.4A1 1 0 1 1 8.2 6.6l.4-.4a3 3 0 0 1 4.2 0Z"></path></svg></button><button class="inline-flex h-5 w-5 items-center justify-center"><svg viewBox="0 0 20 20" class="h-4 w-4 fill-current"><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h9A1.5 1.5 0 0 1 16 5.5v1A1.5 1.5 0 0 1 14.5 8h-9A1.5 1.5 0 0 1 4 6.5v-1ZM4 10.5A1.5 1.5 0 0 1 5.5 9h9a1.5 1.5 0 1 1 0 3h-9A1.5 1.5 0 0 1 4 10.5ZM5.5 14a1.5 1.5 0 1 0 0 3h9a1.5 1.5 0 1 0 0-3h-9Z"></path></svg></button><button class="inline-flex h-5 w-5 items-center justify-center"><svg viewBox="0 0 20 20" class="h-4 w-4 fill-current"><path d="M6.2 5.2a1 1 0 0 1 1.4 0L10 7.6l2.4-2.4a1 1 0 0 1 1.4 1.4L11.4 9l2.4 2.4a1 1 0 0 1-1.4 1.4L10 10.4l-2.4 2.4a1 1 0 0 1-1.4-1.4L8.6 9 6.2 6.6a1 1 0 0 1 0-1.4Z"></path></svg></button></div><textarea class="h-[86px] w-full resize-none bg-transparent px-5 py-4 text-[16px] font-normal leading-7 text-slate-700 placeholder:font-normal placeholder:text-slate-400 focus:outline-none"${ssrRenderAttr("placeholder", `Message #${__props.channelName}`)}></textarea><div class="flex items-center justify-between px-4 pb-4 text-slate-400"><div class="flex items-center gap-4"><button class="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-200 hover:bg-slate-100"><svg viewBox="0 0 20 20" class="h-5 w-5 fill-current"><path d="M6.3 2.5a3 3 0 0 1 3 3v7.8a1.7 1.7 0 1 0 3.4 0V5.7a3.7 3.7 0 1 0-7.4 0v7.8a5.4 5.4 0 0 0 10.8 0V8a1 1 0 1 1 2 0v5.4a7.4 7.4 0 1 1-14.8 0V5.7a5.7 5.7 0 1 1 11.4 0v7.6a3.7 3.7 0 1 1-7.4 0V5.5a1 1 0 0 1 2 0v7.8a1.7 1.7 0 1 0 3.4 0V5.7a3 3 0 0 0-3-3Z"></path></svg></button><button class="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-200 hover:bg-slate-100"><svg viewBox="0 0 20 20" class="h-5 w-5 fill-current"><path d="M10 2.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15Zm0 2a5.5 5.5 0 0 1 4.4 8.8h-8.8A5.5 5.5 0 0 1 10 4.5Zm0 11a5.5 5.5 0 0 1-2.8-.8h5.6a5.5 5.5 0 0 1-2.8.8Zm-2.2-5a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Zm4.4 0a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Z"></path></svg></button><button class="inline-flex h-8 w-8 items-center justify-center rounded-md text-[26px] leading-none transition-colors duration-200 hover:bg-slate-100">@</button></div><button class="inline-flex h-11 w-11 items-center justify-center rounded-md bg-indigo-300 text-[18px] text-white transition-all duration-200 ease-in-out hover:-translate-y-px hover:brightness-105"><svg viewBox="0 0 20 20" class="h-5 w-5 fill-current"><path d="M2.4 10.8 15.5 4c1-.5 2 .5 1.5 1.5L10.2 18.6c-.4.8-1.6.7-1.8-.2L7 12.8 1.4 11.8c-.9-.2-1.1-1.4 0-1.8Zm5.2.2.8 3.1 4.4-8.5L7.6 11Z"></path></svg></button></div></div></div>`);
    };
  }
});
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/chat/MessageInput.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "Avatar",
  __ssrInlineRender: true,
  props: {
    initials: { default: "U" },
    size: { default: "md" },
    color: { default: "bg-indigo-500" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: [
          "inline-flex items-center justify-center rounded-md font-semibold text-white",
          __props.size === "sm" ? "h-8 w-8 text-sm" : "h-11 w-11 text-base",
          __props.color
        ]
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, () => {
        _push(`${ssrInterpolate(__props.initials)}`);
      }, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/Avatar.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "MessageAvatar",
  __ssrInlineRender: true,
  props: {
    initials: {},
    color: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$9, mergeProps({
        size: "md",
        color: __props.color,
        initials: __props.initials,
        class: "mt-0.5"
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/chat/MessageAvatar.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "MessageContent",
  __ssrInlineRender: true,
  props: {
    text: {}
  },
  setup(__props) {
    const props = __props;
    const formattedText = computed(
      () => props.text.replace(/@([a-zA-Z0-9_]+)/g, '<span class="font-semibold text-indigo-600">@$1</span>')
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<p${ssrRenderAttrs(mergeProps({ class: "mt-0.5 text-[16px] font-normal leading-7 text-slate-800" }, _attrs))}>${unref(formattedText) ?? ""}</p>`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/chat/MessageContent.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "MessageMeta",
  __ssrInlineRender: true,
  props: {
    name: {},
    time: {},
    pinned: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-baseline gap-2.5" }, _attrs))}><h3 class="text-[18px] font-medium leading-6 text-slate-900">${ssrInterpolate(__props.name)}</h3><p class="text-[15px] font-normal text-slate-400">${ssrInterpolate(__props.time)}</p>`);
      if (__props.pinned) {
        _push(`<p class="inline-flex items-center gap-1 text-[15px] font-normal text-amber-500"><svg viewBox="0 0 20 20" class="h-3.5 w-3.5 fill-current"><path d="M12.4 2.8 17 7.4a1 1 0 0 1-1.4 1.4l-.5-.5-2 2-.1 4.7a1 1 0 0 1-1.7.7l-2-2-2.2 2.2a1 1 0 1 1-1.4-1.4l2.2-2.2-2-2a1 1 0 0 1 .7-1.7l4.7-.1 2-2-.5-.5a1 1 0 0 1 1.4-1.4Z"></path></svg><span>pinned</span></p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/chat/MessageMeta.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "MessageReactions",
  __ssrInlineRender: true,
  props: {
    reactions: {},
    replies: {},
    lastReply: {},
    replyUsers: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mt-2 flex flex-wrap items-center gap-2" }, _attrs))}><!--[-->`);
      ssrRenderList(__props.reactions, (reaction) => {
        _push(`<button class="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-[14px] font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-100" type="button"><span class="text-[16px] leading-none">${ssrInterpolate(reaction.emoji)}</span><span>${ssrInterpolate(reaction.count)}</span></button>`);
      });
      _push(`<!--]-->`);
      if (__props.replies) {
        _push(`<div class="inline-flex items-center gap-1 text-[15px] leading-6"><!--[-->`);
        ssrRenderList(__props.replyUsers, (reply) => {
          _push(`<span class="${ssrRenderClass([reply.color, "inline-flex h-7 w-7 items-center justify-center rounded-md text-[12px] font-semibold text-white"])}">${ssrInterpolate(reply.initials)}</span>`);
        });
        _push(`<!--]--><span class="ml-1 font-semibold text-indigo-600">${ssrInterpolate(__props.replies)} replies</span><span class="font-normal text-slate-400">${ssrInterpolate(__props.lastReply)}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/chat/MessageReactions.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "MessageItem",
  __ssrInlineRender: true,
  props: {
    message: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<article${ssrRenderAttrs(mergeProps({ class: "group relative -mx-2 rounded-md px-2 py-1.5 transition-colors duration-150 hover:bg-slate-100/80" }, _attrs))}><div class="flex gap-3.5">`);
      _push(ssrRenderComponent(_sfc_main$8, {
        initials: __props.message.initials,
        color: __props.message.color
      }, null, _parent));
      _push(`<div class="min-w-0 flex-1 pr-40">`);
      _push(ssrRenderComponent(_sfc_main$6, {
        name: __props.message.name,
        time: __props.message.time,
        pinned: __props.message.pinned
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$7, {
        text: __props.message.text
      }, null, _parent));
      if (__props.message.attachment) {
        _push(`<div class="mt-2 inline-flex min-w-[280px] items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2"><div class="flex items-center gap-3"><span class="inline-flex h-8 w-8 items-center justify-center rounded-md bg-violet-100 text-violet-400"><svg viewBox="0 0 20 20" class="h-4 w-4 fill-current"><path d="M5 2.8A1.8 1.8 0 0 0 3.2 4.6v10.8A1.8 1.8 0 0 0 5 17.2h10a1.8 1.8 0 0 0 1.8-1.8V7.8l-5-5H5Zm6 1.7 4.1 4.1h-2.6a1.5 1.5 0 0 1-1.5-1.5V4.5Z"></path></svg></span><div><p class="max-w-[240px] truncate text-[15px] font-medium text-[#1d1c1d]">${ssrInterpolate(__props.message.attachment.name)}</p><p class="text-[13px] text-[#8f95a3]">${ssrInterpolate(__props.message.attachment.size)}</p></div></div><button type="button" class="inline-flex h-7 w-7 items-center justify-center rounded-md text-[#8f95a3] transition-colors hover:bg-white hover:text-[#616061]"><svg viewBox="0 0 20 20" class="h-4 w-4 fill-current"><path d="M9 3a1 1 0 0 1 2 0v7.6l2.1-2.2a1 1 0 0 1 1.4 1.4l-3.8 3.9a1 1 0 0 1-1.4 0L5.5 9.8a1 1 0 1 1 1.4-1.4L9 10.6V3Zm-5 11.5a1 1 0 0 1 1 1v.3c0 .1.1.2.2.2h9.6a.2.2 0 0 0 .2-.2v-.3a1 1 0 1 1 2 0v.3a2.2 2.2 0 0 1-2.2 2.2H5.2A2.2 2.2 0 0 1 3 15.8v-.3a1 1 0 0 1 1-1Z"></path></svg></button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_sfc_main$5, {
        reactions: __props.message.reactions,
        replies: __props.message.replies,
        "last-reply": __props.message.lastReply,
        "reply-users": __props.message.replyUsers
      }, null, _parent));
      _push(`</div></div><div class="pointer-events-none absolute right-2 top-2 opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100"><div class="inline-flex items-center gap-0.5 rounded-md border border-slate-200 bg-white p-1 shadow-[0_1px_6px_rgba(15,23,42,0.12)]"><button type="button" class="inline-flex h-6 w-6 items-center justify-center rounded text-[#94a3b8] hover:bg-slate-100 hover:text-[#475569]" title="Add reaction"><svg viewBox="0 0 20 20" class="h-4 w-4 fill-current"><path d="M10 2.8a7.2 7.2 0 1 0 0 14.4 7.2 7.2 0 0 0 0-14.4Zm0 1.9a5.3 5.3 0 0 1 4.2 8.5H5.8A5.3 5.3 0 0 1 10 4.7Zm0 10.6a5.3 5.3 0 0 1-2.6-.7h5.2a5.3 5.3 0 0 1-2.6.7Zm-2-5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm4 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path></svg></button><button type="button" class="inline-flex h-6 w-6 items-center justify-center rounded text-[#94a3b8] hover:bg-slate-100 hover:text-[#475569]" title="Reply in thread"><svg viewBox="0 0 20 20" class="h-4 w-4 fill-current"><path d="M3.5 4.8A1.8 1.8 0 0 1 5.3 3h9.4a1.8 1.8 0 0 1 1.8 1.8v6.4a1.8 1.8 0 0 1-1.8 1.8H9.2l-3.6 3a.8.8 0 0 1-1.3-.6V13A1.8 1.8 0 0 1 2.5 11.2V4.8h1Z"></path></svg></button><button type="button" class="inline-flex h-6 w-6 items-center justify-center rounded text-[#94a3b8] hover:bg-slate-100 hover:text-[#475569]" title="Save"><svg viewBox="0 0 20 20" class="h-4 w-4 fill-current"><path d="M5 3h10a1 1 0 0 1 1 1v13a.8.8 0 0 1-1.3.6L10 14l-4.7 3.6A.8.8 0 0 1 4 17V4a1 1 0 0 1 1-1Z"></path></svg></button><button type="button" class="inline-flex h-6 w-6 items-center justify-center rounded text-[#94a3b8] hover:bg-slate-100 hover:text-[#475569]" title="More actions"><svg viewBox="0 0 20 20" class="h-4 w-4 fill-current"><path d="M4.5 8.8a1.3 1.3 0 1 1 0 2.5 1.3 1.3 0 0 1 0-2.5Zm5.5 0a1.3 1.3 0 1 1 0 2.5 1.3 1.3 0 0 1 0-2.5Zm5.5 0a1.3 1.3 0 1 1 0 2.5 1.3 1.3 0 0 1 0-2.5Z"></path></svg></button></div></div></article>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/chat/MessageItem.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "MessageList",
  __ssrInlineRender: true,
  props: {
    channelName: {},
    channelDescription: {},
    showWelcome: { type: Boolean },
    showTopReactions: { type: Boolean },
    typingNotice: {},
    topReactions: {},
    messages: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex-1 overflow-y-auto px-4 py-4" }, _attrs))}>`);
      if (__props.showTopReactions) {
        _push(`<div class="mb-4 flex items-center gap-2"><!--[-->`);
        ssrRenderList(__props.topReactions, (reaction) => {
          _push(`<button type="button" class="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1 text-[15px] font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-100"><span>${ssrInterpolate(reaction.emoji)}</span><span>${ssrInterpolate(reaction.count)}</span></button>`);
        });
        _push(`<!--]--><button type="button" class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 bg-white text-[20px] text-slate-500 transition-colors duration-150 hover:bg-slate-100"> + </button></div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.showWelcome) {
        _push(`<div class="mb-5"><div class="inline-flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-slate-400"><span class="text-[28px] leading-none">#</span></div><h2 class="mt-3 text-[40px] font-semibold leading-none text-[#111827]">Welcome to #${ssrInterpolate(__props.channelName)}</h2><p class="mt-2 text-[16px] text-[#64748b]">${ssrInterpolate(__props.channelDescription)}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.typingNotice) {
        _push(`<div class="mb-4 flex items-center gap-2 text-[15px] text-[#64748b]"><span class="inline-flex items-center gap-1 text-slate-400"><span class="h-1.5 w-1.5 rounded-full bg-slate-400"></span><span class="h-1.5 w-1.5 rounded-full bg-slate-400"></span><span class="h-1.5 w-1.5 rounded-full bg-slate-400"></span></span><span>${ssrInterpolate(__props.typingNotice)}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="space-y-1"><!--[-->`);
      ssrRenderList(__props.messages, (message) => {
        _push(ssrRenderComponent(_sfc_main$4, {
          key: message.id,
          message
        }, null, _parent));
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/chat/MessageList.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "ChatContainer",
  __ssrInlineRender: true,
  props: {
    channel: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex min-h-0 flex-1 flex-col" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$3, {
        "channel-name": __props.channel.name,
        "channel-description": __props.channel.description,
        "show-welcome": __props.channel.showWelcome,
        "show-top-reactions": __props.channel.showTopReactions,
        "typing-notice": __props.channel.typingNotice,
        "top-reactions": __props.channel.topReactions,
        messages: __props.channel.messages
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$a, {
        "channel-name": __props.channel.name
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/chat/ChatContainer.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<aside${ssrRenderAttrs(mergeProps({ class: "hidden" }, _attrs))}></aside>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/RightPanel.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const RightPanel = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[channelId]",
  __ssrInlineRender: true,
  setup(__props) {
    const AppHeader = _sfc_main$b;
    const route = useRoute();
    const { workspace } = useWorkspace();
    const channelId = computed(() => String(route.params.channelId ?? "general"));
    useHead({
      title: computed(() => `AppChat | ${workspace.value.slug} / #${channelId.value}`)
    });
    const channels = {
      general: {
        name: "general",
        members: 6,
        description: "Company-wide announcements and watercooler chat",
        starCount: 3,
        showTopReactions: true,
        topReactions: [{ emoji: "👍", count: 2 }],
        messages: [
          {
            id: "g1",
            initials: "MW",
            color: "bg-emerald-500",
            name: "Marcus Webb",
            time: "10:31 AM",
            text: "Amazing work @sarah! The new token structure looks really clean. I love how the spacing scale is now consistent across all components.",
            reactions: [{ emoji: "👍", count: 2 }]
          },
          {
            id: "g2",
            initials: "PP",
            color: "bg-indigo-500",
            name: "Priya Patel",
            time: "10:45 AM",
            pinned: true,
            text: "Quick heads-up: team standup has moved to 10:00 AM starting next week. Calendar invites going out shortly. Please update your schedules."
          },
          {
            id: "g3",
            initials: "JK",
            color: "bg-amber-500",
            name: "Jordan Kim",
            time: "11:02 AM",
            text: "The API migration is almost done. Down to the last 3 endpoints. Should be fully wrapped up by EOD today.",
            replies: 4,
            lastReply: "Last reply 5m ago",
            replyUsers: [
              { initials: "SC", color: "bg-pink-500" },
              { initials: "MW", color: "bg-emerald-500" }
            ]
          },
          {
            id: "g4",
            initials: "AM",
            color: "bg-indigo-500",
            name: "Alex Morgan",
            time: "11:08 AM",
            text: "Great progress @jordan! Let me know if you need anything from the design side for the new API response flows."
          },
          {
            id: "g5",
            initials: "TB",
            color: "bg-red-500",
            name: "Tom Bradley",
            time: "11:30 AM",
            text: "Deployment pipeline is looking solid. Added extra health checks and rollback procedures. Detailed report attached.",
            attachment: { name: "deployment-report-march.pdf", size: "2.4 MB" }
          },
          {
            id: "g6",
            initials: "SC",
            color: "bg-pink-500",
            name: "Sarah Chen",
            time: "2:12 PM",
            text: "Reminder: design review at 3 PM today in the usual Huddle link. Everyone welcome - it should only take ~20 minutes.",
            reactions: [{ emoji: "👀", count: 4 }]
          },
          {
            id: "g7",
            initials: "MW",
            color: "bg-emerald-500",
            name: "Marcus Webb",
            time: "2:15 PM",
            text: "I'll have the wireframes ready before then. Also bringing the updated component specs for review."
          },
          {
            id: "g8",
            initials: "PP",
            color: "bg-indigo-500",
            name: "Priya Patel",
            time: "3:45 PM",
            pinned: true,
            text: "Q2 roadmap doc is now shared in Notion. Please add your team's priorities by Friday @channel",
            reactions: [
              { emoji: "✅", count: 3 },
              { emoji: "👏", count: 2 }
            ]
          }
        ]
      },
      design: {
        name: "design",
        members: 4,
        description: "Design system, Figma updates, and UI discussions",
        starCount: 1,
        showWelcome: true,
        messages: [
          {
            id: "d1",
            initials: "MW",
            color: "bg-emerald-500",
            name: "Marcus Webb",
            time: "9:15 AM",
            pinned: true,
            text: "New Figma library is live! I've restructured the component hierarchy and added proper documentation for every component.",
            reactions: [{ emoji: "🎨", count: 4 }],
            replies: 6,
            lastReply: "Last reply 1h ago",
            replyUsers: [
              { initials: "SC", color: "bg-pink-500" },
              { initials: "MW", color: "bg-emerald-500" }
            ]
          },
          {
            id: "d2",
            initials: "AM",
            color: "bg-indigo-500",
            name: "Alex Morgan",
            time: "9:30 AM",
            text: "The new color system is 🔥. Really loving how the semantic tokens map to the primitive palette. Makes dark mode trivial.",
            reactions: [{ emoji: "💯", count: 3 }]
          },
          {
            id: "d3",
            initials: "SC",
            color: "bg-pink-500",
            name: "Sarah Chen",
            time: "10:02 AM",
            text: "Implementation note: I've updated all the Tailwind tokens to match the new system. The tw-config.js changes are in the PR.",
            attachment: { name: "design-tokens-v2.json", size: "45 KB" }
          },
          {
            id: "d4",
            initials: "PP",
            color: "bg-indigo-500",
            name: "Priya Patel",
            time: "11:20 AM",
            text: "Quick question on the badge component - should we support sizes (sm/md/lg) or keep it single size for now?",
            replies: 3,
            lastReply: "Last reply 30m ago",
            replyUsers: [
              { initials: "SC", color: "bg-pink-500" },
              { initials: "MW", color: "bg-emerald-500" }
            ]
          }
        ]
      },
      engineering: {
        name: "engineering",
        members: 4,
        description: "Code reviews, deployments, and technical discussions",
        starCount: 1,
        showWelcome: true,
        messages: [
          {
            id: "e1",
            initials: "JK",
            color: "bg-amber-500",
            name: "Jordan Kim",
            time: "8:45 AM",
            text: "PR #247 is ready for review. Migrates the auth system to JWT + refresh token rotation. Includes full test coverage.",
            reactions: [{ emoji: "👀", count: 3 }],
            replies: 12,
            lastReply: "Last reply 8m ago",
            replyUsers: [
              { initials: "SC", color: "bg-pink-500" },
              { initials: "MW", color: "bg-emerald-500" }
            ]
          },
          {
            id: "e2",
            initials: "TB",
            color: "bg-red-500",
            name: "Tom Bradley",
            time: "8:50 AM",
            pinned: true,
            text: "Prod deploy went smooth at 2 AM. Zero downtime. Monitoring looks clean - P99 latency is actually down 15%.",
            reactions: [
              { emoji: "🧪", count: 5 },
              { emoji: "🚀", count: 2 }
            ]
          },
          {
            id: "e3",
            initials: "SC",
            color: "bg-pink-500",
            name: "Sarah Chen",
            time: "10:15 AM",
            text: "Reminder: we're deprecating `useOldFetch` hook end of this sprint. Please migrate to `useQuery` - docs in the wiki."
          },
          {
            id: "e4",
            initials: "JK",
            color: "bg-amber-500",
            name: "Jordan Kim",
            time: "1:30 PM",
            text: "Database indexes are updated. Read queries on the messages table should be 3x faster now. Let me know if you see any regressions.",
            reactions: [{ emoji: "⚡", count: 4 }]
          }
        ]
      },
      random: {
        name: "random",
        members: 6,
        description: "Non-work banter and fun stuff",
        starCount: 0,
        showWelcome: true,
        messages: [
          {
            id: "r1",
            initials: "MW",
            color: "bg-emerald-500",
            name: "Marcus Webb",
            time: "8:30 AM",
            text: "Just discovered this incredible coffee spot near the office. The flat white is unreal ☕",
            reactions: [{ emoji: "☕", count: 3 }]
          },
          {
            id: "r2",
            initials: "PP",
            color: "bg-indigo-500",
            name: "Priya Patel",
            time: "12:15 PM",
            text: "Anyone else watching the new Severance season? No spoilers but... 👀",
            reactions: [
              { emoji: "🍿", count: 4 },
              { emoji: "👏", count: 2 }
            ],
            replies: 7,
            lastReply: "Last reply 2h ago",
            replyUsers: [
              { initials: "SC", color: "bg-pink-500" },
              { initials: "MW", color: "bg-emerald-500" }
            ]
          },
          {
            id: "r3",
            initials: "JK",
            color: "bg-amber-500",
            name: "Jordan Kim",
            time: "2:00 PM",
            text: "PSA: the coffee machine on floor 3 is fixed 🎉",
            reactions: [{ emoji: "🎉", count: 6 }]
          }
        ]
      },
      announcements: {
        name: "announcements",
        members: 6,
        description: "Important company announcements",
        starCount: 0,
        showWelcome: true,
        typingNotice: "Marcus Webb is typing...",
        messages: []
      },
      leadership: {
        name: "leadership",
        members: 2,
        description: "Leadership team discussions",
        starCount: 0,
        showWelcome: true,
        messages: []
      }
    };
    const activeChannel = computed(() => {
      const key = channelId.value.toLowerCase();
      if (channels[key]) {
        return channels[key];
      }
      const prettyName = key.replace(/-/g, " ");
      return {
        name: key,
        members: 1,
        description: `${prettyName.charAt(0).toUpperCase()}${prettyName.slice(1)} discussions`,
        starCount: 0,
        showWelcome: true,
        messages: []
      };
    });
    const headerChannel = computed(() => ({
      name: activeChannel.value.name,
      description: activeChannel.value.description,
      members: activeChannel.value.members,
      starCount: activeChannel.value.starCount
    }));
    const chatChannel = computed(() => activeChannel.value);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "h-screen overflow-hidden bg-white text-slate-800" }, _attrs))}><div class="flex h-full">`);
      _push(ssrRenderComponent(_sfc_main$e, null, null, _parent));
      _push(ssrRenderComponent(_sfc_main$d, null, null, _parent));
      _push(`<main class="flex min-w-0 flex-1 flex-col">`);
      _push(ssrRenderComponent(unref(AppHeader), { channel: unref(headerChannel) }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$2, { channel: unref(chatChannel) }, null, _parent));
      _push(`</main>`);
      _push(ssrRenderComponent(RightPanel, null, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/workspace/[workspaceId]/channel/[channelId].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };;globalThis.__timing__.logEnd('Load chunks/build/_channelId_-D2yZ-CY1');
//# sourceMappingURL=_channelId_-D2yZ-CY1.mjs.map
