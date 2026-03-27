globalThis.__timing__.logStart('Load chunks/build/app-m58F0Zma');import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    const workspaceText = ref("No workspace found");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[#f3f4f6] px-6 pt-[108px]" }, _attrs))}><div class="mx-auto w-full max-w-[520px] rounded-[10px] border border-slate-300 bg-[#f3f4f6] p-6 shadow-[0_1px_2px_rgba(15,23,42,0.07),0_6px_20px_rgba(15,23,42,0.04)]"><h1 class="text-[28px] font-semibold text-slate-900">Workspace Home</h1><p class="mt-1 text-[15px] text-slate-600">${ssrInterpolate(unref(workspaceText))}</p><div class="mt-6 flex gap-3"><button type="button" class="h-[40px] rounded-md border border-slate-300 px-4 text-[14px] font-medium text-slate-700"> Change workspace </button><button type="button" class="h-[40px] rounded-md bg-slate-900 px-4 text-[14px] font-medium text-white"> Log out </button></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };;globalThis.__timing__.logEnd('Load chunks/build/app-m58F0Zma');
//# sourceMappingURL=app-m58F0Zma.mjs.map
