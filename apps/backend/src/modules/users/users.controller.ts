import { Controller, Get, Query } from "@nestjs/common";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { QueryUsersDto } from "./dto/query-users.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  me(@CurrentUser("userId") userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Get()
  list(@Query() query: QueryUsersDto) {
    return this.usersService.listUsers(query);
  }
}