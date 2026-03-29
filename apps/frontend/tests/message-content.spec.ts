import { mount } from "@vue/test-utils";
import MessageContent from "../app/components/chat/MessageContent.vue";

describe("MessageContent", () => {
  it("highlights @mentions in rendered HTML", () => {
    const wrapper = mount(MessageContent, {
      props: {
        text: "Great work @alex and @channel",
        mentions: [
          { userId: "u-1", displayName: "alex", mentionKey: "alex", start: 11, end: 16 },
          { userId: null, displayName: "channel", mentionKey: "channel", start: 21, end: 29 },
        ],
      },
    });

    const html = wrapper.html();
    expect(html).toContain("font-semibold text-indigo-600");
    expect(html).toContain("@alex");
    expect(html).toContain("@channel");
  });
});
