import { IsEnum } from "class-validator";

export enum PresenceStatus {
  ONLINE = "online",
  AWAY = "away",
  DND = "dnd",
  OFFLINE = "offline",
}

export class SetStatusDto {
  @IsEnum(PresenceStatus)
  status!: PresenceStatus;
}
