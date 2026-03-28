globalThis.__timing__.logStart('Load chunks/build/use-google-auth-BqGWFBY2');import { defineComponent, mergeProps, withCtx, createTextVNode, toDisplayString, shallowRef, h, resolveComponent, computed, unref, useSSRContext } from 'vue';
import { y as parseQuery, n as hasProtocol, k as joinURL, z as withTrailingSlash, A as withoutTrailingSlash } from '../_/nitro.mjs';
import { u as useNuxtApp, a as useRuntimeConfig, b as useRouter, e as encodeRoutePath, r as resolveRouteObject, n as navigateTo, h as hashMode, c as nuxtLinkDefaults } from './server.mjs';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderSlot, ssrRenderComponent } from 'vue/server-renderer';
import { signInWithPopup } from 'firebase/auth';

const getApiBaseUrl$1 = (rawBaseUrl) => {
  const trimmed = (rawBaseUrl || "").trim();
  if (!trimmed) {
    return "https://localhost:3000";
  }
  if (trimmed.startsWith("http://localhost:3000")) {
    return trimmed.replace("http://localhost:3000", "https://localhost:3000");
  }
  return trimmed;
};
const resolvePostAuthRedirectPath = async () => {
  {
    return "/workspace/create";
  }
};
const useAuthApi = () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = getApiBaseUrl$1(config.public.apiBaseUrl);
  const registerWithEmail = async (payload) => {
    const response = await $fetch(`${apiBaseUrl}/auth/register`, {
      method: "POST",
      body: payload
    });
    return response;
  };
  const loginWithEmail = async (payload) => {
    const response = await $fetch(`${apiBaseUrl}/auth/login`, {
      method: "POST",
      body: payload
    });
    return response;
  };
  const logout = () => {
    {
      return;
    }
  };
  return {
    registerWithEmail,
    loginWithEmail,
    logout
  };
};
const firstNonUndefined = (...args) => args.find((arg) => arg !== void 0);
// @__NO_SIDE_EFFECTS__
function defineNuxtLink(options) {
  const componentName = options.componentName || "NuxtLink";
  function isHashLinkWithoutHashMode(link) {
    return !hashMode && typeof link === "string" && link.startsWith("#");
  }
  function resolveTrailingSlashBehavior(to, resolve, trailingSlash) {
    const effectiveTrailingSlash = trailingSlash ?? options.trailingSlash;
    if (!to || effectiveTrailingSlash !== "append" && effectiveTrailingSlash !== "remove") {
      return to;
    }
    if (typeof to === "string") {
      return applyTrailingSlashBehavior(to, effectiveTrailingSlash);
    }
    const path = "path" in to && to.path !== void 0 ? to.path : resolve(to).path;
    const resolvedPath = {
      ...to,
      name: void 0,
      // named routes would otherwise always override trailing slash behavior
      path: applyTrailingSlashBehavior(path, effectiveTrailingSlash)
    };
    return resolvedPath;
  }
  function useNuxtLink(props) {
    const router = useRouter();
    const config = useRuntimeConfig();
    const hasTarget = computed(() => !!unref(props.target) && unref(props.target) !== "_self");
    const isAbsoluteUrl = computed(() => {
      const path = unref(props.to) || unref(props.href) || "";
      return typeof path === "string" && hasProtocol(path, { acceptRelative: true });
    });
    const builtinRouterLink = resolveComponent("RouterLink");
    const useBuiltinLink = builtinRouterLink && typeof builtinRouterLink !== "string" ? builtinRouterLink.useLink : void 0;
    const isExternal = computed(() => {
      if (unref(props.external)) {
        return true;
      }
      const path = unref(props.to) || unref(props.href) || "";
      if (typeof path === "object") {
        return false;
      }
      return path === "" || isAbsoluteUrl.value;
    });
    const to = computed(() => {
      const path = unref(props.to) || unref(props.href) || "";
      if (isExternal.value) {
        return path;
      }
      return resolveTrailingSlashBehavior(path, router.resolve, unref(props.trailingSlash));
    });
    const link = isExternal.value ? void 0 : useBuiltinLink?.({ ...props, to, viewTransition: unref(props.viewTransition) });
    const href = computed(() => {
      const effectiveTrailingSlash = unref(props.trailingSlash) ?? options.trailingSlash;
      if (!to.value || isAbsoluteUrl.value || isHashLinkWithoutHashMode(to.value)) {
        return to.value;
      }
      if (isExternal.value) {
        const path = typeof to.value === "object" && "path" in to.value ? resolveRouteObject(to.value) : to.value;
        const href2 = typeof path === "object" ? router.resolve(path).href : path;
        return applyTrailingSlashBehavior(href2, effectiveTrailingSlash);
      }
      if (typeof to.value === "object") {
        return router.resolve(to.value)?.href ?? null;
      }
      return applyTrailingSlashBehavior(joinURL(config.app.baseURL, to.value), effectiveTrailingSlash);
    });
    return {
      to,
      hasTarget,
      isAbsoluteUrl,
      isExternal,
      //
      href,
      isActive: link?.isActive ?? computed(() => to.value === router.currentRoute.value.path),
      isExactActive: link?.isExactActive ?? computed(() => to.value === router.currentRoute.value.path),
      route: link?.route ?? computed(() => router.resolve(to.value)),
      async navigate(_e) {
        await navigateTo(href.value, { replace: unref(props.replace), external: isExternal.value || hasTarget.value });
      }
    };
  }
  return defineComponent({
    name: componentName,
    props: {
      // Routing
      to: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      href: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      // Attributes
      target: {
        type: String,
        default: void 0,
        required: false
      },
      rel: {
        type: String,
        default: void 0,
        required: false
      },
      noRel: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Prefetching
      prefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      prefetchOn: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      noPrefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Styling
      activeClass: {
        type: String,
        default: void 0,
        required: false
      },
      exactActiveClass: {
        type: String,
        default: void 0,
        required: false
      },
      prefetchedClass: {
        type: String,
        default: void 0,
        required: false
      },
      // Vue Router's `<RouterLink>` additional props
      replace: {
        type: Boolean,
        default: void 0,
        required: false
      },
      ariaCurrentValue: {
        type: String,
        default: void 0,
        required: false
      },
      // Edge cases handling
      external: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Slot API
      custom: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Behavior
      trailingSlash: {
        type: String,
        default: void 0,
        required: false
      }
    },
    useLink: useNuxtLink,
    setup(props, { slots }) {
      const router = useRouter();
      const { to, href, navigate, isExternal, hasTarget, isAbsoluteUrl } = useNuxtLink(props);
      shallowRef(false);
      const el = void 0;
      const elRef = void 0;
      async function prefetch(nuxtApp = useNuxtApp()) {
        {
          return;
        }
      }
      return () => {
        if (!isExternal.value && !hasTarget.value && !isHashLinkWithoutHashMode(to.value)) {
          const routerLinkProps = {
            ref: elRef,
            to: to.value,
            activeClass: props.activeClass || options.activeClass,
            exactActiveClass: props.exactActiveClass || options.exactActiveClass,
            replace: props.replace,
            ariaCurrentValue: props.ariaCurrentValue,
            custom: props.custom
          };
          if (!props.custom) {
            routerLinkProps.rel = props.rel || void 0;
          }
          return h(
            resolveComponent("RouterLink"),
            routerLinkProps,
            slots.default
          );
        }
        const target = props.target || null;
        const rel = firstNonUndefined(
          // converts `""` to `null` to prevent the attribute from being added as empty (`rel=""`)
          props.noRel ? "" : props.rel,
          options.externalRelAttribute,
          /*
          * A fallback rel of `noopener noreferrer` is applied for external links or links that open in a new tab.
          * This solves a reverse tabnapping security flaw in browsers pre-2021 as well as improving privacy.
          */
          isAbsoluteUrl.value || hasTarget.value ? "noopener noreferrer" : ""
        ) || null;
        if (props.custom) {
          if (!slots.default) {
            return null;
          }
          return slots.default({
            href: href.value,
            navigate,
            prefetch,
            get route() {
              if (!href.value) {
                return void 0;
              }
              const url = new URL(href.value, "http://localhost");
              return {
                path: url.pathname,
                fullPath: url.pathname,
                get query() {
                  return parseQuery(url.search);
                },
                hash: url.hash,
                params: {},
                name: void 0,
                matched: [],
                redirectedFrom: void 0,
                meta: {},
                href: href.value
              };
            },
            rel,
            target,
            isExternal: isExternal.value || hasTarget.value,
            isActive: false,
            isExactActive: false
          });
        }
        return h("a", {
          ref: el,
          href: href.value || null,
          // converts `""` to `null` to prevent the attribute from being added as empty (`href=""`)
          rel,
          target,
          onClick: async (event) => {
            if (isExternal.value || hasTarget.value) {
              return;
            }
            event.preventDefault();
            try {
              const encodedHref = encodeRoutePath(href.value);
              return await (props.replace ? router.replace(encodedHref) : router.push(encodedHref));
            } finally {
            }
          }
        }, slots.default?.());
      };
    }
  });
}
const __nuxt_component_0 = /* @__PURE__ */ defineNuxtLink(nuxtLinkDefaults);
function applyTrailingSlashBehavior(to, trailingSlash) {
  const normalizeFn = trailingSlash === "append" ? withTrailingSlash : withoutTrailingSlash;
  const hasProtocolDifferentFromHttp = hasProtocol(to) && !to.startsWith("http");
  if (hasProtocolDifferentFromHttp) {
    return to;
  }
  return normalizeFn(to, true);
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AuthLayout",
  __ssrInlineRender: true,
  props: {
    subtitle: {},
    bottomText: {},
    bottomLinkLabel: {},
    bottomLinkTo: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative min-h-screen bg-[#f3f4f6] px-6 pt-[108px]" }, _attrs))}><button class="fixed right-5 top-5 inline-flex h-7 w-7 items-center justify-center text-slate-500" type="button" aria-label="Toggle theme"><svg class="h-[18px] w-[18px] fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a.75.75 0 0 1 .77 1.1A7.5 7.5 0 0 0 19.9 12a.75.75 0 0 1 1.1.8z"></path></svg></button><div class="mx-auto flex w-full max-w-[386px] flex-col items-center"><div class="mb-6 text-center"><div class="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-[9px] bg-gradient-to-b from-indigo-500 to-indigo-600 shadow-[0_4px_10px_rgba(99,102,241,0.20)]" aria-hidden="true"><svg class="h-5 w-5 fill-white" viewBox="0 0 24 24"><path d="M6 6.75A2.75 2.75 0 0 1 8.75 4h6.5A2.75 2.75 0 0 1 18 6.75v4.5A2.75 2.75 0 0 1 15.25 14H12.4a.7.7 0 0 0-.5.2l-1.95 1.9a.9.9 0 0 1-1.53-.65V14H8.75A2.75 2.75 0 0 1 6 11.25z"></path><path d="M9 9h6v1.5H9zm0 2.5h4v1.5H9z" fill="#eef2ff"></path></svg></div><h1 class="m-0 text-[50px] font-bold leading-[1.1] tracking-[-0.02em] text-slate-950">AppChat</h1><p class="mt-2 text-[18px] font-normal leading-[1.25] text-slate-600">${ssrInterpolate(__props.subtitle)}</p></div><div class="flex w-full flex-col gap-2.5 rounded-[10px] border border-slate-300 bg-[#f3f4f6] p-6 shadow-[0_1px_2px_rgba(15,23,42,0.07),0_6px_20px_rgba(15,23,42,0.04)]">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div><p class="mt-[18px] text-[16px] leading-tight text-slate-600">${ssrInterpolate(__props.bottomText)} `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "ml-1.5 font-semibold text-indigo-600",
        to: __props.bottomLinkTo
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.bottomLinkLabel)}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.bottomLinkLabel), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p><p class="mt-2.5 text-[14px] text-slate-400">Demo: enter any email &amp; password to continue</p></div><button class="fixed bottom-3.5 right-4 h-8 w-8 rounded-full border border-slate-300 bg-slate-50 text-lg leading-none text-slate-700" type="button" aria-label="Help"> ? </button></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/auth/AuthLayout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const getApiBaseUrl = (rawBaseUrl) => {
  const trimmed = (rawBaseUrl || "").trim();
  if (!trimmed) {
    return "https://localhost:3000";
  }
  if (trimmed.startsWith("http://localhost:3000")) {
    return trimmed.replace("http://localhost:3000", "https://localhost:3000");
  }
  return trimmed;
};
const useGoogleAuth = () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = getApiBaseUrl(config.public.apiBaseUrl);
  const nuxtApp = useNuxtApp();
  const signInWithGoogle = async () => {
    const auth = nuxtApp.$firebaseAuth;
    const provider = nuxtApp.$googleProvider;
    if (!auth || !provider) {
      throw new Error("Firebase auth is not initialized");
    }
    const credential = await signInWithPopup(auth, provider);
    const idToken = await credential.user.getIdToken();
    const response = await $fetch(`${apiBaseUrl}/auth/firebase`, {
      method: "POST",
      body: { idToken }
    });
    return {
      response,
      redirectTo: await resolvePostAuthRedirectPath()
    };
  };
  return { signInWithGoogle };
};

export { _sfc_main as _, useAuthApi as a, resolvePostAuthRedirectPath as r, useGoogleAuth as u };;globalThis.__timing__.logEnd('Load chunks/build/use-google-auth-BqGWFBY2');
//# sourceMappingURL=use-google-auth-BqGWFBY2.mjs.map
