
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


export const AuthLayout: typeof import("../app/components/auth/AuthLayout.vue")['default']
export const ChatContainer: typeof import("../app/components/chat/ChatContainer.vue")['default']
export const ChatMessageAvatar: typeof import("../app/components/chat/MessageAvatar.vue")['default']
export const ChatMessageItem: typeof import("../app/components/chat/MessageItem.vue")['default']
export const ChatMessageList: typeof import("../app/components/chat/MessageList.vue")['default']
export const LayoutChannelSidebar: typeof import("../app/components/layout/ChannelSidebar.vue")['default']
export const LayoutHeader: typeof import("../app/components/layout/Header.vue")['default']
export const LayoutRightPanel: typeof import("../app/components/layout/RightPanel.vue")['default']
export const LayoutSidebar: typeof import("../app/components/layout/Sidebar.vue")['default']
export const LayoutWorkspaceSidebar: typeof import("../app/components/layout/WorkspaceSidebar.vue")['default']
export const UiAvatar: typeof import("../app/components/ui/Avatar.vue")['default']
export const UiBadge: typeof import("../app/components/ui/Badge.vue")['default']
export const UiButton: typeof import("../app/components/ui/Button.vue")['default']
export const UiInput: typeof import("../app/components/ui/Input.vue")['default']
export const UiTooltip: typeof import("../app/components/ui/Tooltip.vue")['default']
export const NuxtWelcome: typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
export const ClientOnly: typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtTime: typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/nuxt-announcer")['default']
export const NuxtImg: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
export const NuxtPicture: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
export const NuxtPage: typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
export const NoScript: typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const LazyAuthLayout: LazyComponent<typeof import("../app/components/auth/AuthLayout.vue")['default']>
export const LazyChatContainer: LazyComponent<typeof import("../app/components/chat/ChatContainer.vue")['default']>
export const LazyChatMessageAvatar: LazyComponent<typeof import("../app/components/chat/MessageAvatar.vue")['default']>
export const LazyChatMessageItem: LazyComponent<typeof import("../app/components/chat/MessageItem.vue")['default']>
export const LazyChatMessageList: LazyComponent<typeof import("../app/components/chat/MessageList.vue")['default']>
export const LazyLayoutChannelSidebar: LazyComponent<typeof import("../app/components/layout/ChannelSidebar.vue")['default']>
export const LazyLayoutHeader: LazyComponent<typeof import("../app/components/layout/Header.vue")['default']>
export const LazyLayoutRightPanel: LazyComponent<typeof import("../app/components/layout/RightPanel.vue")['default']>
export const LazyLayoutSidebar: LazyComponent<typeof import("../app/components/layout/Sidebar.vue")['default']>
export const LazyLayoutWorkspaceSidebar: LazyComponent<typeof import("../app/components/layout/WorkspaceSidebar.vue")['default']>
export const LazyUiAvatar: LazyComponent<typeof import("../app/components/ui/Avatar.vue")['default']>
export const LazyUiBadge: LazyComponent<typeof import("../app/components/ui/Badge.vue")['default']>
export const LazyUiButton: LazyComponent<typeof import("../app/components/ui/Button.vue")['default']>
export const LazyUiInput: LazyComponent<typeof import("../app/components/ui/Input.vue")['default']>
export const LazyUiTooltip: LazyComponent<typeof import("../app/components/ui/Tooltip.vue")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtTime: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>

export const componentNames: string[]
