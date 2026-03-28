globalThis.__timing__.logStart('Load chunks/build/RightPanel-B3bYzzbV');import { defineComponent, ref, computed, mergeProps, unref, watch, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrRenderSlot } from 'vue/server-renderer';
import { u as useWorkspace, a as useChannelApi } from './use-channel-api-CR8gUnIE.mjs';
import { _ as _export_sfc } from './server.mjs';
import { useRouter, useRoute } from 'vue-router';

const _sfc_main$f = /* @__PURE__ */ defineComponent({
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
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/Sidebar.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const _sfc_main$e = /* @__PURE__ */ defineComponent({
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
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/Avatar.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const _sfc_main$d = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<span${ssrRenderAttrs(mergeProps({ class: "inline-flex items-center rounded-md bg-indigo-500 px-2 py-0.5 text-xs font-semibold text-white" }, _attrs))}>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</span>`);
}
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/Badge.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const Badge = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main$c = /* @__PURE__ */ defineComponent({
  __name: "ChannelSidebar",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    const { workspace } = useWorkspace();
    const directMessages = [
      { id: "sarah-chen", name: "Sarah Chen", initials: "SC", color: "bg-pink-500", statusColor: "bg-emerald-500", unread: 2 },
      { id: "marcus-webb", name: "Marcus Webb", initials: "MW", color: "bg-emerald-500", statusColor: "bg-emerald-500" },
      { id: "jordan-kim", name: "Jordan Kim", initials: "JK", color: "bg-amber-500", statusColor: "bg-amber-400" },
      { id: "priya-patel", name: "Priya Patel", initials: "PP", color: "bg-indigo-500", statusColor: "bg-red-500" }
    ];
    const baseChannels = [
      { id: "general", slug: "general", name: "general", badge: 3 },
      { id: "announcements", slug: "announcements", name: "announcements", badge: 1 }
    ];
    const customChannels = ref([]);
    const isCreateChannelOpen = ref(false);
    const newChannelName = ref("");
    const newChannelPrivate = ref(false);
    const inviteEmailsRaw = ref("");
    const createChannelError = ref("");
    const createChannelSubmitting = ref(false);
    const activeChannel = computed(() => String(route.params.channelId ?? "general"));
    const activeDirectMessage = computed(() => String(route.params.memberId ?? ""));
    computed(() => String(route.params.workspaceId ?? workspace.value.id ?? ""));
    const channels = computed(() => [...baseChannels, ...customChannels.value]);
    const { fetchChannels } = useChannelApi();
    computed(() => `appchat_channels_${workspace.value.id || "acme"}`);
    const saveCustomChannels = () => {
      return;
    };
    watch(
      () => workspace.value.id,
      () => {
        void refreshChannelsFromApi();
      }
    );
    const refreshChannelsFromApi = async () => {
      if (!workspace.value.id || workspace.value.id === "local-default") {
        return;
      }
      try {
        const fromApi = await fetchChannels(workspace.value.id);
        const normalized = fromApi.map((item) => ({
          id: item.id,
          slug: item.slug,
          name: item.name,
          private: item.private,
          custom: !baseChannels.some((base) => base.name === item.name)
        }));
        customChannels.value = normalized.filter((item) => item.custom);
        saveCustomChannels();
      } catch {
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex-1 overflow-y-auto px-2.5 py-3" }, _attrs))}><nav class="space-y-1 text-[16px] text-[#4b5565]"><button class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors duration-150 hover:bg-slate-200/70"><svg viewBox="0 0 20 20" class="h-4 w-4 fill-current text-slate-500"><path d="m10 3 6 6v7.2a.8.8 0 0 1-.8.8h-2.9a.8.8 0 0 1-.8-.8V13h-3v3.2a.8.8 0 0 1-.8.8H4.8a.8.8 0 0 1-.8-.8V9l6-6Zm0 2.2L6 9v6h1.9V11.8c0-.4.3-.8.8-.8h3c.4 0 .8.4.8.8V15H14V9l-4-3.8Z"></path></svg><span>Home</span></button><button class="flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left transition-colors duration-150 hover:bg-slate-200/70"><span class="flex items-center gap-2.5"><svg viewBox="0 0 20 20" class="h-4 w-4 fill-current text-indigo-500"><path d="M3.2 4.5h13.6c.4 0 .7.3.7.7v9.6a.7.7 0 0 1-.7.7H3.2a.7.7 0 0 1-.7-.7V5.2c0-.4.3-.7.7-.7Zm1.3 1.4v1.9H2.5v4.4h2v1.9h11v-1.9h2V7.8h-2V5.9h-11Z"></path></svg><span>Inbox</span></span>`);
      _push(ssrRenderComponent(Badge, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`18`);
          } else {
            return [
              createTextVNode("18")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</button></nav><div class="mt-5"><p class="mb-1.5 flex items-center gap-2 px-2 text-[13px] font-bold tracking-[0.08em] text-[#64748b]"><svg viewBox="0 0 20 20" class="h-3.5 w-3.5 fill-current"><path d="M5.3 7.7a1 1 0 0 1 1.4 0L10 11l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z"></path></svg><span>CHANNELS</span></p><div class="space-y-0.5 text-[17px] text-[#475569]"><!--[-->`);
      ssrRenderList(channels.value, (channel) => {
        _push(`<button type="button" class="${ssrRenderClass([channel.id === activeChannel.value || channel.slug === activeChannel.value ? "bg-indigo-100 text-indigo-600" : "hover:bg-slate-200/70", "flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left transition-colors duration-150"])}"><span class="flex min-w-0 items-center gap-2.5">`);
        if (channel.private) {
          _push(`<svg viewBox="0 0 20 20" class="h-4 w-4 shrink-0 fill-current text-slate-400"><path d="M10 1.8a4 4 0 0 0-4 4v2H5a2 2 0 0 0-2 2v6.4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9.8a2 2 0 0 0-2-2h-1v-2a4 4 0 0 0-4-4Zm2.3 6V5.8a2.3 2.3 0 0 0-4.6 0v2h4.6Z"></path></svg>`);
        } else {
          _push(`<span class="text-[30px] leading-none">#</span>`);
        }
        _push(`<span class="${ssrRenderClass([channel.private ? "" : "", "truncate"])}">${ssrInterpolate(channel.name)}</span></span>`);
        if (channel.badge) {
          _push(ssrRenderComponent(Badge, null, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(channel.badge)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(channel.badge), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</button>`);
      });
      _push(`<!--]--><button type="button" class="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-slate-400 transition-colors duration-150 hover:bg-slate-200/70"><span class="text-[22px] leading-none">+</span><span>Add channel</span></button></div></div><div class="mt-5"><p class="mb-2 flex items-center gap-2 px-2 text-[13px] font-bold tracking-[0.08em] text-slate-500"><svg viewBox="0 0 20 20" class="h-3.5 w-3.5 fill-current"><path d="M5.3 7.7a1 1 0 0 1 1.4 0L10 11l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z"></path></svg> DIRECT MESSAGES </p><div class="space-y-1"><!--[-->`);
      ssrRenderList(directMessages, (person) => {
        _push(`<button type="button" class="${ssrRenderClass([activeDirectMessage.value === person.id ? "bg-indigo-100" : "", "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left transition-colors duration-150 hover:bg-slate-200/70"])}"><span class="flex items-center gap-2.5"><span class="relative">`);
        _push(ssrRenderComponent(_sfc_main$e, {
          size: "sm",
          color: person.color,
          initials: person.initials
        }, null, _parent));
        _push(`<span class="${ssrRenderClass([person.statusColor, "absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#f8fafc]"])}"></span></span><span class="${ssrRenderClass([activeDirectMessage.value === person.id ? "text-indigo-600" : "text-slate-700", "text-[17px]"])}">${ssrInterpolate(person.name)}</span></span>`);
        if (person.unread) {
          _push(ssrRenderComponent(Badge, null, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(person.unread)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(person.unread), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</button>`);
      });
      _push(`<!--]--><button class="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-slate-400 transition-colors duration-150 hover:bg-slate-200/70"><span class="text-[20px] leading-none">+</span><span>New direct message</span></button></div></div>`);
      if (isCreateChannelOpen.value) {
        _push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30"><div class="w-[420px] rounded-lg border border-slate-200 bg-white p-5 shadow-[0_18px_36px_rgba(15,23,42,0.22)]"><h3 class="text-[20px] font-semibold text-[#1d1c1d]">Create a channel</h3><p class="mt-1 text-[14px] text-[#616061]">Channels are where your team communicates.</p><label class="mt-4 block text-[14px] font-medium text-[#1d1c1d]">Channel name</label><input${ssrRenderAttr("value", newChannelName.value)} type="text" class="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 text-[15px] text-[#1d1c1d] outline-none transition-colors focus:border-indigo-500" placeholder="e.g. product-updates"><label class="mt-3 flex cursor-pointer items-center gap-3 rounded-md border border-slate-200 px-3 py-2.5 hover:bg-slate-50"><input${ssrIncludeBooleanAttr(Array.isArray(newChannelPrivate.value) ? ssrLooseContain(newChannelPrivate.value, null) : newChannelPrivate.value) ? " checked" : ""} type="checkbox" class="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"><div><p class="text-[14px] font-medium text-[#1d1c1d]">Make private</p><p class="text-[12px] text-[#616061]">Only invited members can access this channel.</p></div></label><label class="mt-3 block text-[14px] font-medium text-[#1d1c1d]">Invite emails (optional)</label><input${ssrRenderAttr("value", inviteEmailsRaw.value)} type="text" class="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 text-[14px] text-[#1d1c1d] outline-none transition-colors focus:border-indigo-500" placeholder="e.g. sarah@company.com, jordan@company.com">`);
        if (createChannelError.value) {
          _push(`<p class="mt-2 text-[12px] font-medium text-red-600">${ssrInterpolate(createChannelError.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="mt-4 flex justify-end gap-2"><button type="button" class="rounded-md px-3 py-2 text-[14px] font-medium text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"${ssrIncludeBooleanAttr(createChannelSubmitting.value) ? " disabled" : ""}> Cancel </button><button type="button" class="rounded-md bg-indigo-600 px-4 py-2 text-[14px] font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"${ssrIncludeBooleanAttr(!newChannelName.value.trim() || createChannelSubmitting.value) ? " disabled" : ""}>${ssrInterpolate(createChannelSubmitting.value ? "Creating..." : "Create channel")}</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/ChannelSidebar.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const _sfc_main$b = /* @__PURE__ */ defineComponent({
  __name: "WorkspaceSidebar",
  __ssrInlineRender: true,
  setup(__props) {
    const { workspace, workspaces, workspaceInitial } = useWorkspace();
    useChannelApi();
    useRouter();
    const isWorkspaceMenuOpen = ref(false);
    ref(null);
    const badgeColors = ["bg-indigo-500", "bg-emerald-500", "bg-amber-500", "bg-pink-500", "bg-cyan-500"];
    const workspaceOptions = computed(() => {
      const source = workspaces.value.length ? workspaces.value : [{ id: workspace.value.id, name: workspace.value.name, slug: workspace.value.slug, role: workspace.value.role }];
      return source.map((item, index) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        members: "workspace",
        roleLabel: (item.role || "member").toLowerCase(),
        badgeColor: badgeColors[index % badgeColors.length]
      }));
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex h-full w-[292px] flex-col border-r border-slate-300 bg-[#f8fafc]" }, _attrs))}><div class="relative flex h-[84px] items-center justify-between border-b border-slate-300 px-4"><button type="button" class="flex items-center gap-3 rounded-md p-1 transition-colors duration-200 hover:bg-slate-100"><div class="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-500 text-[20px] font-semibold text-white">${ssrInterpolate(unref(workspaceInitial))}</div><p class="text-[40px] font-semibold leading-none text-slate-900">${ssrInterpolate(unref(workspace).name)}</p></button><button type="button" class="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors duration-200 hover:bg-slate-200/70"><svg viewBox="0 0 20 20" class="h-4 w-4 fill-current"><path d="M5.3 7.7a1 1 0 0 1 1.4 0L10 11l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z"></path></svg></button>`);
      if (isWorkspaceMenuOpen.value) {
        _push(`<div class="absolute left-4 top-[72px] z-50 w-[220px] overflow-hidden rounded-md border border-slate-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.2)]"><div class="p-2"><!--[-->`);
        ssrRenderList(workspaceOptions.value, (item) => {
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
      _push(ssrRenderComponent(_sfc_main$c, null, null, _parent));
      _push(`<div class="mt-auto flex h-[66px] items-center justify-between border-t border-slate-300 px-5 text-slate-500"><div class="flex items-center gap-4"><button class="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-200 hover:bg-slate-200/70"><svg viewBox="0 0 20 20" class="h-5 w-5 fill-current"><path d="M10 2.5a.8.8 0 0 1 .7 1.2 5.8 5.8 0 1 0 5.6 8.5.8.8 0 0 1 1.4.7A7.4 7.4 0 1 1 10 2.5Z"></path></svg></button><button class="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-200 hover:bg-slate-200/70"><svg viewBox="0 0 20 20" class="h-5 w-5 fill-current"><path d="M8.5 2.5h3l.3 1.8a5.8 5.8 0 0 1 1.5.9l1.7-.8 2.1 2.1-.8 1.7c.4.5.7 1 .9 1.5l1.8.3v3l-1.8.3a5.8 5.8 0 0 1-.9 1.5l.8 1.7-2.1 2.1-1.7-.8c-.5.4-1 .7-1.5.9l-.3 1.8h-3l-.3-1.8a5.8 5.8 0 0 1-1.5-.9l-1.7.8-2.1-2.1.8-1.7a5.8 5.8 0 0 1-.9-1.5L1 11.5v-3l1.8-.3c.2-.5.5-1 .9-1.5L2.9 5l2.1-2.1 1.7.8c.5-.4 1-.7 1.5-.9l.3-1.8Zm1.5 5.3a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4Z"></path></svg></button><button class="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-200 hover:bg-slate-200/70"><svg viewBox="0 0 20 20" class="h-5 w-5 fill-current"><path d="M6.8 9a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm6.4 1.2a2.6 2.6 0 1 1 0-5.2 2.6 2.6 0 0 1 0 5.2ZM2.5 15.7A4.7 4.7 0 0 1 7.2 11h.7a4.7 4.7 0 0 1 4.7 4.7v.8H2.5v-.8Zm10.2.8v-.8c0-1.2-.4-2.3-1-3.2.4-.1.8-.2 1.3-.2h.4a4 4 0 0 1 4 4v.2h-4.7Z"></path></svg></button></div><button class="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-200 hover:bg-slate-200/70"><svg viewBox="0 0 20 20" class="h-5 w-5 fill-current"><path d="M11 3.5a1 1 0 1 1 2 0v2h2.5a2 2 0 0 1 2 2V14a2 2 0 0 1-2 2H13v2a1 1 0 1 1-2 0v-2h-3a1 1 0 0 1 0-2h6.5a.5.5 0 0 0 .5-.5V7.5a.5.5 0 0 0-.5-.5H8A1 1 0 1 1 8 5h3V3.5ZM4.3 6.3a1 1 0 0 1 1.4 0l2.5 2.5a1 1 0 1 1-1.4 1.4L6 9.4V15a1 1 0 1 1-2 0V9.4l-.8.8a1 1 0 0 1-1.4-1.4l2.5-2.5Z"></path></svg></button></div></div>`);
    };
  }
});
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/WorkspaceSidebar.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const _sfc_main$a = /* @__PURE__ */ defineComponent({
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
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/NotificationPanel.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
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
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "relative flex h-[92px] items-center justify-between border-b border-slate-300 px-6" }, _attrs))}><div><div class="flex items-center gap-3">`);
      if (__props.channel.isDirectMessage) {
        _push(`<!--[--><h1 class="text-[38px] font-semibold leading-none tracking-[-0.015em] text-[#1D1C1D]">${ssrInterpolate(__props.channel.name)}</h1><span class="inline-flex h-6 items-center rounded-md bg-emerald-500 px-2.5 text-[14px] font-semibold leading-none text-white">${ssrInterpolate(__props.channel.presenceLabel || "online")}</span><!--]-->`);
      } else {
        _push(`<!--[--><h1 class="text-[28px] font-semibold leading-none tracking-[-0.015em] text-[#1D1C1D]">#${ssrInterpolate(__props.channel.name)}</h1><span class="pt-0.5 text-[16px] font-normal text-[#8f95a3]">${ssrInterpolate(__props.channel.members)} members</span><!--]-->`);
      }
      _push(`</div><p class="mt-1 text-[16px] font-normal leading-6 text-[#8f95a3]">${ssrInterpolate(__props.channel.description)}</p></div><div class="flex items-center gap-4 text-[#64748b]">`);
      if (!__props.channel.isDirectMessage) {
        _push(`<button class="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[#64748b] transition-colors duration-150 hover:bg-slate-100 hover:text-[#334155]"><svg viewBox="0 0 20 20" class="h-[15px] w-[15px] fill-current"><path d="M9.1 2.7c.3-.9 1.5-.9 1.8 0l1.4 3.3 3.6.3c1 .1 1.4 1.3.6 2l-2.8 2.3.9 3.5c.2 1-.8 1.7-1.7 1.2L10 13.4 6.9 15.3c-.8.5-1.9-.2-1.6-1.2l.9-3.5-2.8-2.3c-.8-.7-.4-1.9.6-2L7.6 6l1.5-3.3Z"></path></svg><span class="text-[14px] font-medium leading-none">${ssrInterpolate(__props.channel.starCount)}</span></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="button" class="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-150 hover:bg-slate-100"><svg viewBox="0 0 20 20" class="h-5 w-5 fill-current"><path d="M8.6 3a5.6 5.6 0 1 1-3.9 9.6L2.6 15a1 1 0 1 0 1.4 1.4l2.1-2.1A5.6 5.6 0 0 1 8.6 3Zm0 1.8a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Z"></path></svg></button><button type="button" class="relative inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-150 hover:bg-slate-100"><svg viewBox="0 0 20 20" class="h-5 w-5 fill-current"><path d="M10 2.5a5 5 0 0 0-5 5V9c0 .8-.3 1.5-.9 2.1l-.2.2A1.3 1.3 0 0 0 4.8 14h10.4a1.3 1.3 0 0 0 .9-2.2l-.2-.2A3 3 0 0 1 15 9V7.5a5 5 0 0 0-5-5Zm0 15a2.3 2.3 0 0 0 2.2-1.8H7.8A2.3 2.3 0 0 0 10 17.5Z"></path></svg><span class="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-indigo-500"></span></button><button class="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-150 hover:bg-slate-100"><svg viewBox="0 0 20 20" class="h-5 w-5 fill-current"><path d="M3 7.2a2.2 2.2 0 0 1 2.2-2.2h6.6A2.2 2.2 0 0 1 14 7.2v5.6a2.2 2.2 0 0 1-2.2 2.2H5.2A2.2 2.2 0 0 1 3 12.8V7.2Zm12.3.4 2.8-1.5A1.3 1.3 0 0 1 20 7.2v5.6a1.3 1.3 0 0 1-1.9 1.1l-2.8-1.5V7.6Z"></path></svg></button></div>`);
      if (isNotificationOpen.value) {
        _push(`<div class="absolute right-4 top-[84px] z-30">`);
        _push(ssrRenderComponent(_sfc_main$a, {
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
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/Header.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "MessageInput",
  __ssrInlineRender: true,
  props: {
    channelName: { default: "general" },
    isDirectMessage: { type: Boolean, default: false }
  },
  emits: ["send"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const draft = ref("");
    const placeholderText = computed(
      () => props.isDirectMessage ? `Message ${props.channelName}` : `Message #${props.channelName}`
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "border-t border-slate-300 px-6 pb-6 pt-3" }, _attrs))}><div class="rounded-md border border-slate-300 bg-white"><div class="flex items-center gap-4 border-b border-slate-200 px-5 py-3 text-slate-400"><button class="text-[16px] font-semibold text-slate-500">B</button><button class="text-[16px]">I</button><span class="h-5 w-px bg-slate-300"></span><button class="inline-flex h-5 w-5 items-center justify-center"><svg viewBox="0 0 20 20" class="h-4 w-4 fill-current"><path d="M7.2 13.8a3 3 0 0 1 0-4.3L9 7.6a3 3 0 0 1 4.2 4.3l-.6.6a1 1 0 1 1-1.4-1.4l.6-.6a1 1 0 1 0-1.4-1.4L8.6 11a1 1 0 1 0 1.4 1.4l.4-.4a1 1 0 1 1 1.4 1.4l-.4.4a3 3 0 0 1-4.2 0Zm5.6-7.6a3 3 0 0 1 0 4.2L11 12.3a3 3 0 1 1-4.2-4.3l.6-.6a1 1 0 1 1 1.4 1.4l-.6.6a1 1 0 1 0 1.4 1.4l1.8-1.8a1 1 0 0 0-1.4-1.4l-.4.4A1 1 0 1 1 8.2 6.6l.4-.4a3 3 0 0 1 4.2 0Z"></path></svg></button><button class="inline-flex h-5 w-5 items-center justify-center"><svg viewBox="0 0 20 20" class="h-4 w-4 fill-current"><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h9A1.5 1.5 0 0 1 16 5.5v1A1.5 1.5 0 0 1 14.5 8h-9A1.5 1.5 0 0 1 4 6.5v-1ZM4 10.5A1.5 1.5 0 0 1 5.5 9h9a1.5 1.5 0 1 1 0 3h-9A1.5 1.5 0 0 1 4 10.5ZM5.5 14a1.5 1.5 0 1 0 0 3h9a1.5 1.5 0 1 0 0-3h-9Z"></path></svg></button><button class="inline-flex h-5 w-5 items-center justify-center"><svg viewBox="0 0 20 20" class="h-4 w-4 fill-current"><path d="M6.2 5.2a1 1 0 0 1 1.4 0L10 7.6l2.4-2.4a1 1 0 0 1 1.4 1.4L11.4 9l2.4 2.4a1 1 0 0 1-1.4 1.4L10 10.4l-2.4 2.4a1 1 0 0 1-1.4-1.4L8.6 9 6.2 6.6a1 1 0 0 1 0-1.4Z"></path></svg></button></div><textarea class="h-[86px] w-full resize-none bg-transparent px-5 py-4 text-[16px] font-normal leading-7 text-slate-700 placeholder:font-normal placeholder:text-slate-400 focus:outline-none"${ssrRenderAttr("placeholder", placeholderText.value)}>${ssrInterpolate(draft.value)}</textarea><div class="flex items-center justify-between px-4 pb-4 text-slate-400"><div class="flex items-center gap-4"><button class="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-200 hover:bg-slate-100"><svg viewBox="0 0 20 20" class="h-5 w-5 fill-current"><path d="M6.3 2.5a3 3 0 0 1 3 3v7.8a1.7 1.7 0 1 0 3.4 0V5.7a3.7 3.7 0 1 0-7.4 0v7.8a5.4 5.4 0 0 0 10.8 0V8a1 1 0 1 1 2 0v5.4a7.4 7.4 0 1 1-14.8 0V5.7a5.7 5.7 0 1 1 11.4 0v7.6a3.7 3.7 0 1 1-7.4 0V5.5a1 1 0 0 1 2 0v7.8a1.7 1.7 0 1 0 3.4 0V5.7a3 3 0 0 0-3-3Z"></path></svg></button><button class="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-200 hover:bg-slate-100"><svg viewBox="0 0 20 20" class="h-5 w-5 fill-current"><path d="M10 2.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15Zm0 2a5.5 5.5 0 0 1 4.4 8.8h-8.8A5.5 5.5 0 0 1 10 4.5Zm0 11a5.5 5.5 0 0 1-2.8-.8h5.6a5.5 5.5 0 0 1-2.8.8Zm-2.2-5a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Zm4.4 0a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Z"></path></svg></button><button class="inline-flex h-8 w-8 items-center justify-center rounded-md text-[26px] leading-none transition-colors duration-200 hover:bg-slate-100">@</button></div><button type="button" class="inline-flex h-11 w-11 items-center justify-center rounded-md bg-indigo-300 text-[18px] text-white transition-all duration-200 ease-in-out hover:-translate-y-px hover:brightness-105"><svg viewBox="0 0 20 20" class="h-5 w-5 fill-current"><path d="M2.4 10.8 15.5 4c1-.5 2 .5 1.5 1.5L10.2 18.6c-.4.8-1.6.7-1.8-.2L7 12.8 1.4 11.8c-.9-.2-1.1-1.4 0-1.8Zm5.2.2.8 3.1 4.4-8.5L7.6 11Z"></path></svg></button></div></div></div>`);
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/chat/MessageInput.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "MessageAvatar",
  __ssrInlineRender: true,
  props: {
    initials: {},
    color: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$e, mergeProps({
        size: "md",
        color: __props.color,
        initials: __props.initials,
        class: "mt-0.5"
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/chat/MessageAvatar.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
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
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/chat/MessageContent.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
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
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/chat/MessageMeta.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "MessageReactions",
  __ssrInlineRender: true,
  props: {
    reactions: {},
    replies: {},
    lastReply: {},
    replyUsers: {}
  },
  emits: ["open-thread"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mt-2 flex flex-wrap items-center gap-2" }, _attrs))}><!--[-->`);
      ssrRenderList(__props.reactions, (reaction) => {
        _push(`<button class="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-[14px] font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-100" type="button"><span class="text-[16px] leading-none">${ssrInterpolate(reaction.emoji)}</span><span>${ssrInterpolate(reaction.count)}</span></button>`);
      });
      _push(`<!--]-->`);
      if (__props.replies) {
        _push(`<button type="button" class="inline-flex items-center gap-1 text-[15px] leading-6"><!--[-->`);
        ssrRenderList(__props.replyUsers, (reply) => {
          _push(`<span class="${ssrRenderClass([reply.color, "inline-flex h-7 w-7 items-center justify-center rounded-md text-[12px] font-semibold text-white"])}">${ssrInterpolate(reply.initials)}</span>`);
        });
        _push(`<!--]--><span class="ml-1 font-semibold text-indigo-600">${ssrInterpolate(__props.replies)} replies</span><span class="font-normal text-slate-400">${ssrInterpolate(__props.lastReply)}</span></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/chat/MessageReactions.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "MessageItem",
  __ssrInlineRender: true,
  props: {
    message: {}
  },
  emits: ["open-thread"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const openThread = () => {
      emit("open-thread", props.message);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<article${ssrRenderAttrs(mergeProps({ class: "group relative -mx-2 rounded-md px-2 py-1.5 transition-colors duration-150 hover:bg-slate-100/80" }, _attrs))}><div class="flex gap-3.5">`);
      _push(ssrRenderComponent(_sfc_main$7, {
        initials: __props.message.initials,
        color: __props.message.color
      }, null, _parent));
      _push(`<div class="min-w-0 flex-1 pr-40">`);
      _push(ssrRenderComponent(_sfc_main$5, {
        name: __props.message.name,
        time: __props.message.time,
        pinned: __props.message.pinned
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$6, {
        text: __props.message.text
      }, null, _parent));
      if (__props.message.attachment) {
        _push(`<div class="mt-2 inline-flex min-w-[280px] items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2"><div class="flex items-center gap-3"><span class="inline-flex h-8 w-8 items-center justify-center rounded-md bg-violet-100 text-violet-400"><svg viewBox="0 0 20 20" class="h-4 w-4 fill-current"><path d="M5 2.8A1.8 1.8 0 0 0 3.2 4.6v10.8A1.8 1.8 0 0 0 5 17.2h10a1.8 1.8 0 0 0 1.8-1.8V7.8l-5-5H5Zm6 1.7 4.1 4.1h-2.6a1.5 1.5 0 0 1-1.5-1.5V4.5Z"></path></svg></span><div><p class="max-w-[240px] truncate text-[15px] font-medium text-[#1d1c1d]">${ssrInterpolate(__props.message.attachment.name)}</p><p class="text-[13px] text-[#8f95a3]">${ssrInterpolate(__props.message.attachment.size)}</p></div></div><button type="button" class="inline-flex h-7 w-7 items-center justify-center rounded-md text-[#8f95a3] transition-colors hover:bg-white hover:text-[#616061]"><svg viewBox="0 0 20 20" class="h-4 w-4 fill-current"><path d="M9 3a1 1 0 0 1 2 0v7.6l2.1-2.2a1 1 0 0 1 1.4 1.4l-3.8 3.9a1 1 0 0 1-1.4 0L5.5 9.8a1 1 0 1 1 1.4-1.4L9 10.6V3Zm-5 11.5a1 1 0 0 1 1 1v.3c0 .1.1.2.2.2h9.6a.2.2 0 0 0 .2-.2v-.3a1 1 0 1 1 2 0v.3a2.2 2.2 0 0 1-2.2 2.2H5.2A2.2 2.2 0 0 1 3 15.8v-.3a1 1 0 0 1 1-1Z"></path></svg></button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_sfc_main$4, {
        reactions: __props.message.reactions,
        replies: __props.message.replies,
        "last-reply": __props.message.lastReply,
        "reply-users": __props.message.replyUsers,
        onOpenThread: openThread
      }, null, _parent));
      _push(`</div></div><div class="pointer-events-none absolute right-2 top-2 opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100"><div class="inline-flex items-center gap-0.5 rounded-md border border-slate-200 bg-white p-1 shadow-[0_1px_6px_rgba(15,23,42,0.12)]"><button type="button" class="inline-flex h-6 w-6 items-center justify-center rounded text-[#94a3b8] hover:bg-slate-100 hover:text-[#475569]" title="Add reaction"><svg viewBox="0 0 20 20" class="h-4 w-4 fill-current"><path d="M10 2.8a7.2 7.2 0 1 0 0 14.4 7.2 7.2 0 0 0 0-14.4Zm0 1.9a5.3 5.3 0 0 1 4.2 8.5H5.8A5.3 5.3 0 0 1 10 4.7Zm0 10.6a5.3 5.3 0 0 1-2.6-.7h5.2a5.3 5.3 0 0 1-2.6.7Zm-2-5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm4 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path></svg></button><button type="button" class="inline-flex h-6 w-6 items-center justify-center rounded text-[#94a3b8] hover:bg-slate-100 hover:text-[#475569]" title="Reply in thread"><svg viewBox="0 0 20 20" class="h-4 w-4 fill-current"><path d="M3.5 4.8A1.8 1.8 0 0 1 5.3 3h9.4a1.8 1.8 0 0 1 1.8 1.8v6.4a1.8 1.8 0 0 1-1.8 1.8H9.2l-3.6 3a.8.8 0 0 1-1.3-.6V13A1.8 1.8 0 0 1 2.5 11.2V4.8h1Z"></path></svg></button><button type="button" class="inline-flex h-6 w-6 items-center justify-center rounded text-[#94a3b8] hover:bg-slate-100 hover:text-[#475569]" title="Save"><svg viewBox="0 0 20 20" class="h-4 w-4 fill-current"><path d="M5 3h10a1 1 0 0 1 1 1v13a.8.8 0 0 1-1.3.6L10 14l-4.7 3.6A.8.8 0 0 1 4 17V4a1 1 0 0 1 1-1Z"></path></svg></button><button type="button" class="inline-flex h-6 w-6 items-center justify-center rounded text-[#94a3b8] hover:bg-slate-100 hover:text-[#475569]" title="More actions"><svg viewBox="0 0 20 20" class="h-4 w-4 fill-current"><path d="M4.5 8.8a1.3 1.3 0 1 1 0 2.5 1.3 1.3 0 0 1 0-2.5Zm5.5 0a1.3 1.3 0 1 1 0 2.5 1.3 1.3 0 0 1 0-2.5Zm5.5 0a1.3 1.3 0 1 1 0 2.5 1.3 1.3 0 0 1 0-2.5Z"></path></svg></button></div></div></article>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/chat/MessageItem.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
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
  emits: ["open-thread"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
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
        _push(ssrRenderComponent(_sfc_main$3, {
          key: message.id,
          message,
          onOpenThread: ($event) => emit("open-thread", $event)
        }, null, _parent));
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/chat/MessageList.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ChatContainer",
  __ssrInlineRender: true,
  props: {
    channel: {}
  },
  emits: ["send-message", "open-thread"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const onSend = (content) => {
      emit("send-message", content);
    };
    const onOpenThread = (message) => {
      emit("open-thread", message);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex min-h-0 flex-1 flex-col" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$2, {
        "channel-name": __props.channel.name,
        "channel-description": __props.channel.description,
        "show-welcome": __props.channel.showWelcome,
        "show-top-reactions": __props.channel.showTopReactions,
        "typing-notice": __props.channel.typingNotice,
        "top-reactions": __props.channel.topReactions,
        messages: __props.channel.messages,
        onOpenThread
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$8, {
        "channel-name": __props.channel.name,
        "is-direct-message": __props.channel.isDirectMessage,
        onSend
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/chat/ChatContainer.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "RightPanel",
  __ssrInlineRender: true,
  props: {
    isOpen: { type: Boolean },
    threadMessage: {}
  },
  emits: ["close"],
  setup(__props) {
    const props = __props;
    const tabs = ["Thread", "Profile", "Pinned", "Search"];
    const activeTab = ref("Thread");
    watch(
      () => props.threadMessage?.id,
      () => {
        activeTab.value = "Thread";
      }
    );
    const computedReplies = computed(() => {
      const root = props.threadMessage;
      if (!root) return [];
      const fallback = [
        {
          id: `${root.id}-r1`,
          initials: "MW",
          color: "bg-emerald-500",
          name: "Marcus Webb",
          time: "10:35 AM",
          text: "This is huge! The auto-layout changes alone will save hours of work.",
          reactions: [{ emoji: "💯", count: 2 }]
        },
        {
          id: `${root.id}-r2`,
          initials: "PP",
          color: "bg-indigo-500",
          name: "Priya Patel",
          time: "10:40 AM",
          text: "Love the new color token names — much more semantic than before."
        },
        {
          id: `${root.id}-r3`,
          initials: "JK",
          color: "bg-amber-500",
          name: "Jordan Kim",
          time: "10:52 AM",
          text: "Can we schedule a quick sync to walk through the implementation guide?"
        },
        {
          id: `${root.id}-r4`,
          initials: "SC",
          color: "bg-pink-500",
          name: "Sarah Chen",
          time: "11:01 AM",
          text: "Absolutely! How does Thursday 2 PM sound? I can do a live walkthrough.",
          reactions: [{ emoji: "👍", count: 3 }]
        }
      ];
      const count = Math.max(1, Math.min(root.replies ?? 4, fallback.length));
      return fallback.slice(0, count);
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.isOpen) {
        _push(`<aside${ssrRenderAttrs(mergeProps({ class: "flex h-full w-[380px] flex-col border-l border-slate-300 bg-white" }, _attrs))}><div class="flex h-[52px] items-center justify-between border-b border-slate-200 px-3"><div class="flex items-center gap-1"><!--[-->`);
        ssrRenderList(tabs, (tab) => {
          _push(`<button type="button" class="${ssrRenderClass([activeTab.value === tab ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:bg-slate-50", "rounded-md px-3 py-1.5 text-[14px] font-medium transition-colors duration-150"])}">${ssrInterpolate(tab)}</button>`);
        });
        _push(`<!--]--></div><button type="button" class="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"><svg viewBox="0 0 20 20" class="h-4 w-4 fill-current"><path d="M5.3 5.3a1 1 0 0 1 1.4 0L10 8.6l3.3-3.3a1 1 0 1 1 1.4 1.4L11.4 10l3.3 3.3a1 1 0 0 1-1.4 1.4L10 11.4l-3.3 3.3a1 1 0 1 1-1.4-1.4l3.3-3.3-3.3-3.3a1 1 0 0 1 0-1.4Z"></path></svg></button></div><div class="flex-1 overflow-y-auto px-4 py-4">`);
        if (activeTab.value === "Thread" && __props.threadMessage) {
          _push(`<!--[--><article class="flex gap-3"><span class="${ssrRenderClass([__props.threadMessage.color, "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[16px] font-semibold text-white"])}">${ssrInterpolate(__props.threadMessage.initials)}</span><div class="min-w-0"><div class="flex items-baseline gap-2"><p class="text-[17px] font-semibold leading-tight text-[#1d1c1d]">${ssrInterpolate(__props.threadMessage.name)}</p><span class="text-[14px] font-normal text-[#9ca3af]">${ssrInterpolate(__props.threadMessage.time)}</span></div><p class="mt-1 text-[16px] leading-[1.35] text-[#1d1c1d]">${ssrInterpolate(__props.threadMessage.text)}</p>`);
          if (__props.threadMessage.reactions?.length) {
            _push(`<div class="mt-3 flex flex-wrap items-center gap-2"><!--[-->`);
            ssrRenderList(__props.threadMessage.reactions, (reaction) => {
              _push(`<button type="button" class="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[14px] font-medium text-slate-600"><span class="text-[15px]">${ssrInterpolate(reaction.emoji)}</span><span>${ssrInterpolate(reaction.count)}</span></button>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></article><div class="my-4 border-t border-slate-200"></div><p class="mb-3 text-[15px] font-medium text-slate-400">${ssrInterpolate(computedReplies.value.length)} replies</p><div class="space-y-4"><!--[-->`);
          ssrRenderList(computedReplies.value, (reply) => {
            _push(`<article class="flex gap-3"><span class="${ssrRenderClass([reply.color, "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[15px] font-semibold text-white"])}">${ssrInterpolate(reply.initials)}</span><div class="min-w-0"><div class="flex items-baseline gap-2"><p class="text-[17px] font-semibold leading-tight text-[#1d1c1d]">${ssrInterpolate(reply.name)}</p><span class="text-[14px] text-[#9ca3af]">${ssrInterpolate(reply.time)}</span></div><p class="mt-1 text-[16px] leading-[1.35] text-[#1d1c1d]">${ssrInterpolate(reply.text)}</p>`);
            if (reply.reactions?.length) {
              _push(`<div class="mt-2 flex items-center gap-2"><!--[-->`);
              ssrRenderList(reply.reactions, (reaction) => {
                _push(`<button type="button" class="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[14px] font-medium text-slate-600"><span class="text-[15px]">${ssrInterpolate(reaction.emoji)}</span><span>${ssrInterpolate(reaction.count)}</span></button>`);
              });
              _push(`<!--]--></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></article>`);
          });
          _push(`<!--]--></div><!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="border-t border-slate-200 p-3"><div class="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2"><input type="text" class="h-8 flex-1 bg-transparent text-[15px] text-slate-700 outline-none placeholder:text-slate-400" placeholder="Reply in thread..."><button class="inline-flex h-9 w-9 items-center justify-center rounded-md bg-indigo-300 text-white"><svg viewBox="0 0 20 20" class="h-4 w-4 fill-current"><path d="M2.4 10.8 15.5 4c1-.5 2 .5 1.5 1.5L10.2 18.6c-.4.8-1.6.7-1.8-.2L7 12.8 1.4 11.8c-.9-.2-1.1-1.4 0-1.8Zm5.2.2.8 3.1 4.4-8.5L7.6 11Z"></path></svg></button></div></div></aside>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/RightPanel.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main$f as _, _sfc_main$b as a, _sfc_main$9 as b, _sfc_main$1 as c, _sfc_main as d };;globalThis.__timing__.logEnd('Load chunks/build/RightPanel-B3bYzzbV');
//# sourceMappingURL=RightPanel-B3bYzzbV.mjs.map
