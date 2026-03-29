import { mount } from "@vue/test-utils";
import Header from "../app/components/layout/Header.vue";

describe("DM presence badge", () => {
  it("renders gray for offline status", () => {
    const wrapper = mount(Header, {
      props: {
        channel: {
          name: "Donson",
          description: "Workspace member",
          isDirectMessage: true,
          presenceLabel: "offline",
        },
      },
    });

    const badge = wrapper.find("span.inline-flex.h-6");
    expect(badge.exists()).toBe(true);
    expect(badge.classes()).toContain("bg-slate-500");
    expect(badge.text()).toBe("offline");
  });

  it("renders green for online status", () => {
    const wrapper = mount(Header, {
      props: {
        channel: {
          name: "Donson",
          description: "Workspace member",
          isDirectMessage: true,
          presenceLabel: "online",
        },
      },
    });

    const badge = wrapper.find("span.inline-flex.h-6");
    expect(badge.classes()).toContain("bg-emerald-500");
    expect(badge.text()).toBe("online");
  });
});
