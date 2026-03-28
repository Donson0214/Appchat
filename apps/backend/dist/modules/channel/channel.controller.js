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
exports.ChannelController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const add_channel_member_dto_1 = require("./dto/add-channel-member.dto");
const create_channel_dto_1 = require("./dto/create-channel.dto");
const channel_service_1 = require("./channel.service");
let ChannelController = class ChannelController {
    constructor(channelService) {
        this.channelService = channelService;
    }
    async list(workspaceId, req) {
        const userId = req.user?.sub;
        if (!userId) {
            throw new common_1.UnauthorizedException("Unauthorized");
        }
        return this.channelService.listForWorkspace(workspaceId, userId);
    }
    async create(workspaceId, req, dto) {
        const userId = req.user?.sub;
        if (!userId) {
            throw new common_1.UnauthorizedException("Unauthorized");
        }
        return this.channelService.createInWorkspace(workspaceId, userId, dto);
    }
    async inviteMember(workspaceId, channelRef, req, dto) {
        const userId = req.user?.sub;
        if (!userId) {
            throw new common_1.UnauthorizedException("Unauthorized");
        }
        return this.channelService.addMember(workspaceId, channelRef, userId, dto);
    }
};
exports.ChannelController = ChannelController;
__decorate([
    (0, common_1.Get)("workspaces/:workspaceId/channels"),
    __param(0, (0, common_1.Param)("workspaceId")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "list", null);
__decorate([
    (0, common_1.Post)("workspaces/:workspaceId/channels"),
    __param(0, (0, common_1.Param)("workspaceId")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, create_channel_dto_1.CreateChannelDto]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "create", null);
__decorate([
    (0, common_1.Post)("workspaces/:workspaceId/channels/:channelRef/members"),
    __param(0, (0, common_1.Param)("workspaceId")),
    __param(1, (0, common_1.Param)("channelRef")),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, add_channel_member_dto_1.AddChannelMemberDto]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "inviteMember", null);
exports.ChannelController = ChannelController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [channel_service_1.ChannelService])
], ChannelController);
//# sourceMappingURL=channel.controller.js.map