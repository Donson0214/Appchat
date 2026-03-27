globalThis.__timing__.logStart('Load chunks/build/create-_omQGvSx');import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "create",
  __ssrInlineRender: true,
  setup(__props) {
    const workspaceName = ref("");
    const errorMessage = ref("");
    const submitting = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[#f3f4f6] px-6 pt-[108px]" }, _attrs))}><div class="mx-auto w-full max-w-[420px] rounded-[10px] border border-slate-300 bg-[#f3f4f6] p-6 shadow-[0_1px_2px_rgba(15,23,42,0.07),0_6px_20px_rgba(15,23,42,0.04)]"><h1 class="text-[28px] font-semibold text-slate-900">Create your workspace</h1><p class="mt-1 text-[14px] text-slate-500">This will be your first workspace in AppChat.</p><label class="mt-6 block text-[14px] font-medium text-slate-900">Workspace name</label><input${ssrRenderAttr("value", unref(workspaceName))} type="text" placeholder="My Team" class="mt-2 h-[42px] w-full rounded-md border border-slate-300 bg-slate-50 px-3.5 text-[15px] text-slate-900 outline-none transition-all duration-200 ease-in-out placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-500/15">`);
      if (unref(errorMessage)) {
        _push(`<p class="mt-3 text-[13px] font-medium text-red-600">${ssrInterpolate(unref(errorMessage))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="button" class="mt-5 h-[42px] w-full rounded-md bg-gradient-to-r from-indigo-500 to-indigo-600 text-[15px] font-semibold text-white transition-all duration-200 ease-in-out hover:-translate-y-px hover:brightness-105"${ssrIncludeBooleanAttr(unref(submitting)) ? " disabled" : ""}>${ssrInterpolate(unref(submitting) ? "Creating..." : "Create workspace")}</button></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/workspace/create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };;globalThis.__timing__.logEnd('Load chunks/build/create-_omQGvSx');
//# sourceMappingURL=create-_omQGvSx.mjs.map
