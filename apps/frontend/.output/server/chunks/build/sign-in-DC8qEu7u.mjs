globalThis.__timing__.logStart('Load chunks/build/sign-in-DC8qEu7u');import { defineComponent, ref, mergeProps, withCtx, unref, createVNode, openBlock, createBlock, createTextVNode, toDisplayString, createCommentVNode, withDirectives, isRef, vModelText, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { u as useGoogleAuth, a as useAuthApi, _ as _sfc_main$1, g as getPostAuthRedirectPath } from './use-google-auth-BX_2bTw9.mjs';
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
import 'firebase/auth';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "sign-in",
  __ssrInlineRender: true,
  setup(__props) {
    const googleLoading = ref(false);
    const submitLoading = ref(false);
    const errorMessage = ref("");
    const email = ref("");
    const password = ref("");
    const { signInWithGoogle } = useGoogleAuth();
    const { loginWithEmail } = useAuthApi();
    const handleGoogleSignIn = async () => {
      try {
        googleLoading.value = true;
        errorMessage.value = "";
        const { redirectTo } = await signInWithGoogle();
        await navigateTo(redirectTo);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Google sign-in failed";
        errorMessage.value = message;
      } finally {
        googleLoading.value = false;
      }
    };
    const handleEmailSignIn = async () => {
      try {
        submitLoading.value = true;
        errorMessage.value = "";
        await loginWithEmail({
          email: email.value.trim().toLowerCase(),
          password: password.value
        });
        await navigateTo(getPostAuthRedirectPath());
      } catch (error) {
        errorMessage.value = error?.data?.message ?? "Email sign-in failed";
      } finally {
        submitLoading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({
        subtitle: "Sign in to your workspace",
        "bottom-text": "Don't have an account?",
        "bottom-link-label": "Sign up",
        "bottom-link-to": "/sign-up"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<button class="inline-flex h-[40px] w-full items-center justify-center gap-2.5 rounded-md border border-slate-300 bg-slate-50 text-[16px] font-medium text-slate-800 transition-all duration-200 ease-in-out hover:bg-white active:translate-y-px" type="button"${ssrIncludeBooleanAttr(unref(googleLoading)) ? " disabled" : ""}${_scopeId}><span class="inline-flex h-5 w-5 items-center justify-center" aria-hidden="true"${_scopeId}><svg class="h-[18px] w-[18px]" viewBox="0 0 24 24"${_scopeId}><path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.25-.95 2.3-2.02 3.02l3.26 2.52c1.9-1.75 3-4.32 3-7.4 0-.72-.07-1.4-.2-2.05z"${_scopeId}></path><path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.63-2.45l-3.26-2.52c-.9.6-2.05.97-3.37.97-2.6 0-4.8-1.75-5.58-4.1H3.06v2.58A10 10 0 0 0 12 22z"${_scopeId}></path><path fill="#4A90E2" d="M6.42 13.9A6 6 0 0 1 6.1 12c0-.66.12-1.3.32-1.9V7.52H3.06A10 10 0 0 0 2 12c0 1.62.4 3.15 1.06 4.48z"${_scopeId}></path><path fill="#FBBC05" d="M12 5.98c1.47 0 2.8.5 3.85 1.5l2.88-2.88C16.96 2.98 14.7 2 12 2A10 10 0 0 0 3.06 7.52l3.36 2.58C7.2 7.75 9.4 5.98 12 5.98z"${_scopeId}></path></svg></span> ${ssrInterpolate(unref(googleLoading) ? "Signing in..." : "Continue with Google")}</button><button class="inline-flex h-[40px] w-full items-center justify-center gap-2.5 rounded-md border border-slate-300 bg-slate-50 text-[16px] font-medium text-slate-800 transition-all duration-200 ease-in-out hover:bg-white active:translate-y-px" type="button"${_scopeId}><span class="inline-flex h-5 w-5 items-center justify-center" aria-hidden="true"${_scopeId}><svg class="h-[18px] w-[18px]" viewBox="0 0 24 24"${_scopeId}><path fill="#24292F" d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.77-.24.77-.54v-2.1c-3.12.68-3.78-1.32-3.78-1.32a2.98 2.98 0 0 0-1.25-1.64c-1.02-.7.08-.68.08-.68a2.36 2.36 0 0 1 1.72 1.15 2.4 2.4 0 0 0 3.27.93 2.4 2.4 0 0 1 .7-1.52c-2.48-.28-5.08-1.24-5.08-5.53 0-1.23.44-2.24 1.16-3.04a4.09 4.09 0 0 1 .11-3s.94-.3 3.08 1.16a10.7 10.7 0 0 1 5.6 0c2.13-1.46 3.07-1.16 3.07-1.16.42.97.46 2.06.11 3 .72.8 1.16 1.81 1.16 3.04 0 4.3-2.6 5.24-5.1 5.51.4.34.76 1.03.76 2.08v3.1c0 .3.2.65.78.53A11.2 11.2 0 0 0 12 .8"${_scopeId}></path></svg></span> Continue with GitHub </button>`);
            if (unref(errorMessage)) {
              _push2(`<p class="text-[13px] font-medium text-red-600"${_scopeId}>${ssrInterpolate(unref(errorMessage))}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="my-4 flex w-full items-center gap-3 text-[14px] text-slate-400"${_scopeId}><span class="h-px flex-1 bg-slate-300/60"${_scopeId}></span><span${_scopeId}>or</span><span class="h-px flex-1 bg-slate-300/60"${_scopeId}></span></div><label class="mt-1 text-[15px] font-medium leading-tight text-slate-900"${_scopeId}>Email</label><input class="h-[40px] w-full rounded-md border border-slate-300 bg-slate-50 px-3.5 text-[16px] text-slate-900 outline-none transition-all duration-200 ease-in-out placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-500/15" type="email" placeholder="you@company.com"${ssrRenderAttr("value", unref(email))}${_scopeId}><div class="mt-0.5 flex items-center justify-between"${_scopeId}><label class="text-[15px] font-medium leading-tight text-slate-900"${_scopeId}>Password</label><a class="text-[12px] font-medium text-indigo-600" href="#"${_scopeId}>Forgot password?</a></div><input class="h-[40px] w-full rounded-md border border-slate-300 bg-slate-50 px-3.5 text-[16px] text-slate-900 outline-none transition-all duration-200 ease-in-out placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-500/15" type="password" placeholder="••••••••"${ssrRenderAttr("value", unref(password))}${_scopeId}><button class="mt-2 h-[40px] w-full rounded-md bg-gradient-to-r from-indigo-500 to-indigo-600 text-[16px] font-semibold text-white transition-all duration-200 ease-in-out hover:-translate-y-px hover:brightness-105 hover:shadow-[0_8px_16px_rgba(99,102,241,0.24)] active:translate-y-0 active:shadow-[0_3px_8px_rgba(99,102,241,0.20)]" type="button"${ssrIncludeBooleanAttr(unref(submitLoading)) ? " disabled" : ""}${_scopeId}>${ssrInterpolate(unref(submitLoading) ? "Signing in..." : "Sign in")}</button>`);
          } else {
            return [
              createVNode("button", {
                class: "inline-flex h-[40px] w-full items-center justify-center gap-2.5 rounded-md border border-slate-300 bg-slate-50 text-[16px] font-medium text-slate-800 transition-all duration-200 ease-in-out hover:bg-white active:translate-y-px",
                type: "button",
                disabled: unref(googleLoading),
                onClick: handleGoogleSignIn
              }, [
                createVNode("span", {
                  class: "inline-flex h-5 w-5 items-center justify-center",
                  "aria-hidden": "true"
                }, [
                  (openBlock(), createBlock("svg", {
                    class: "h-[18px] w-[18px]",
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", {
                      fill: "#EA4335",
                      d: "M12 10.2v3.9h5.5c-.24 1.25-.95 2.3-2.02 3.02l3.26 2.52c1.9-1.75 3-4.32 3-7.4 0-.72-.07-1.4-.2-2.05z"
                    }),
                    createVNode("path", {
                      fill: "#34A853",
                      d: "M12 22c2.7 0 4.97-.9 6.63-2.45l-3.26-2.52c-.9.6-2.05.97-3.37.97-2.6 0-4.8-1.75-5.58-4.1H3.06v2.58A10 10 0 0 0 12 22z"
                    }),
                    createVNode("path", {
                      fill: "#4A90E2",
                      d: "M6.42 13.9A6 6 0 0 1 6.1 12c0-.66.12-1.3.32-1.9V7.52H3.06A10 10 0 0 0 2 12c0 1.62.4 3.15 1.06 4.48z"
                    }),
                    createVNode("path", {
                      fill: "#FBBC05",
                      d: "M12 5.98c1.47 0 2.8.5 3.85 1.5l2.88-2.88C16.96 2.98 14.7 2 12 2A10 10 0 0 0 3.06 7.52l3.36 2.58C7.2 7.75 9.4 5.98 12 5.98z"
                    })
                  ]))
                ]),
                createTextVNode(" " + toDisplayString(unref(googleLoading) ? "Signing in..." : "Continue with Google"), 1)
              ], 8, ["disabled"]),
              createVNode("button", {
                class: "inline-flex h-[40px] w-full items-center justify-center gap-2.5 rounded-md border border-slate-300 bg-slate-50 text-[16px] font-medium text-slate-800 transition-all duration-200 ease-in-out hover:bg-white active:translate-y-px",
                type: "button"
              }, [
                createVNode("span", {
                  class: "inline-flex h-5 w-5 items-center justify-center",
                  "aria-hidden": "true"
                }, [
                  (openBlock(), createBlock("svg", {
                    class: "h-[18px] w-[18px]",
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", {
                      fill: "#24292F",
                      d: "M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.77-.24.77-.54v-2.1c-3.12.68-3.78-1.32-3.78-1.32a2.98 2.98 0 0 0-1.25-1.64c-1.02-.7.08-.68.08-.68a2.36 2.36 0 0 1 1.72 1.15 2.4 2.4 0 0 0 3.27.93 2.4 2.4 0 0 1 .7-1.52c-2.48-.28-5.08-1.24-5.08-5.53 0-1.23.44-2.24 1.16-3.04a4.09 4.09 0 0 1 .11-3s.94-.3 3.08 1.16a10.7 10.7 0 0 1 5.6 0c2.13-1.46 3.07-1.16 3.07-1.16.42.97.46 2.06.11 3 .72.8 1.16 1.81 1.16 3.04 0 4.3-2.6 5.24-5.1 5.51.4.34.76 1.03.76 2.08v3.1c0 .3.2.65.78.53A11.2 11.2 0 0 0 12 .8"
                    })
                  ]))
                ]),
                createTextVNode(" Continue with GitHub ")
              ]),
              unref(errorMessage) ? (openBlock(), createBlock("p", {
                key: 0,
                class: "text-[13px] font-medium text-red-600"
              }, toDisplayString(unref(errorMessage)), 1)) : createCommentVNode("", true),
              createVNode("div", { class: "my-4 flex w-full items-center gap-3 text-[14px] text-slate-400" }, [
                createVNode("span", { class: "h-px flex-1 bg-slate-300/60" }),
                createVNode("span", null, "or"),
                createVNode("span", { class: "h-px flex-1 bg-slate-300/60" })
              ]),
              createVNode("label", { class: "mt-1 text-[15px] font-medium leading-tight text-slate-900" }, "Email"),
              withDirectives(createVNode("input", {
                class: "h-[40px] w-full rounded-md border border-slate-300 bg-slate-50 px-3.5 text-[16px] text-slate-900 outline-none transition-all duration-200 ease-in-out placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-500/15",
                type: "email",
                placeholder: "you@company.com",
                "onUpdate:modelValue": ($event) => isRef(email) ? email.value = $event : null
              }, null, 8, ["onUpdate:modelValue"]), [
                [vModelText, unref(email)]
              ]),
              createVNode("div", { class: "mt-0.5 flex items-center justify-between" }, [
                createVNode("label", { class: "text-[15px] font-medium leading-tight text-slate-900" }, "Password"),
                createVNode("a", {
                  class: "text-[12px] font-medium text-indigo-600",
                  href: "#"
                }, "Forgot password?")
              ]),
              withDirectives(createVNode("input", {
                class: "h-[40px] w-full rounded-md border border-slate-300 bg-slate-50 px-3.5 text-[16px] text-slate-900 outline-none transition-all duration-200 ease-in-out placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-500/15",
                type: "password",
                placeholder: "••••••••",
                "onUpdate:modelValue": ($event) => isRef(password) ? password.value = $event : null
              }, null, 8, ["onUpdate:modelValue"]), [
                [vModelText, unref(password)]
              ]),
              createVNode("button", {
                class: "mt-2 h-[40px] w-full rounded-md bg-gradient-to-r from-indigo-500 to-indigo-600 text-[16px] font-semibold text-white transition-all duration-200 ease-in-out hover:-translate-y-px hover:brightness-105 hover:shadow-[0_8px_16px_rgba(99,102,241,0.24)] active:translate-y-0 active:shadow-[0_3px_8px_rgba(99,102,241,0.20)]",
                type: "button",
                disabled: unref(submitLoading),
                onClick: handleEmailSignIn
              }, toDisplayString(unref(submitLoading) ? "Signing in..." : "Sign in"), 9, ["disabled"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/sign-in.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };;globalThis.__timing__.logEnd('Load chunks/build/sign-in-DC8qEu7u');
//# sourceMappingURL=sign-in-DC8qEu7u.mjs.map
