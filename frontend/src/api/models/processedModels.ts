import type { MessageType, RawLogEntryTime } from "./rawModels";

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
