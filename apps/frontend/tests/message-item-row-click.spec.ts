import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import MessageItem from "../app/components/chat/MessageItem.vue";

const baseMessage = {
  id: "m1",
  initials: "DC",
  color: "bg-indigo-500",
  authorId: "u1",
  name: "Donson",
  time: "2:53 PM",
  pinned: false,
  text: "Hello @donson",
  mentions: [
    {
      userId: "u1",
      displayName: "Donson",
      mentionKey: "donson",
      start: 6,
      end: 13,
    },
  ],
  reactions: [{ emoji: "👍", count: 1, reactedByMe: false }],
  replies: 1,
};

describe("MessageItem row click behavior", () => {
  it("opens thread when clicking non-interactive area of row", async () => {
    const wrapper = mount(MessageItem, {
      props: {
        message: baseMessage,
      },
    });

    await wrapper.get("article").trigger("click");
    expect(wrapper.emitted("open-thread")?.length).toBe(1);
  });

  it("opens thread when clicking inner non-interactive content (regression)", async () => {
    const wrapper = mount(MessageItem, {
      props: {
        message: baseMessage,
      },
    });

    await wrapper.get("article .min-w-0").trigger("click");
    expect(wrapper.emitted("open-thread")?.length).toBe(1);
  });

  it("does not open thread when clicking mention button", async () => {
    const wrapper = mount(MessageItem, {
      props: {
        message: baseMessage,
      },
    });

    const mention = wrapper.find("p button");
    await mention.trigger("click");

    expect(wrapper.emitted("mention-click")?.length).toBe(1);
    expect(wrapper.emitted("open-thread")).toBeFalsy();
  });

  it("does not open thread when clicking pin/reaction controls", async () => {
    const wrapper = mount(MessageItem, {
      props: {
        message: baseMessage,
      },
    });

    const pinButton = wrapper.find('button[title="Pin message"]');
    await pinButton.trigger("click");
    expect(wrapper.emitted("toggle-pin")?.length).toBe(1);
    expect(wrapper.emitted("open-thread")).toBeFalsy();

    const reactionButton = wrapper.find('button[title="Add reaction"]');
    await reactionButton.trigger("click");
    expect(wrapper.emitted("toggle-reaction")?.length).toBeGreaterThan(0);
    expect(wrapper.emitted("open-thread")).toBeFalsy();
  });

  it("opens thread with keyboard Enter/Space", async () => {
    const wrapper = mount(MessageItem, {
      props: {
        message: baseMessage,
      },
    });

    const row = wrapper.get("article");
    await row.trigger("keydown.enter");
    await row.trigger("keydown.space");

    expect(wrapper.emitted("open-thread")?.length).toBe(2);
  });

  it("does not open thread when user has selected text", async () => {
    const wrapper = mount(MessageItem, {
      props: {
        message: baseMessage,
      },
    });

    const getSelectionSpy = vi
      .spyOn(window, "getSelection")
      .mockReturnValue({ toString: () => "selected text" } as unknown as Selection);

    await wrapper.get("article").trigger("click");

    expect(wrapper.emitted("open-thread")).toBeFalsy();
    getSelectionSpy.mockRestore();
  });
});
