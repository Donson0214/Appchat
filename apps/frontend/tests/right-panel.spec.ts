import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import RightPanel from "../app/components/layout/RightPanel.vue";

const fetchThreadMock = vi.fn();
const sendReplyMock = vi.fn();
const fetchPinnedMock = vi.fn();
const searchWorkspaceMock = vi.fn();
const addReactionMock = vi.fn();
const removeReactionMock = vi.fn();
const pinMessageMock = vi.fn();
const unpinMessageMock = vi.fn();
const fetchWorkspacePresenceMock = vi.fn();
const socketEmitMock = vi.fn();
const socketHandlers = new Map<string, (payload: unknown) => void>();

vi.mock("../app/composables/use-message-api", () => ({
  useMessageApi: () => ({
    fetchThread: fetchThreadMock,
    sendReply: sendReplyMock,
    fetchPinned: fetchPinnedMock,
    searchWorkspace: searchWorkspaceMock,
    addReaction: addReactionMock,
    removeReaction: removeReactionMock,
    pinMessage: pinMessageMock,
    unpinMessage: unpinMessageMock,
  }),
}));

vi.mock("../app/composables/use-presence-api", () => ({
  usePresenceApi: () => ({
    fetchWorkspacePresence: fetchWorkspacePresenceMock,
  }),
}));

vi.mock("socket.io-client", () => ({
  io: () => ({
    emit: socketEmitMock,
    on: (event: string, handler: (payload: unknown) => void) => {
      socketHandlers.set(event, handler);
    },
    disconnect: vi.fn(),
  }),
}));

vi.mock("../app/utils/auth-session", () => ({
  getValidAccessToken: () => "token",
}));

vi.stubGlobal("useRuntimeConfig", () => ({ public: { apiBaseUrl: "https://localhost:3000" } }));

