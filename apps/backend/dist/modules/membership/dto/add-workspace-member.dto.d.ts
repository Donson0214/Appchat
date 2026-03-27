import { WorkspaceRole } from "@prisma/client";
export declare class AddWorkspaceMemberDto {
    userId: string;
    role?: WorkspaceRole;
}
