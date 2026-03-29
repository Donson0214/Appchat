import { ref } from "vue";
import { io, type Socket } from "socket.io-client";
import { getValidAccessToken } from "../utils/auth-session";
import type { PresenceStatus } from "./use-presence-api";

type PresenceChangedEvent = {
  userId: string;
  status: PresenceStatus;
  at: string;
};

type PresenceConnectionState = "idle" | "connecting" | "connected" | "error";

const socketRef = ref<Socket | null>(null);
const connectionState = ref<PresenceConnectionState>("idle");
const connectionError = ref("");
const subscribedWorkspaceIds = new Set<string>();
const listeners = new Set<(event: PresenceChangedEvent) => void>();

const getApiBaseUrl = () => {
  const config = useRuntimeConfig();
  const rawBaseUrl = String(config.public.apiBaseUrl || "").trim();
  if (!rawBaseUrl) return "https://localhost:3000";
  if (rawBaseUrl.startsWith("http://localhost:3000")) {
    return rawBaseUrl.replace("http://localhost:3000", "https://localhost:3000");
  }
  return rawBaseUrl;
};

const ensureSocket = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const token = getValidAccessToken();
  if (!token) {
    connectionState.value = "error";
    connectionError.value = "Presence socket unavailable: authentication missing.";
    return null;
  }

  if (socketRef.value) {
    return socketRef.value;
  }

  connectionState.value = "connecting";
  connectionError.value = "";
  const socket = io(`${getApiBaseUrl()}/presence`, {
    transports: ["websocket"],
    withCredentials: true,
    auth: { token },
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  socket.on("connect", () => {
    connectionState.value = "connected";
    connectionError.value = "";
  });

  socket.on("connect_error", (error) => {
    connectionState.value = "error";
    connectionError.value = `Presence realtime connection failed: ${error.message || "unknown error"}`;
  });

  socket.on("presence:changed", (payload: PresenceChangedEvent) => {
    for (const listener of listeners) {
      listener(payload);
    }
  });

  socketRef.value = socket;
  return socket;
};

export const usePresenceRealtime = () => {
  const connect = () => {
    return ensureSocket();
  };

  const subscribeWorkspace = async (workspaceRef: string): Promise<void> => {
    const normalized = String(workspaceRef || "").trim();
    if (!normalized) {
      throw new Error("Workspace reference is required for presence subscription.");
    }

    const socket = ensureSocket();
    if (!socket) {
      throw new Error(connectionError.value || "Presence socket is not available.");
    }

    if (subscribedWorkspaceIds.has(normalized)) {
      return;
    }

    const response = await new Promise<{ ok: boolean; workspaceId?: string; reason?: string }>((resolve) => {
      socket.emit("presence:subscribe", { workspaceRef: normalized }, (ack: { ok: boolean; workspaceId?: string; reason?: string }) => {
        resolve(ack ?? { ok: false, reason: "No response from presence server." });
      });
    });

    if (!response.ok) {
      connectionState.value = "error";
      connectionError.value = `Presence subscription failed: ${response.reason || "unknown reason"}`;
      throw new Error(connectionError.value);
    }

    const key = response.workspaceId || normalized;
    subscribedWorkspaceIds.add(key);
    subscribedWorkspaceIds.add(normalized);
    connectionState.value = "connected";
    connectionError.value = "";
  };

  const onPresenceChanged = (handler: (event: PresenceChangedEvent) => void) => {
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  };

  const disconnect = () => {
    if (socketRef.value) {
      socketRef.value.disconnect();
      socketRef.value = null;
    }
    subscribedWorkspaceIds.clear();
    connectionState.value = "idle";
    connectionError.value = "";
  };

  return {
    connect,
    subscribeWorkspace,
    onPresenceChanged,
    disconnect,
    connectionState,
    connectionError,
  };
};
