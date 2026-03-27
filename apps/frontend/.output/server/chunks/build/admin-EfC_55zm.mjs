globalThis.__timing__.logStart('Load chunks/build/admin-EfC_55zm');import { defineComponent, ref, computed, reactive, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderAttr } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "admin",
  __ssrInlineRender: true,
  setup(__props) {
    const tabs = [
      { key: "members", label: "Members", count: 6 },
      { key: "roles", label: "Roles" },
      { key: "permissions", label: "Permissions" },
      { key: "audit", label: "Audit Log", count: 6 }
    ];
    const activeTab = ref("members");
    const search = ref("");
    const workspaceName = computed(() => {
      return "Acme Inc";
    });
    const statCards = [
      { label: "Total members", value: "47", meta: "+3 this month" },
      { label: "Active today", value: "12", meta: "25% of team" },
      { label: "Channels", value: "6", meta: "1 private" },
      { label: "Messages today", value: "142", meta: "+18% vs yesterday" }
    ];
    const members = reactive([
      { initials: "AM", color: "bg-indigo-500", dotColor: "bg-emerald-500", name: "Alex Morgan", email: "alex.morgan@acme.io", role: "Admin", status: "Online", statusDot: "bg-emerald-500", you: true },
      { initials: "SC", color: "bg-pink-500", dotColor: "bg-emerald-500", name: "Sarah Chen", email: "sarah.chen@acme.io", role: "Member", status: "Online", statusDot: "bg-emerald-500", you: false },
      { initials: "JK", color: "bg-amber-500", dotColor: "bg-amber-400", name: "Jordan Kim", email: "jordan.kim@acme.io", role: "Member", status: "Away", statusDot: "bg-amber-400", you: false },
      { initials: "MW", color: "bg-emerald-500", dotColor: "bg-emerald-500", name: "Marcus Webb", email: "marcus.webb@acme.io", role: "Member", status: "Online", statusDot: "bg-emerald-500", you: false },
      { initials: "PP", color: "bg-violet-500", dotColor: "bg-red-500", name: "Priya Patel", email: "priya.patel@acme.io", role: "Member", status: "Dnd", statusDot: "bg-red-500", you: false },
      { initials: "TB", color: "bg-red-500", dotColor: "bg-slate-300", name: "Tom Bradley", email: "tom.bradley@contractor.com", role: "Guest", status: "Offline", statusDot: "bg-slate-400", you: false }
    ]);
    const filteredMembers = computed(() => {
      const q = search.value.trim().toLowerCase();
      if (!q) return members;
      return members.filter((m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q));
    });
    const roles = [
      { badge: "A", name: "Admin", count: "1 user", badgeColor: "bg-indigo-500", description: "Full access to workspace settings, member management, and all channels." },
      { badge: "M", name: "Member", count: "4 users", badgeColor: "bg-slate-500", description: "Can send messages, create channels, and access public content." },
      { badge: "G", name: "Guest", count: "1 user", badgeColor: "bg-amber-500", description: "Limited access - can view and reply in designated channels only." }
    ];
    const permissionGroups = reactive([
      {
        title: "Member",
        items: [
          { label: "Can invite members", description: "Allow members to send workspace invitations", enabled: true },
          { label: "Can create channels", description: "Allow members to create public channels", enabled: true },
          { label: "Can delete own messages", description: "Allow members to delete their own messages", enabled: false }
        ]
      },
      {
        title: "Guest",
        items: [
          { label: "Can view files", description: "Allow guests to view shared files", enabled: true },
          { label: "Can add reactions", description: "Allow guests to react to messages", enabled: true },
          { label: "Can send DMs", description: "Allow guests to send direct messages", enabled: false }
        ]
      }
    ]);
    const auditLogs = [
      { icon: "?", iconColor: "bg-indigo-500", title: "Updated channel permissions", meta: "#engineering", userInitials: "SC", userColor: "bg-pink-500", user: "Sarah Chen", time: "2m ago" },
      { icon: "�", iconColor: "bg-emerald-500", title: "Invited new member", meta: "tom.bradley@contractor.com", userInitials: "AM", userColor: "bg-indigo-500", user: "Alex Morgan", time: "1h ago" },
      { icon: "?", iconColor: "bg-indigo-500", title: "Changed workspace name", meta: '"Acme Inc"', userInitials: "PP", userColor: "bg-violet-500", user: "Priya Patel", time: "3h ago" },
      { icon: "?", iconColor: "bg-red-500", title: "Deleted message", meta: "#random", userInitials: "JK", userColor: "bg-amber-500", user: "Jordan Kim", time: "5h ago" },
      { icon: "?", iconColor: "bg-amber-500", title: "Role changed: tom ? guest", meta: "Tom Bradley", userInitials: "AM", userColor: "bg-indigo-500", user: "Alex Morgan", time: "1d ago" },
      { icon: "#", iconColor: "bg-indigo-500", title: "Created private channel", meta: "#design-2.0", userInitials: "SC", userColor: "bg-pink-500", user: "Sarah Chen", time: "2d ago" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[#f8fafc] text-[#0f172a]" }, _attrs))}><header class="flex h-[46px] items-center border-b border-slate-200 bg-white"><button type="button" class="inline-flex h-full items-center gap-2 border-r border-slate-200 px-4 text-[13px] font-medium text-slate-500 transition-colors duration-150 hover:bg-slate-50"><svg viewBox="0 0 20 20" class="h-4 w-4 fill-current"><path d="M11.8 4.4a1 1 0 0 1 0 1.4L7.6 10l4.2 4.2a1 1 0 0 1-1.4 1.4L5.5 10.7a1 1 0 0 1 0-1.4l4.9-4.9a1 1 0 0 1 1.4 0Z"></path></svg><span>Back to AppChat</span></button><div class="flex items-center gap-2 px-4 text-[13px] font-semibold text-[#111827]"><span class="inline-flex h-5 w-5 items-center justify-center rounded-md bg-indigo-500 text-[11px] font-semibold text-white">A</span><span>${ssrInterpolate(unref(workspaceName))} - Admin Panel</span></div></header><main class="mx-auto max-w-[940px] px-6 py-8"><h1 class="text-[38px] font-semibold leading-none text-[#111827]">Admin Panel</h1><p class="mt-2 text-[14px] text-slate-500">Manage your workspace members, roles, and permissions.</p><section class="mt-6 grid grid-cols-4 gap-3"><!--[-->`);
      ssrRenderList(statCards, (card) => {
        _push(`<article class="rounded-lg border border-slate-200 bg-white p-4"><p class="text-[12px] font-medium text-slate-400">${ssrInterpolate(card.label)}</p><p class="mt-1 text-[34px] font-semibold leading-none text-slate-900">${ssrInterpolate(card.value)}</p><p class="mt-2 text-[12px] text-slate-400">${ssrInterpolate(card.meta)}</p></article>`);
      });
      _push(`<!--]--></section><nav class="mt-6 flex items-center gap-3 border-b border-slate-200 pb-0.5 text-[14px] text-slate-500"><!--[-->`);
      ssrRenderList(tabs, (tab) => {
        _push(`<button type="button" class="${ssrRenderClass([unref(activeTab) === tab.key ? "border-indigo-500 text-indigo-600" : "border-transparent hover:text-slate-700", "flex items-center gap-2 border-b-2 px-3 py-2.5 font-medium transition-colors"])}"><span>${ssrInterpolate(tab.label)}</span>`);
        if (tab.count !== void 0) {
          _push(`<span class="inline-flex h-5 min-w-5 items-center justify-center rounded-md bg-slate-100 px-1 text-[12px] text-slate-500">${ssrInterpolate(tab.count)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button>`);
      });
      _push(`<!--]--></nav>`);
      if (unref(activeTab) === "members") {
        _push(`<section class="pt-4"><div class="flex items-center gap-2"><label class="relative block flex-1"><svg viewBox="0 0 20 20" class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 fill-slate-300"><path d="M8.7 2a6.7 6.7 0 1 1 0 13.4A6.7 6.7 0 0 1 8.7 2Zm0 1.8a4.9 4.9 0 1 0 0 9.8 4.9 4.9 0 0 0 0-9.8Zm9 11.6 1.8 1.8a.9.9 0 0 1-1.3 1.3l-1.8-1.8a.9.9 0 0 1 1.3-1.3Z"></path></svg><input${ssrRenderAttr("value", unref(search))} type="text" placeholder="Search members..." class="h-8 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-[13px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-indigo-400"></label><button class="inline-flex h-8 items-center rounded-md bg-indigo-500 px-4 text-[13px] font-semibold text-white transition-colors hover:bg-indigo-600">+ Invite member</button></div><div class="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white"><table class="w-full border-collapse text-left"><thead class="bg-[#fbfcfd] text-[12px] uppercase tracking-[0.03em] text-slate-500"><tr><th class="px-4 py-3 font-semibold">Member</th><th class="px-4 py-3 font-semibold">Role</th><th class="px-4 py-3 font-semibold">Status</th><th class="px-4 py-3 font-semibold">Actions</th></tr></thead><tbody><!--[-->`);
        ssrRenderList(unref(filteredMembers), (member) => {
          _push(`<tr class="border-t border-slate-200 text-[14px]"><td class="px-4 py-3"><div class="flex items-center gap-3"><div class="${ssrRenderClass([member.color, "relative h-8 w-8 rounded-md"])}"><span class="flex h-full w-full items-center justify-center text-[13px] font-semibold text-white">${ssrInterpolate(member.initials)}</span><span class="${ssrRenderClass([member.dotColor, "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-white"])}"></span></div><div><p class="font-medium text-slate-900">${ssrInterpolate(member.name)} `);
          if (member.you) {
            _push(`<span class="text-[12px] text-slate-400">(you)</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</p><p class="text-[12px] text-slate-400">${ssrInterpolate(member.email)}</p></div></div></td><td class="px-4 py-3"><select class="${ssrRenderClass([member.role === "Guest" ? "border-amber-300 bg-amber-50 text-amber-600" : "border-slate-200 bg-slate-50 text-slate-600", "h-6 rounded-md border px-2 text-[13px] outline-none"])}"><option>${ssrInterpolate(member.role)}</option><option>Admin</option><option>Member</option><option>Guest</option></select></td><td class="px-4 py-3"><div class="flex items-center gap-2 text-[13px] text-slate-600"><span class="${ssrRenderClass([member.statusDot, "h-2 w-2 rounded-full"])}"></span><span>${ssrInterpolate(member.status)}</span></div></td><td class="px-4 py-3 text-[13px]"><button class="text-slate-600 hover:text-slate-800">Message</button>`);
          if (!member.you) {
            _push(`<button class="ml-4 text-red-500 hover:text-red-600">Remove</button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</td></tr>`);
        });
        _push(`<!--]--></tbody></table></div><p class="mt-2 text-[12px] text-slate-400">${ssrInterpolate(unref(filteredMembers).length)} of ${ssrInterpolate(unref(members).length)} members shown</p></section>`);
      } else if (unref(activeTab) === "roles") {
        _push(`<section class="pt-4"><div class="grid grid-cols-3 gap-3"><!--[-->`);
        ssrRenderList(roles, (role) => {
          _push(`<article class="rounded-lg border border-slate-200 bg-white p-4"><div class="flex items-center justify-between"><div class="flex items-center gap-3"><span class="${ssrRenderClass([role.badgeColor, "inline-flex h-6 w-6 items-center justify-center rounded-md text-[12px] font-semibold text-white"])}">${ssrInterpolate(role.badge)}</span><p class="text-[14px] font-semibold text-slate-900">${ssrInterpolate(role.name)}</p></div><p class="text-[12px] text-slate-400">${ssrInterpolate(role.count)}</p></div><p class="mt-2 text-[13px] leading-6 text-slate-500">${ssrInterpolate(role.description)}</p></article>`);
        });
        _push(`<!--]--></div></section>`);
      } else if (unref(activeTab) === "permissions") {
        _push(`<section class="pt-4 space-y-4"><!--[-->`);
        ssrRenderList(unref(permissionGroups), (group) => {
          _push(`<div><p class="inline-flex rounded-md border border-slate-200 bg-[#fbfcfd] px-2 py-1 text-[12px] font-medium text-slate-500">${ssrInterpolate(group.title)} permissions</p><div class="mt-2 overflow-hidden rounded-lg border border-slate-200 bg-white"><!--[-->`);
          ssrRenderList(group.items, (permission) => {
            _push(`<div class="flex items-center justify-between border-b border-slate-200 px-4 py-3 last:border-b-0"><div><p class="text-[14px] font-medium text-slate-900">${ssrInterpolate(permission.label)}</p><p class="text-[12px] text-slate-400">${ssrInterpolate(permission.description)}</p></div><button type="button" class="${ssrRenderClass([permission.enabled ? "bg-indigo-500" : "bg-slate-200", "relative h-6 w-9 rounded-full transition-colors"])}"><span class="${ssrRenderClass([permission.enabled ? "left-[18px]" : "left-[2px]", "absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white transition-all"])}"></span></button></div>`);
          });
          _push(`<!--]--></div></div>`);
        });
        _push(`<!--]--></section>`);
      } else {
        _push(`<section class="pt-4"><div class="overflow-hidden rounded-lg border border-slate-200 bg-white"><table class="w-full border-collapse text-left"><thead class="bg-[#fbfcfd] text-[12px] uppercase tracking-[0.03em] text-slate-500"><tr><th class="px-4 py-3 font-semibold">Event</th><th class="px-4 py-3 font-semibold">User</th><th class="px-4 py-3 font-semibold">Date</th></tr></thead><tbody><!--[-->`);
        ssrRenderList(auditLogs, (log) => {
          _push(`<tr class="border-t border-slate-200 text-[14px]"><td class="px-4 py-3"><div class="flex items-start gap-2"><span class="${ssrRenderClass([log.iconColor, "mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] text-white"])}">${ssrInterpolate(log.icon)}</span><div><p class="text-slate-900">${ssrInterpolate(log.title)}</p><p class="text-[12px] text-slate-400">${ssrInterpolate(log.meta)}</p></div></div></td><td class="px-4 py-3"><div class="flex items-center gap-2"><span class="${ssrRenderClass([log.userColor, "inline-flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-semibold text-white"])}">${ssrInterpolate(log.userInitials)}</span><span class="text-slate-700">${ssrInterpolate(log.user)}</span></div></td><td class="px-4 py-3 text-slate-400">${ssrInterpolate(log.time)}</td></tr>`);
        });
        _push(`<!--]--></tbody></table></div></section>`);
      }
      _push(`</main></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };;globalThis.__timing__.logEnd('Load chunks/build/admin-EfC_55zm');
//# sourceMappingURL=admin-EfC_55zm.mjs.map
