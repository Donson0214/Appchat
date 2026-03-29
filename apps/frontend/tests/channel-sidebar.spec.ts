import { mount } from "@vue/test-utils";
import { nextTick, ref } from "vue";
import ChannelSidebar from "../app/components/layout/ChannelSidebar.vue";

const pushMock = vi.fn();
const createChannelMock = vi.fn();
const fetchChannelsMock = vi.fn().mockResolvedValue([]);
const inviteMemberMock = vi.fn().mockResolvedValue({});
const fetchWorkspacePresenceMock = vi.fn().mockResolvedValue([]);
const openDirectMessageMock = vi.fn().mockResolvedValue({ channelRef: "dm-channel-id" });
const loadWorkspaceMock = vi.fn().mockResolvedValue(undefined);

const workspaceRef = ref({
  id: "workspace-1",
  name: "Acme",
  slug: "acme",
  createdAt: new Date().toISOString(),
});

vi.mock("vue-router", () => ({
  useRoute: () => ({
    params: {
      workspaceId: "workspace-1",
      channelId: "general",
    },
  }),
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock("../app/composables/use-workspace", () => ({
  useWorkspace: () => ({
    workspace: workspaceRef,
    loadWorkspace: loadWorkspaceMock,
  }),
}));

vi.mock("../app/composables/use-channel-api", () => ({
  useChannelApi: () => ({
    fetchChannels: fetchChannelsMock,
    createChannel: createChannelMock,
    inviteMember: inviteMemberMock,
  }),
}));

vi.mock("../app/composables/use-presence-api", () => ({
  usePresenceApi: () => ({
    fetchWorkspacePresence: fetchWorkspacePresenceMock,
  }),
}));

vi.mock("../app/composables/use-dm-api", () => ({
  useDmApi: () => ({
    openDirectMessage: openDirectMessageMock,
  }),
}));

describe("ChannelSidebar create channel flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createChannelMock.mockResolvedValue({
      id: "channel-1",
      name: "product-updates",
      slug: "product-updates",
      private: false,
    });
  });

  it("creates a public channel by default", async () => {
    const wrapper = mount(ChannelSidebar);

    await wrapper.get("button").trigger("click");
    await wrapper
      .findAll("button")
      .find((button) => button.text().includes("Add channel"))!
      .trigger("click");

    await nextTick();
    const nameInput = wrapper.find('input[placeholder=\"e.g. product-updates\"]');
    await nameInput.setValue("product updates");

    const createButton = wrapper
      .findAll("button")
      .find((button) => button.text().includes("Create channel"))!;
    await createButton.trigger("click");

    expect(createChannelMock).toHaveBeenCalledWith("workspace-1", {
      name: "product updates",
      type: "PUBLIC",
    });
  });

  it("creates a private channel when checkbox is selected", async () => {
    const wrapper = mount(ChannelSidebar);

    await wrapper
      .findAll("button")
      .find((button) => button.text().includes("Add channel"))!
      .trigger("click");

    await nextTick();
    const nameInput = wrapper.find('input[placeholder=\"e.g. product-updates\"]');
    await nameInput.setValue("leadership");

    const privateCheckbox = wrapper.find('input[type=\"checkbox\"]');
    await privateCheckbox.setValue(true);

    const createButton = wrapper
      .findAll("button")
      .find((button) => button.text().includes("Create channel"))!;
    await createButton.trigger("click");

    expect(createChannelMock).toHaveBeenCalledWith("workspace-1", {
      name: "leadership",
      type: "PRIVATE",
    });
  });
});
