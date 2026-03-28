import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

type JoinRoomPayload = {
  workspaceId: string;
  channelRef: string;
};

@WebSocketGateway({
  namespace: "/ws",
  cors: {
    origin: true,
    credentials: true,
  },
})
export class MessageGateway {
  @WebSocketServer()
  server!: Server;

  @SubscribeMessage("join-room")
  handleJoinRoom(client: Socket, payload: JoinRoomPayload) {
    const room = this.roomFor(payload.workspaceId, payload.channelRef);
    client.join(room);
    return { room };
  }

  emitMessageCreated(workspaceId: string, channelRef: string, message: unknown) {
    const room = this.roomFor(workspaceId, channelRef);
    this.server.to(room).emit("message-created", message);
  }

  private roomFor(workspaceId: string, channelRef: string) {
    return `workspace:${workspaceId}:channel:${channelRef.toLowerCase().trim()}`;
  }
}
