import { Server, Socket } from "socket.io";
type JoinRoomPayload = {
    workspaceId: string;
    channelRef: string;
};
export declare class MessageGateway {
    server: Server;
    handleJoinRoom(client: Socket, payload: JoinRoomPayload): {
        room: string;
    };
    emitMessageCreated(workspaceId: string, channelRef: string, message: unknown): void;
    private roomFor;
}
export {};
