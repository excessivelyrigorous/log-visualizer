import { MessageType, RawLogEntryTime } from "./rawLogModels";

export interface LogVariable {
    raw: string
}
export interface PlayerLogVariable extends LogVariable {
    playerTag: string
}

export interface ProcessedLogEntry {
    time: { hour: number, minute: number, second: number };
    message: string;
    variables: LogVariable[];
    messageType: MessageType;
}

interface TeamScore { team: string, score: number }
type TeamsScores = [TeamScore, TeamScore]
export type WinCondition = "bombed" | "defused" | "wipe"
export interface MatchRound extends ProcessedLogEntry {
    teamScores: TeamsScores,
    roundStartTime: RawLogEntryTime,
    roundEndTime: RawLogEntryTime,
    winningTeamId: string,
    winCondition: WinCondition,
}

export interface Match {
    matchId: string,
    startTime: RawLogEntryTime,
    endTime: RawLogEntryTime,
}

export interface Kill {
    player1: string,
    player2: string,
    weapon: string,
    time: RawLogEntryTime,
}

export const isPlayerBombTriggerType = (variableRaw: string): variableRaw is PlayerBombTriggerType => PlayerBombTriggerTypes.includes(variableRaw as any)
export const PlayerBombTriggerTypes = ["Got_The_Bomb", "Dropped_The_Bomb", "Bomb_Begin_Plant", "Planted_The_Bomb", "Begin_Bomb_Defuse_With_Kit"] as const
export type PlayerBombTriggerType = (typeof PlayerBombTriggerTypes)[number]
export interface PlayerBombTrigger {
    player: string
    triggerType: PlayerBombTriggerType
    time: RawLogEntryTime
}

export type Faction = "CT" | "TERRORIST"
export interface WinTrigger {
    winningFaction: Faction
    winCondition: WinCondition
    time: RawLogEntryTime
}
