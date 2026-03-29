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
    emit: vi.fn(),
    on: vi.fn(),
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
});

