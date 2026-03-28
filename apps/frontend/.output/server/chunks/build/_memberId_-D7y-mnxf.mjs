globalThis.__timing__.logStart('Load chunks/build/_memberId_-D7y-mnxf');import { defineComponent, computed, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
import { _ as _sfc_main$f, a as _sfc_main$b, b as _sfc_main$9, c as _sfc_main$1, d as _sfc_main$2 } from './RightPanel-B3bYzzbV.mjs';
import { u as useWorkspace } from './use-channel-api-CR8gUnIE.mjs';
import './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[memberId]",
  __ssrInlineRender: true,
  setup(__props) {
    const AppHeader = _sfc_main$9;
    const route = useRoute();
    const { loadWorkspace } = useWorkspace();
    loadWorkspace();
    const memberId = computed(() => String(route.params.memberId ?? "sarah-chen"));
    const directMessages = {
      "sarah-chen": {
        memberId: "sarah-chen",
        name: "Sarah Chen",
        role: "Senior Frontend Engineer",
        presenceLabel: "online",
        messages: [
          {
            id: "dm-1",
            initials: "SC",
            color: "bg-pink-500",
            name: "Sarah Chen",
            time: "9:45 AM",
            text: "Hey! Can you review the new button variants I pushed?"
          },
          {
            id: "dm-2",
            initials: "AM",
            color: "bg-indigo-500",
            name: "Alex Morgan",
            time: "9:47 AM",
            text: "On it! Will check in 10 mins"
          },
          {
            id: "dm-3",
            initials: "SC",
            color: "bg-pink-500",
            name: "Sarah Chen",
            time: "9:48 AM",
            text: "No rush, whenever works. Also - are we still on for the design sync at 3?"
          }
        ]
      },
      "marcus-webb": {
        memberId: "marcus-webb",
        name: "Marcus Webb",
        role: "Staff Product Designer",
        presenceLabel: "online",
        messages: [
          {
            id: "dm-4",
            initials: "MW",
            color: "bg-emerald-500",
            name: "Marcus Webb",
            time: "10:05 AM",
            text: "Pushed updated channel icon set. Want me to wire it into the sidebar now?"
          }
        ]
      },
      "jordan-kim": {
        memberId: "jordan-kim",
        name: "Jordan Kim",
        role: "Backend Engineer",
        presenceLabel: "away",
        messages: [
          {
            id: "dm-5",
            initials: "JK",
            color: "bg-amber-500",
            name: "Jordan Kim",
            time: "11:11 AM",
            text: "Will share endpoint contracts in an hour."
          }
        ]
      },
      "priya-patel": {
        memberId: "priya-patel",
        name: "Priya Patel",
        role: "Product Manager",
        presenceLabel: "dnd",
        messages: [
          {
            id: "dm-6",
            initials: "PP",
            color: "bg-indigo-500",
            name: "Priya Patel",
            time: "1:02 PM",
            text: "Can you join the roadmap sync at 4?"
          }
        ]
      }
    };
    const activeConversation = computed(() => {
      return directMessages[memberId.value] ?? {
        memberId: memberId.value,
        name: memberId.value.replace(/-/g, " ").replace(/\b\w/g, (s) => s.toUpperCase()),
        role: "Workspace Member",
        presenceLabel: "online",
        messages: []
      };
    });
    const liveMessages = ref([]);
    const headerChannel = computed(() => ({
      name: activeConversation.value.name,
      description: activeConversation.value.role,
      isDirectMessage: true,
      presenceLabel: activeConversation.value.presenceLabel
    }));
    const chatChannel = computed(() => ({
      name: activeConversation.value.name,
      description: activeConversation.value.role,
      isDirectMessage: true,
      messages: [...activeConversation.value.messages, ...liveMessages.value]
    }));
    const handleSendMessage = (content) => {
      liveMessages.value = [
        ...liveMessages.value,
        {
          id: `local-${Date.now()}`,
          initials: "AM",
          color: "bg-indigo-500",
          name: "Alex Morgan",
          time: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
          text: content
        }
      ];
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "h-screen overflow-hidden bg-white text-slate-800" }, _attrs))}><div class="flex h-full">`);
      _push(ssrRenderComponent(_sfc_main$f, null, null, _parent));
      _push(ssrRenderComponent(_sfc_main$b, null, null, _parent));
      _push(`<main class="flex min-w-0 flex-1 flex-col">`);
      _push(ssrRenderComponent(unref(AppHeader), { channel: headerChannel.value }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        channel: chatChannel.value,
        onSendMessage: handleSendMessage
      }, null, _parent));
      _push(`</main>`);
      _push(ssrRenderComponent(_sfc_main$2, null, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/workspace/[workspaceId]/dm/[memberId].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };;globalThis.__timing__.logEnd('Load chunks/build/_memberId_-D7y-mnxf');
//# sourceMappingURL=_memberId_-D7y-mnxf.mjs.map
