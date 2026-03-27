
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T> = DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>> & T

type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }> & T

interface _GlobalComponents {
  AuthLayout: typeof import("../../app/components/auth/AuthLayout.vue")['default']
  ChatContainer: typeof import("../../app/components/chat/ChatContainer.vue")['default']
  ChatMessageAvatar: typeof import("../../app/components/chat/MessageAvatar.vue")['default']
  ChatMessageItem: typeof import("../../app/components/chat/MessageItem.vue")['default']
  ChatMessageList: typeof import("../../app/components/chat/MessageList.vue")['default']
  LayoutChannelSidebar: typeof import("../../app/components/layout/ChannelSidebar.vue")['default']
  LayoutHeader: typeof import("../../app/components/layout/Header.vue")['default']
  LayoutRightPanel: typeof import("../../app/components/layout/RightPanel.vue")['default']
  LayoutSidebar: typeof import("../../app/components/layout/Sidebar.vue")['default']
  LayoutWorkspaceSidebar: typeof import("../../app/components/layout/WorkspaceSidebar.vue")['default']
  UiAvatar: typeof import("../../app/components/ui/Avatar.vue")['default']
  UiBadge: typeof import("../../app/components/ui/Badge.vue")['default']
  UiButton: typeof import("../../app/components/ui/Button.vue")['default']
  UiInput: typeof import("../../app/components/ui/Input.vue")['default']
  UiTooltip: typeof import("../../app/components/ui/Tooltip.vue")['default']
  NuxtWelcome: typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']
  NuxtLayout: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
  NuxtErrorBoundary: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
  ClientOnly: typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']
  DevOnly: typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']
  ServerPlaceholder: typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']
  NuxtLink: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']
  NuxtLoadingIndicator: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
  NuxtTime: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
  NuxtRouteAnnouncer: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
  NuxtAnnouncer: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-announcer")['default']
  NuxtImg: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
  NuxtPicture: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
  NuxtPage: typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']
  NoScript: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']
  Link: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']
  Base: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']
  Title: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']
  Meta: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']
  Style: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']
  Head: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']
  Html: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']
  Body: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']
  NuxtIsland: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']
  LazyAuthLayout: LazyComponent<typeof import("../../app/components/auth/AuthLayout.vue")['default']>
  LazyChatContainer: LazyComponent<typeof import("../../app/components/chat/ChatContainer.vue")['default']>
  LazyChatMessageAvatar: LazyComponent<typeof import("../../app/components/chat/MessageAvatar.vue")['default']>
  LazyChatMessageItem: LazyComponent<typeof import("../../app/components/chat/MessageItem.vue")['default']>
  LazyChatMessageList: LazyComponent<typeof import("../../app/components/chat/MessageList.vue")['default']>
  LazyLayoutChannelSidebar: LazyComponent<typeof import("../../app/components/layout/ChannelSidebar.vue")['default']>
  LazyLayoutHeader: LazyComponent<typeof import("../../app/components/layout/Header.vue")['default']>
  LazyLayoutRightPanel: LazyComponent<typeof import("../../app/components/layout/RightPanel.vue")['default']>
  LazyLayoutSidebar: LazyComponent<typeof import("../../app/components/layout/Sidebar.vue")['default']>
  LazyLayoutWorkspaceSidebar: LazyComponent<typeof import("../../app/components/layout/WorkspaceSidebar.vue")['default']>
  LazyUiAvatar: LazyComponent<typeof import("../../app/components/ui/Avatar.vue")['default']>
  LazyUiBadge: LazyComponent<typeof import("../../app/components/ui/Badge.vue")['default']>
  LazyUiButton: LazyComponent<typeof import("../../app/components/ui/Button.vue")['default']>
  LazyUiInput: LazyComponent<typeof import("../../app/components/ui/Input.vue")['default']>
  LazyUiTooltip: LazyComponent<typeof import("../../app/components/ui/Tooltip.vue")['default']>
  LazyNuxtWelcome: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
  LazyNuxtLayout: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
  LazyNuxtErrorBoundary: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
  LazyClientOnly: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']>
  LazyDevOnly: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']>
  LazyServerPlaceholder: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
  LazyNuxtLink: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
  LazyNuxtLoadingIndicator: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
  LazyNuxtTime: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
  LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
  LazyNuxtAnnouncer: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-announcer")['default']>
  LazyNuxtImg: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
  LazyNuxtPicture: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
  LazyNuxtPage: LazyComponent<typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']>
  LazyNoScript: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
  LazyLink: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']>
  LazyBase: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']>
  LazyTitle: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']>
  LazyMeta: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']>
  LazyStyle: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']>
  LazyHead: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']>
  LazyHtml: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']>
  LazyBody: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']>
  LazyNuxtIsland: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export {}
