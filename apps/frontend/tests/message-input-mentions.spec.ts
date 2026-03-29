import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import MessageInput from "../app/components/chat/MessageInput.vue";

const suggestMentionsMock = vi.fn();
const resolveMentionsMock = vi.fn();

vi.mock("../app/composables/use-message-api", () => ({
  useMessageApi: () => ({
    suggestMentions: suggestMentionsMock,
    resolveMentions: resolveMentionsMock,
  }),
}));

describe("MessageInput mentions", () => {
  it("shows autocomplete and inserts selected mention", async () => {
    suggestMentionsMock.mockResolvedValue({
      items: [
        {
          id: "u-2",
          displayName: "Donson Carpenter",
          handle: "donson",
          avatarUrl: null,
          emailSnippet: "donson@example.com",
        },
      ],
    });
    resolveMentionsMock.mockResolvedValue({ resolved: [], unresolved: [], ambiguous: [] });

    const wrapper = mount(MessageInput, {
      props: {
        workspaceId: "workspace-1",
        channelRef: "general",
      },
    });

    const textarea = wrapper.find("textarea");
    await textarea.setValue("@do");
    await textarea.trigger("keyup");
    await new Promise((resolve) => setTimeout(resolve, 160));
    await Promise.resolve();

    const firstSuggestion = wrapper.find('button[class*="justify-between"]');
    expect(firstSuggestion.exists()).toBe(true);
    await firstSuggestion.trigger("mousedown");
    expect((textarea.element as HTMLTextAreaElement).value).toContain("@donson ");
  });

  it("shows unresolved warning and blocks send", async () => {
    suggestMentionsMock.mockResolvedValue({ items: [] });
    resolveMentionsMock.mockResolvedValue({
      resolved: [],
      unresolved: [{ mentionKey: "unknown", start: 6, end: 14 }],
      ambiguous: [],
    });

    const wrapper = mount(MessageInput, {
      props: {
        workspaceId: "workspace-1",
        channelRef: "general",
      },
    });

    const textarea = wrapper.find("textarea");
    await textarea.setValue("hello @unknown");
    await wrapper.find('button[aria-label="Send message"]').trigger("click");
    expect(wrapper.text()).toContain("Unresolved:");
    expect(wrapper.emitted("send")).toBeFalsy();
  });
});

