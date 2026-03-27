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
  }
}
