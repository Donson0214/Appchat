import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AuthUser } from "../types";

export const CurrentUser = createParamDecorator((data: keyof AuthUser | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<{ user: AuthUser }>();

  if (!data) {
    return request.user;
  }

  return request.user?.[data];
});