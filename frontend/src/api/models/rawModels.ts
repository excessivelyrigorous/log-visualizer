export type MessageType =
    | 'MATCH_PAUSE'
    | 'MATCH_UNPAUSE'
    | 'PLAYER_CONNECTED'
    | 'PLAYER_ENTERED'
    | 'PLAYER_VALIDATED'
    | 'TEAM_SWITCH'
    | 'PICKUP'
    | 'DROP'
    | 'ROUND_START'
    | 'MATCH_START'
    | 'MATCH_STATUS_TEAM_PLAYING'
    | 'MATCH_STATUS_SCORE'
    | 'TEAM_SCORE'
    | 'TEAM_PLAYING'
    | 'WORLD_TRIGGER'
    | 'SERVER_RESTART_NEEDED'
    | 'SERVER_CVAR'
    | 'ADMIN'
    | 'HAS_MONEY'
    | 'MONEY_CHANGE'
    | 'PURCHASED'
    | 'FREEZE_PERIOD_START'
    | 'LEFT_BUYZONE'
    | 'KILLED_OTHER'
    | 'KILLED'
    | 'ASSIST'
    | 'FLASH_ASSIST'
    | 'ATTACKED'
    | 'THROW_GRENADE'
    | 'DISCONNECT'
    | 'MOLOTOV_PROJECTILE_SPAWN'
    | 'TRIGGER'
    | 'SAY'
    | 'SAY_TEAM'
    | 'BLINDED'
    | 'VOTE_STARTED'
    | 'VOTE_CAST'
    | 'VOTE_SUCCEEDED'
    | 'GAME_OVER'
    | 'ACCOLADE'
    | 'UNKNOWN';

export interface MatchLog {
    matchName: string,
}

export interface MatchLogVerbose extends MatchLog {
    logEntries: LogEntry[],
}

export interface LogEntry {
    time: RawLogEntryTime,
    message: string,
    variables: string[],
    messageType: MessageType,
}

export interface RawLogEntryTime { hour: number, minute: number, second: number }