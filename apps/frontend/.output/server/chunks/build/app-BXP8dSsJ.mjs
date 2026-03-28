globalThis.__timing__.logStart('Load chunks/build/app-BXP8dSsJ');import { defineComponent, withAsyncContext, useSSRContext } from 'vue';
import { n as navigateTo } from './server.mjs';
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
import 'vue/server-renderer';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "app",
  async setup(__props) {
    let __temp, __restore;
    {
      [__temp, __restore] = withAsyncContext(() => navigateTo("/workspace/create", { replace: true })), await __temp, __restore();
    }
    return () => {
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };;globalThis.__timing__.logEnd('Load chunks/build/app-BXP8dSsJ');
//# sourceMappingURL=app-BXP8dSsJ.mjs.map
