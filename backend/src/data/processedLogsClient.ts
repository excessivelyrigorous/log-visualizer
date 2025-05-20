import { Faction, isPlayerBombTriggerType, Kill, Match, MatchRound, PlayerBombTrigger, PlayerBombTriggerType, WinTrigger } from "../domain/models/processedLogModels";
import { MessageType, RawLogEntry, RawLogEntryTime } from "../domain/models/rawLogModels";
import { timeCompare, getSecondsSinceMidnight } from "../utils/logEntryUtils";
import { getMatchRawLog, getMatchRawLogs } from "./rawLogsClient"
import * as _ from 'lodash';

const roundsCache: Map<string, MatchRound[]> = new Map();

const getPlayerTag = (variableRaw: string) => variableRaw.substring(0, variableRaw.indexOf('<'))
const getLatestLogBeforeTime = <T extends { time: RawLogEntryTime }>(logs: T[], time: RawLogEntryTime) => _.maxBy(logs.filter(l => timeCompare(time, l.time) >= 0), l => getSecondsSinceMidnight(l.time))

const getTeamPlaying = async (matchId: string, faction: Faction, time: RawLogEntryTime) => {
    const teamPlayings = await getEntriesOrFail(matchId, "TEAM_PLAYING")
    const byFaction = teamPlayings.filter(tp => tp.variables[0] === faction)
    const getTeam = (message: string) => message.slice(message.lastIndexOf(": ") + 1, message.length)
    const latestLogBeforeTime = getLatestLogBeforeTime(byFaction, time)
    if (!latestLogBeforeTime) {
        throw new Error(`Team playing before ${JSON.stringify(time)} not found.`)
    }
    return {
        faction: latestLogBeforeTime.variables[0],
        teamId: getTeam(latestLogBeforeTime.message)
    }
}

export const getWinTriggers = async (matchId: string): Promise<WinTrigger[]> => {
    const triggers = await getEntriesOrFail(matchId, "TRIGGER")
    const isWinTrigger = (t: RawLogEntry) => t.message.startsWith("Team ")
    const winTriggers = triggers.filter(isWinTrigger)
    const getWinTrigger = (entry: RawLogEntry): WinTrigger => {
        switch (entry.variables[1]) {
            case "SFUI_Notice_Terrorists_Win":
                return {
                    winningFaction: "TERRORIST",
                    winCondition: "wipe",
                    time: entry.time,
                }
            case "SFUI_Notice_CTs_Win":
                return {
                    winningFaction: "CT",
                    winCondition: "wipe",
                    time: entry.time,
                }
            case "SFUI_Notice_Target_Bombed":
                return {
                    winningFaction: "TERRORIST",
                    winCondition: "bombed",
                    time: entry.time,
                }
            case "SFUI_Notice_Bomb_Defused":
                return {
                    winningFaction: "CT",
                    winCondition: "defused",
                    time: entry.time,
                }
            default:
                throw new Error(`Unkown win trigger ${entry.variables[1]}`)
        }
    }
    return winTriggers.map(getWinTrigger)
}

export const getPlayerBombTriggers = async (matchId: string): Promise<PlayerBombTrigger[]> => {
    const triggers = await getEntriesOrFail(matchId, "TRIGGER")
    const isPlayerBombTrigger = (t: RawLogEntry) => !t.message.startsWith("Team ")
    const playerBombTriggers = triggers.filter(isPlayerBombTrigger)
    const getTriggerType = (variableRaw: string): PlayerBombTriggerType => {
        if (!isPlayerBombTriggerType(variableRaw)) {
            throw new Error(`Unknown bomb-trigger type ${variableRaw}`)
        }
        return variableRaw
    }
    return playerBombTriggers.map(t => ({
        player: getPlayerTag(t.variables[0]),
        triggerType: getTriggerType(t.variables[1]),
        time: t.time,
    }))
}

