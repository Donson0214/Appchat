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
exports.WorkspaceController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const create_workspace_dto_1 = require("./dto/create-workspace.dto");
const join_workspace_dto_1 = require("./dto/join-workspace.dto");
const workspace_service_1 = require("./workspace.service");
let WorkspaceController = class WorkspaceController {
    constructor(workspaceService) {
        this.workspaceService = workspaceService;
    }
    create(userId, dto) {
        return this.workspaceService.createWorkspace(userId, dto);
    }
    join(userId, dto) {
        return this.workspaceService.joinWorkspace(userId, dto);
    }
    list(userId) {
        return this.workspaceService.listUserWorkspaces(userId);
    }
    listMembers(userId, workspaceId) {
        return this.workspaceService.listWorkspaceMembers(userId, workspaceId);
    }
};
exports.WorkspaceController = WorkspaceController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)("userId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_workspace_dto_1.CreateWorkspaceDto]),
    __metadata("design:returntype", void 0)
], WorkspaceController.prototype, "create", null);
__decorate([
    (0, common_1.Post)("join"),
    __param(0, (0, current_user_decorator_1.CurrentUser)("userId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, join_workspace_dto_1.JoinWorkspaceDto]),
    __metadata("design:returntype", void 0)
], WorkspaceController.prototype, "join", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WorkspaceController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(":workspaceId/members"),
    __param(0, (0, current_user_decorator_1.CurrentUser)("userId")),
    __param(1, (0, common_1.Param)("workspaceId", new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], WorkspaceController.prototype, "listMembers", null);
exports.WorkspaceController = WorkspaceController = __decorate([
    (0, common_1.Controller)("workspaces"),
    __metadata("design:paramtypes", [workspace_service_1.WorkspaceService])
], WorkspaceController);
//# sourceMappingURL=workspace.controller.js.map