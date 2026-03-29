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
        name TEXT,
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
      ADD COLUMN IF NOT EXISTS name TEXT,
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
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'NotificationType') THEN
          CREATE TYPE "NotificationType" AS ENUM ('MENTION');
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
        "parentMessageId" TEXT REFERENCES "Message"(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await this.$executeRawUnsafe(`
      ALTER TABLE "Message"
      ADD COLUMN IF NOT EXISTS "parentMessageId" TEXT REFERENCES "Message"(id) ON DELETE CASCADE;
    `);

    await this.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ChannelReadState" (
        id TEXT PRIMARY KEY,
        "channelId" TEXT NOT NULL REFERENCES "Channel"(id) ON DELETE CASCADE,
        "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
        "lastReadAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await this.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "MessageMention" (
        id TEXT PRIMARY KEY,
        "messageId" TEXT NOT NULL REFERENCES "Message"(id) ON DELETE CASCADE,
        "workspaceId" TEXT NOT NULL REFERENCES "Workspace"(id) ON DELETE CASCADE,
        "channelId" TEXT NOT NULL REFERENCES "Channel"(id) ON DELETE CASCADE,
        "mentionedById" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
        "mentionedUserId" TEXT REFERENCES "User"(id) ON DELETE CASCADE,
        "mentionKey" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await this.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Notification" (
        id TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
        "workspaceId" TEXT NOT NULL REFERENCES "Workspace"(id) ON DELETE CASCADE,
        "channelId" TEXT NOT NULL REFERENCES "Channel"(id) ON DELETE CASCADE,
        "messageId" TEXT NOT NULL REFERENCES "Message"(id) ON DELETE CASCADE,
        "mentionKey" TEXT,
        type "NotificationType" NOT NULL DEFAULT 'MENTION',
        preview TEXT NOT NULL,
        "isRead" BOOLEAN NOT NULL DEFAULT FALSE,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "readAt" TIMESTAMP(3)
      );
    `);

    await this.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "MessageReaction" (
        id TEXT PRIMARY KEY,
        "messageId" TEXT NOT NULL REFERENCES "Message"(id) ON DELETE CASCADE,
        "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
        emoji TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await this.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "PinnedMessage" (
        id TEXT PRIMARY KEY,
        "workspaceId" TEXT NOT NULL REFERENCES "Workspace"(id) ON DELETE CASCADE,
        "channelId" TEXT NOT NULL REFERENCES "Channel"(id) ON DELETE CASCADE,
        "messageId" TEXT NOT NULL REFERENCES "Message"(id) ON DELETE CASCADE,
        "pinnedById" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
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
      CREATE INDEX IF NOT EXISTS "Message_parentMessageId_createdAt_idx" ON "Message"("parentMessageId","createdAt");
    `);

    await this.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Message_userId_idx" ON "Message"("userId");
    `);

    await this.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "ChannelReadState_channelId_userId_key"
      ON "ChannelReadState"("channelId","userId");
    `);

    await this.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "ChannelReadState_userId_updatedAt_idx"
      ON "ChannelReadState"("userId","updatedAt");
    `);

    await this.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "ChannelReadState_channelId_updatedAt_idx"
      ON "ChannelReadState"("channelId","updatedAt");
    `);

    await this.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "MessageMention_messageId_idx" ON "MessageMention"("messageId");
    `);

    await this.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "MessageMention_workspaceId_channelId_createdAt_idx"
      ON "MessageMention"("workspaceId", "channelId", "createdAt");
    `);

    await this.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "MessageMention_mentionedUserId_createdAt_idx"
      ON "MessageMention"("mentionedUserId", "createdAt");
    `);

    await this.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Notification_userId_isRead_createdAt_idx"
      ON "Notification"("userId", "isRead", "createdAt");
    `);

    await this.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Notification_workspaceId_channelId_createdAt_idx"
      ON "Notification"("workspaceId", "channelId", "createdAt");
    `);

    await this.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "MessageReaction_messageId_userId_emoji_key"
      ON "MessageReaction"("messageId","userId","emoji");
    `);

    await this.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "MessageReaction_messageId_createdAt_idx"
      ON "MessageReaction"("messageId","createdAt");
    `);

    await this.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "MessageReaction_userId_createdAt_idx"
      ON "MessageReaction"("userId","createdAt");
    `);

    await this.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "PinnedMessage_channelId_messageId_key"
      ON "PinnedMessage"("channelId","messageId");
    `);

    await this.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "PinnedMessage_workspaceId_channelId_createdAt_idx"
      ON "PinnedMessage"("workspaceId","channelId","createdAt");
    `);

    await this.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "PinnedMessage_pinnedById_createdAt_idx"
      ON "PinnedMessage"("pinnedById","createdAt");
    `);
  }
}
