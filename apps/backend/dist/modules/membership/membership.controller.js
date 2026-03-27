"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const add_channel_member_dto_1 = require("./dto/add-channel-member.dto");
const add_workspace_member_dto_1 = require("./dto/add-workspace-member.dto");
const update_workspace_member_role_dto_1 = require("./dto/update-workspace-member-role.dto");
const membership_service_1 = require("./membership.service");
let MembershipController = class MembershipController {
    constructor(membershipService) {
        this.membershipService = membershipService;
    }
    addWorkspaceMember(userId, workspaceId, dto) {
        return this.membershipService.addWorkspaceMember(userId, workspaceId, dto);
    }
    updateRole(userId, workspaceId, targetUserId, dto) {
        return this.membershipService.updateWorkspaceMemberRole(userId, workspaceId, targetUserId, dto);
    }
    removeWorkspaceMember(userId, workspaceId, targetUserId) {
        return this.membershipService.removeWorkspaceMember(userId, workspaceId, targetUserId);
    }
    addChannelMember(userId, channelId, dto) {
        return this.membershipService.addUserToPrivateChannel(userId, channelId, dto);
    }
    removeChannelMember(userId, channelId, targetUserId) {
        return this.membershipService.removeUserFromChannel(userId, channelId, targetUserId);
    }
};
exports.MembershipController = MembershipController;
__decorate([
    (0, common_1.Post)("workspaces/:workspaceId/members"),
    __param(0, (0, current_user_decorator_1.CurrentUser)("userId")),
    __param(1, (0, common_1.Param)("workspaceId", new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, add_workspace_member_dto_1.AddWorkspaceMemberDto]),
    __metadata("design:returntype", void 0)
], MembershipController.prototype, "addWorkspaceMember", null);
__decorate([
    (0, common_1.Patch)("workspaces/:workspaceId/members/:targetUserId/role"),
    __param(0, (0, current_user_decorator_1.CurrentUser)("userId")),
    __param(1, (0, common_1.Param)("workspaceId", new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Param)("targetUserId", new common_1.ParseUUIDPipe())),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, update_workspace_member_role_dto_1.UpdateWorkspaceMemberRoleDto]),
    __metadata("design:returntype", void 0)
], MembershipController.prototype, "updateRole", null);
__decorate([
    (0, common_1.Delete)("workspaces/:workspaceId/members/:targetUserId"),
    __param(0, (0, current_user_decorator_1.CurrentUser)("userId")),
    __param(1, (0, common_1.Param)("workspaceId", new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Param)("targetUserId", new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], MembershipController.prototype, "removeWorkspaceMember", null);
__decorate([
    (0, common_1.Post)("channels/:channelId/members"),
    __param(0, (0, current_user_decorator_1.CurrentUser)("userId")),
    __param(1, (0, common_1.Param)("channelId", new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, add_channel_member_dto_1.AddChannelMemberDto]),
    __metadata("design:returntype", void 0)
], MembershipController.prototype, "addChannelMember", null);
__decorate([
    (0, common_1.Delete)("channels/:channelId/members/:targetUserId"),
    __param(0, (0, current_user_decorator_1.CurrentUser)("userId")),
    __param(1, (0, common_1.Param)("channelId", new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Param)("targetUserId", new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], MembershipController.prototype, "removeChannelMember", null);
exports.MembershipController = MembershipController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [membership_service_1.MembershipService])
], MembershipController);
//# sourceMappingURL=membership.controller.js.map