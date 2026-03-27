import { ConfigService } from "@nestjs/config";
import { Strategy } from "passport-jwt";
import { AuthUser } from "../../../common/types";
import { PrismaService } from "../../../database/prisma/prisma.service";
type JwtPayload = {
    sub: string;
    email: string;
};
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly prisma;
    constructor(configService: ConfigService, prisma: PrismaService);
    validate(payload: JwtPayload): Promise<AuthUser>;
}
export {};
