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
exports.MessageController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const create_message_dto_1 = require("./dto/create-message.dto");
const query_messages_dto_1 = require("./dto/query-messages.dto");
const message_service_1 = require("./message.service");
let MessageController = class MessageController {
    constructor(messageService) {
        this.messageService = messageService;
    }
    send(userId, channelId, dto) {
        return this.messageService.sendMessage(userId, channelId, dto);
    }
    list(userId, channelId, query) {
        return this.messageService.getMessages(userId, channelId, query);
    }
};
exports.MessageController = MessageController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)("userId")),
    __param(1, (0, common_1.Param)("channelId", new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, create_message_dto_1.CreateMessageDto]),
    __metadata("design:returntype", void 0)
], MessageController.prototype, "send", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)("userId")),
    __param(1, (0, common_1.Param)("channelId", new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, query_messages_dto_1.QueryMessagesDto]),
    __metadata("design:returntype", void 0)
], MessageController.prototype, "list", null);
exports.MessageController = MessageController = __decorate([
    (0, common_1.Controller)("channels/:channelId/messages"),
    __metadata("design:paramtypes", [message_service_1.MessageService])
], MessageController);
//# sourceMappingURL=message.controller.js.map