export const getKills = async (matchId: string): Promise<Kill[]> => {
    const killEntries = await getEntriesOrFail(matchId, "KILLED")
    return killEntries.map(ke => ({
        player1: getPlayerTag(ke.variables[0]),
        player2: getPlayerTag(ke.variables[1]),
        weapon: ke.variables[2],
        time: ke.time,
    }))
}

export const getPlayers = async (matchId: string) => {
    const entries = await getEntriesOrFail(matchId)
    const vars = entries.flatMap(e => e.variables)
    const uniqVars = _.uniq(vars)
    const playerVars = uniqVars.filter(v => v.includes('STEAM'))
    return playerVars.map(getPlayerTag)
}

export const getMatch = async (matchId: string): Promise<Match> => {
    const entries = await getEntriesOrFail(matchId)
    return {
        matchId,
        startTime: entries[0].time,
        endTime: entries.slice(-1)[0].time,
    }
}

export const getMatches = async (): Promise<Match[]> => {
    const logs = await getMatchRawLogs()
    return logs.map(l => ({
        matchId: l.matchName,
        startTime: l.logEntries[0].time,
        endTime: l.logEntries.slice(-1)[0].time,
    }))
}

export const getRounds = async (matchId: string): Promise<MatchRound[]> => {
    const cacheValue = roundsCache.get(matchId)
    if (cacheValue) {
        return cacheValue
    }
    const winTriggers = await getWinTriggers(matchId)
    const entries = await getEntriesOrFail(matchId)
    const roundStarts = _.uniq(entries.filter(e => e.messageType === 'ROUND_START').map(e => e.time))
    const getRoundStartTimeByRoundEndTime = (endTime: RawLogEntryTime): RawLogEntryTime => {
        const startTime = _.maxBy(roundStarts.filter(rs => timeCompare(endTime, rs) > 0), getSecondsSinceMidnight)
        if (!startTime) {
            //TODO: assign default value and log a warning
            throw new Error(`Failed to find start time for ${JSON.stringify(endTime)}`)
        }
        return startTime
    }
    const roundEndRegex = /(?:\][^\[]*)?(\b\w+)\s*\[(\d+)\s*-\s*(\d+)\]\s*(\b\w+)/
    const roundEnds = entries
        .filter(e => e.messageType === 'ADMIN')
        .filter(e => e.message.match(roundEndRegex)?.length)

    const roundEndToRound = async (roundEnd: RawLogEntry): Promise<MatchRound | null> => {
        const matches = roundEnd.message.match(roundEndRegex)
        if (!matches) {
            return null
        }
        const winTrigger = getLatestLogBeforeTime(winTriggers, roundEnd.time)
        if (!winTrigger) {
            throw new Error(`Win trigger not found in ${JSON.stringify(winTriggers)} for time ${JSON.stringify(roundEnd.time)}`)
        }
        const winningTeam = await getTeamPlaying(matchId, winTrigger.winningFaction, roundEnd.time)
        return {
            teamScores: [
                { team: matches[1], score: Number.parseInt(matches[2]) },
                { team: matches[4], score: Number.parseInt(matches[3]) },
            ],
            roundStartTime: getRoundStartTimeByRoundEndTime(roundEnd.time),
            roundEndTime: roundEnd.time,
            ...roundEnd,
            variables: roundEnd.variables.map(v => ({ raw: v })),
            winningTeamId: winningTeam.teamId,
            winCondition: winTrigger.winCondition,
        }
    }
    const roundsWithNulls = await Promise.all(roundEnds.map(roundEndToRound))
    const rounds = roundsWithNulls.filter(r => r !== null)

    roundsCache.set(matchId, rounds)

    return rounds
}

const getEntriesOrFail = async (matchId: string, type?: MessageType) => {
    const log = await getMatchRawLog(matchId)
    if (!log) {
        throw new Error("Bad matchId")
    }
    return log.logEntries.filter(e => !type || e.messageType === type)
}
