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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
let PrismaService = class PrismaService extends client_1.PrismaClient {
    constructor(configService) {
        const connectionString = configService.get("DATABASE_URL") ?? process.env.DATABASE_URL;
        const pool = new pg_1.Pool({ connectionString });
        const adapter = new adapter_pg_1.PrismaPg(pool);
        super({ adapter });
    }
    async onModuleInit() {
        await this.$connect();
        await this.ensureAuthTables();
        await this.ensureWorkspaceTables();
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
    async ensureAuthTables() {
        await this.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'AuthProvider') THEN
          CREATE TYPE "AuthProvider" AS ENUM ('EMAIL', 'GOOGLE');
        END IF;
      END
      $$;
    `);
        await this.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "User" (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        "fullName" TEXT,
        "avatarUrl" TEXT,
        "passwordHash" TEXT,
        provider "AuthProvider" NOT NULL DEFAULT 'EMAIL',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
        await this.$executeRawUnsafe(`
      ALTER TABLE "User"
      ADD COLUMN IF NOT EXISTS "fullName" TEXT,
      ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT,
      ADD COLUMN IF NOT EXISTS "passwordHash" TEXT,
      ADD COLUMN IF NOT EXISTS provider "AuthProvider" DEFAULT 'EMAIL',
      ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
    `);
        await this.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'User'
            AND column_name = 'name'
        ) THEN
          UPDATE "User"
          SET "fullName" = COALESCE("fullName", name)
          WHERE "fullName" IS NULL;
        END IF;
      END
      $$;
    `);
        await this.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"(email);
    `);
    }
    async ensureWorkspaceTables() {
        await this.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'WorkspaceRole') THEN
          CREATE TYPE "WorkspaceRole" AS ENUM ('ADMIN', 'MEMBER');
        END IF;
      END
      $$;
    `);
        await this.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ChannelType') THEN
          CREATE TYPE "ChannelType" AS ENUM ('PUBLIC', 'PRIVATE');
        END IF;
      END
      $$;
    `);
        await this.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Workspace" (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        "inviteCode" TEXT,
        "ownerId" TEXT REFERENCES "User"(id) ON DELETE CASCADE,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
        await this.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "WorkspaceMember" (
        id TEXT PRIMARY KEY,
        "workspaceId" TEXT NOT NULL REFERENCES "Workspace"(id) ON DELETE CASCADE,
        "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
        role "WorkspaceRole" NOT NULL DEFAULT 'MEMBER',
        "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
        await this.$executeRawUnsafe(`
      ALTER TABLE "Workspace"
      ADD COLUMN IF NOT EXISTS "inviteCode" TEXT,
      ADD COLUMN IF NOT EXISTS "ownerId" TEXT,
      ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
    `);
        await this.$executeRawUnsafe(`
      ALTER TABLE "WorkspaceMember"
      ADD COLUMN IF NOT EXISTS "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
    `);
        await this.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Channel" (
        id TEXT PRIMARY KEY,
        "workspaceId" TEXT NOT NULL REFERENCES "Workspace"(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        description TEXT,
        type "ChannelType" NOT NULL DEFAULT 'PUBLIC',
        "createdById" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
        await this.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ChannelMember" (
        id TEXT PRIMARY KEY,
        "channelId" TEXT NOT NULL REFERENCES "Channel"(id) ON DELETE CASCADE,
        "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
        "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
        await this.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Message" (
        id TEXT PRIMARY KEY,
        "channelId" TEXT NOT NULL REFERENCES "Channel"(id) ON DELETE CASCADE,
        "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
        await this.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "Workspace_slug_key" ON "Workspace"(slug);
    `);
        await this.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "Workspace_inviteCode_key" ON "Workspace"("inviteCode");
    `);
        await this.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Workspace_ownerId_idx" ON "Workspace"("ownerId");
    `);
        await this.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "WorkspaceMember_workspaceId_userId_key"
      ON "WorkspaceMember"("workspaceId","userId");
    `);
        await this.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "WorkspaceMember_userId_idx" ON "WorkspaceMember"("userId");
    `);
        await this.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "Channel_workspaceId_name_key"
      ON "Channel"("workspaceId","name");
    `);
        await this.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Channel_workspaceId_idx" ON "Channel"("workspaceId");
    `);
        await this.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "ChannelMember_channelId_userId_key"
      ON "ChannelMember"("channelId","userId");
    `);
        await this.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "ChannelMember_userId_idx" ON "ChannelMember"("userId");
    `);
        await this.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Message_channelId_createdAt_idx" ON "Message"("channelId","createdAt");
    `);
        await this.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Message_userId_idx" ON "Message"("userId");
    `);
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map