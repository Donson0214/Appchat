globalThis.__timing__.logStart('Load chunks/build/create-Dw2KNElC');import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { u as useWorkspace, a as useChannelApi } from './use-channel-api-CR8gUnIE.mjs';
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
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "create",
  __ssrInlineRender: true,
  setup(__props) {
    const mode = ref("create");
    const workspaceName = ref("");
    const joinCode = ref("");
    const errorMessage = ref("");
    const submitting = ref(false);
    useWorkspace();
    useChannelApi();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[#f3f4f6] px-6 pt-[108px]" }, _attrs))}><div class="mx-auto w-full max-w-[420px] rounded-[10px] border border-slate-300 bg-[#f3f4f6] p-6 shadow-[0_1px_2px_rgba(15,23,42,0.07),0_6px_20px_rgba(15,23,42,0.04)]"><div class="mb-5 grid grid-cols-2 gap-2 rounded-md bg-slate-200/70 p-1"><button type="button" class="${ssrRenderClass([unref(mode) === "create" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700", "h-9 rounded-md text-[14px] font-semibold transition-colors"])}"> Create </button><button type="button" class="${ssrRenderClass([unref(mode) === "join" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700", "h-9 rounded-md text-[14px] font-semibold transition-colors"])}"> Join by code </button></div>`);
      if (unref(mode) === "create") {
        _push(`<!--[--><h1 class="text-[28px] font-semibold text-slate-900">Create your workspace</h1><p class="mt-1 text-[14px] text-slate-500">This will be your first workspace in AppChat.</p><label class="mt-6 block text-[14px] font-medium text-slate-900">Workspace name</label><input${ssrRenderAttr("value", unref(workspaceName))} type="text" placeholder="My Team" class="mt-2 h-[42px] w-full rounded-md border border-slate-300 bg-slate-50 px-3.5 text-[15px] text-slate-900 outline-none transition-all duration-200 ease-in-out placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-500/15">`);
        if (unref(errorMessage)) {
          _push(`<p class="mt-3 text-[13px] font-medium text-red-600">${ssrInterpolate(unref(errorMessage))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button type="button" class="mt-5 h-[42px] w-full rounded-md bg-gradient-to-r from-indigo-500 to-indigo-600 text-[15px] font-semibold text-white transition-all duration-200 ease-in-out hover:-translate-y-px hover:brightness-105"${ssrIncludeBooleanAttr(unref(submitting)) ? " disabled" : ""}>${ssrInterpolate(unref(submitting) ? "Creating..." : "Create workspace")}</button><!--]-->`);
      } else {
        _push(`<!--[--><h1 class="text-[28px] font-semibold text-slate-900">Join a workspace</h1><p class="mt-1 text-[14px] text-slate-500">Enter your workspace invite code to join.</p><label class="mt-6 block text-[14px] font-medium text-slate-900">Invite code</label><input${ssrRenderAttr("value", unref(joinCode))} type="text" placeholder="e.g. AB12CD34" class="mt-2 h-[42px] w-full rounded-md border border-slate-300 bg-slate-50 px-3.5 text-[15px] uppercase tracking-[0.08em] text-slate-900 outline-none transition-all duration-200 ease-in-out placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-500/15">`);
        if (unref(errorMessage)) {
          _push(`<p class="mt-3 text-[13px] font-medium text-red-600">${ssrInterpolate(unref(errorMessage))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button type="button" class="mt-5 h-[42px] w-full rounded-md bg-gradient-to-r from-indigo-500 to-indigo-600 text-[15px] font-semibold text-white transition-all duration-200 ease-in-out hover:-translate-y-px hover:brightness-105"${ssrIncludeBooleanAttr(unref(submitting)) ? " disabled" : ""}>${ssrInterpolate(unref(submitting) ? "Joining..." : "Join workspace")}</button><!--]-->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/workspace/create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };;globalThis.__timing__.logEnd('Load chunks/build/create-Dw2KNElC');
//# sourceMappingURL=create-Dw2KNElC.mjs.map