describe("RightPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    socketHandlers.clear();
    fetchThreadMock.mockResolvedValue({
      root: {
        id: "m1",
        content: "Root message",
        createdAt: new Date().toISOString(),
        author: { id: "u1", name: "Don", email: "don@example.com" },
        mentions: [],
        reactions: [],
        pinned: false,
      },
      replies: [],
    });
    sendReplyMock.mockResolvedValue({
      id: "r1",
      content: "Reply body",
      createdAt: new Date().toISOString(),
      author: { id: "u2", name: "Jane", email: "jane@example.com" },
      mentions: [],
      reactions: [],
      pinned: false,
    });
    fetchPinnedMock.mockResolvedValue([]);
    searchWorkspaceMock.mockResolvedValue({ scope: "messages", items: [] });
    fetchWorkspacePresenceMock.mockResolvedValue([]);
  });

  it("loads real thread payload and submits reply", async () => {
    const wrapper = mount(RightPanel, {
      props: {
        isOpen: true,
        workspaceId: "workspace-1",
        channelRef: "channel-1",
        threadMessage: { id: "m1", name: "Don", text: "Root message" },
      },
    });

    await Promise.resolve();
    await Promise.resolve();
    expect(fetchThreadMock).toHaveBeenCalled();

    const input = wrapper.find('input[placeholder="Reply in thread..."]');
    await input.setValue("Reply body");
    await input.trigger("keydown.enter");
    expect(sendReplyMock).toHaveBeenCalled();
  });

  it("renders thread reply exactly once under socket/local race", async () => {
    let resolveReply: ((value: unknown) => void) | null = null;
    sendReplyMock.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveReply = resolve;
        }),
    );

    const wrapper = mount(RightPanel, {
      props: {
        isOpen: true,
        workspaceId: "workspace-1",
        channelRef: "channel-1",
        threadMessage: { id: "m1", name: "Don", text: "Root message" },
      },
    });

    await Promise.resolve();
    await Promise.resolve();

    const input = wrapper.find('input[placeholder="Reply in thread..."]');
    await input.setValue("Race reply");
    await input.trigger("keydown.enter");

    socketHandlers.get("thread:reply-created")?.({
      rootMessageId: "m1",
      reply: {
        id: "r-race",
        content: "Race reply",
        createdAt: new Date().toISOString(),
        author: { id: "u2", name: "Jane", email: "jane@example.com" },
        mentions: [],
        reactions: [],
        pinned: false,
      },
    });

    resolveReply?.({
      id: "r-race",
      content: "Race reply",
      createdAt: new Date().toISOString(),
      author: { id: "u2", name: "Jane", email: "jane@example.com" },
      mentions: [],
      reactions: [],
      pinned: false,
    });

    await Promise.resolve();
    await Promise.resolve();

    const replyArticles = wrapper.findAll("article").filter((item) => item.text().includes("Race reply"));
    expect(replyArticles.length).toBe(1);
  });

  it("auto-closes when thread is stale in current channel", async () => {
    fetchThreadMock.mockRejectedValueOnce({ statusCode: 404 });

    const wrapper = mount(RightPanel, {
      props: {
        isOpen: true,
        workspaceId: "workspace-1",
        channelRef: "channel-1",
        threadMessage: { id: "stale-thread", name: "Don", text: "Root message" },
      },
    });

    await Promise.resolve();
    await Promise.resolve();

    expect(wrapper.emitted("close")).toBeTruthy();
    expect(wrapper.text()).toContain("This thread is no longer available in the current channel.");
  });

  it("resets thread draft and rejoins room when channel changes", async () => {
    const wrapper = mount(RightPanel, {
      props: {
        isOpen: true,
        workspaceId: "workspace-1",
        channelRef: "channel-1",
        threadMessage: { id: "m1", name: "Don", text: "Root message" },
      },
    });

    await Promise.resolve();
    await Promise.resolve();

    const input = wrapper.find('input[placeholder="Reply in thread..."]');
    await input.setValue("draft to reset");

    await wrapper.setProps({
      channelRef: "channel-2",
      threadMessage: { id: "m2", name: "Don", text: "Root message 2" },
    });
    await Promise.resolve();
    await Promise.resolve();

    const updatedInput = wrapper.find('input[placeholder="Reply in thread..."]');
    expect((updatedInput.element as HTMLInputElement).value).toBe("");
    expect(socketEmitMock).toHaveBeenCalledWith("join-room", { workspaceId: "workspace-1", channelRef: "channel-2" });
  });

  it("does not re-emit profile-selected for identical profile hint payload", async () => {
    fetchWorkspacePresenceMock.mockResolvedValue([
      {
        id: "u2",
        name: "Jane",
        email: "jane@example.com",
        role: "MEMBER",
        isSelf: false,
        status: "online",
      },
    ]);

    const wrapper = mount(RightPanel, {
      props: {
        isOpen: true,
        workspaceId: "workspace-1",
        channelRef: "channel-1",
        threadMessage: { id: "m1", name: "Don", text: "Root message" },
      },
    });

    await wrapper.setProps({
      profileHint: { userId: "u2", name: "Jane" },
    });
    await Promise.resolve();
    await Promise.resolve();

    const emittedFirst = wrapper.emitted("profile-selected") ?? [];
    expect(emittedFirst.length).toBe(1);

    await wrapper.setProps({
      profileHint: { userId: "u2", name: "Jane" },
    });
    await Promise.resolve();
    await Promise.resolve();

    const emittedSecond = wrapper.emitted("profile-selected") ?? [];
    expect(emittedSecond.length).toBe(1);
    expect(fetchWorkspacePresenceMock).toHaveBeenCalledTimes(1);
  });

  it("clears profile loading and shows explicit error on profile fetch timeout", async () => {
    vi.useFakeTimers();
    fetchWorkspacePresenceMock.mockImplementation(
      () =>
        new Promise(() => {
          // keep pending to trigger timeout path
        }),
    );

    const wrapper = mount(RightPanel, {
      props: {
        isOpen: true,
        workspaceId: "workspace-1",
        channelRef: "channel-1",
        threadMessage: { id: "m1", name: "Don", text: "Root message" },
        profileHint: { userId: "u2", name: "Jane" },
      },
    });

    await Promise.resolve();
    await Promise.resolve();
    expect(wrapper.text()).toContain("Loading profile...");

    await vi.advanceTimersByTimeAsync(8100);
    await Promise.resolve();
    await Promise.resolve();

    expect(wrapper.text()).toContain("Unable to load profile. Please try again.");
    expect(wrapper.text()).not.toContain("Loading profile...");
    vi.useRealTimers();
  });
});

