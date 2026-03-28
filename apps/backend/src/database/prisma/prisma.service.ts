import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(configService: ConfigService) {
    const connectionString =
      configService.get<string>("DATABASE_URL") ?? process.env.DATABASE_URL;

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    super({ adapter });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
    await this.ensureAuthTables();
    await this.ensureWorkspaceTables();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }

  private async ensureAuthTables(): Promise<void> {
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

  private async ensureWorkspaceTables(): Promise<void> {
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
}
