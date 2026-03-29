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
let presenceChangedHandler: ((event: { userId: string; status: "online" | "away" | "dnd" | "offline" }) => void) | null = null;
let unreadUpdatedHandler: ((event: { workspaceId: string; channelId: string; unreadCount: number }) => void) | null = null;

const workspaceRef = ref({
  id: "workspace-1",
  name: "Acme",
  slug: "acme",
  createdAt: new Date().toISOString(),
});

(globalThis as unknown as { useRuntimeConfig: () => { public: { apiBaseUrl: string } } }).useRuntimeConfig = () => ({
  public: {
    apiBaseUrl: "https://localhost:3000",
  },
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

vi.mock("socket.io-client", () => ({
  io: () => ({
    on: (event: string, handler: unknown) => {
      if (event === "unread-updated") {
        unreadUpdatedHandler = handler as (event: { workspaceId: string; channelId: string; unreadCount: number }) => void;
      }
    },
    disconnect: vi.fn(),
  }),
}));

vi.mock("../app/utils/auth-session", () => ({
  getValidAccessToken: () => "test-token",
}));

vi.mock("../app/composables/use-presence-realtime", () => ({
  usePresenceRealtime: () => ({
    connect: vi.fn(),
    subscribeWorkspace: vi.fn().mockResolvedValue(undefined),
    onPresenceChanged: vi.fn().mockImplementation((handler: typeof presenceChangedHandler) => {
      presenceChangedHandler = handler;
      return () => {
        presenceChangedHandler = null;
      };
    }),
    connectionState: ref("connected"),
    connectionError: ref(""),
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
    presenceChangedHandler = null;
    unreadUpdatedHandler = null;
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

  it("updates presence indicator when realtime event arrives", async () => {
    fetchWorkspacePresenceMock.mockResolvedValueOnce([
      {
        id: "member-2",
        name: "Donson",
        email: "donson@example.com",
        role: "MEMBER",
        isSelf: false,
        status: "offline",
      },
    ]);

    const wrapper = mount(ChannelSidebar);
    await new Promise((resolve) => setTimeout(resolve, 0));
    await nextTick();

    const memberButton = wrapper.findAll("button").find((button) => button.text().includes("Donson"));
    expect(memberButton).toBeTruthy();
    expect(memberButton!.html()).toContain("bg-slate-400");

    presenceChangedHandler?.({ userId: "member-2", status: "online" });
    await nextTick();

    const updatedMemberButton = wrapper.findAll("button").find((button) => button.text().includes("Donson"));
    expect(updatedMemberButton!.html()).toContain("bg-emerald-500");
  });

  it("renders unread badge from channel list API", async () => {
    fetchChannelsMock.mockResolvedValueOnce([
      {
        id: "channel-general",
        name: "general",
        slug: "general",
        description: "",
        type: "PUBLIC",
        private: false,
        membersCount: 2,
        unreadCount: 3,
      },
    ]);

    const wrapper = mount(ChannelSidebar);
    await new Promise((resolve) => setTimeout(resolve, 0));
    await nextTick();

    const generalButton = wrapper.findAll("button").find((button) => button.text().includes("general"));
    expect(generalButton).toBeTruthy();
    expect(generalButton!.text()).toContain("3");
  });

  it("updates unread badge from realtime event and clears on channel click", async () => {
    fetchChannelsMock.mockResolvedValueOnce([
      {
        id: "channel-general",
        name: "general",
        slug: "general",
        description: "",
        type: "PUBLIC",
        private: false,
        membersCount: 2,
        unreadCount: 0,
      },
    ]);

    const wrapper = mount(ChannelSidebar);
    await new Promise((resolve) => setTimeout(resolve, 0));
    await nextTick();

    unreadUpdatedHandler?.({
      workspaceId: "workspace-1",
      channelId: "channel-general",
      unreadCount: 5,
    });
    await nextTick();

    const withBadge = wrapper.findAll("button").find((button) => button.text().includes("general"));
    expect(withBadge!.text()).toContain("5");

    await withBadge!.trigger("click");
    await nextTick();

    const cleared = wrapper.findAll("button").find((button) => button.text().includes("general"));
    expect(cleared!.text()).not.toContain("5");
  });
});
