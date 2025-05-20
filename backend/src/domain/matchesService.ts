import { getMatchRawLog as getMatchLogClientFunction, getMatchRawLogs as getMatchLogsClientFunction } from "../data/rawLogsClient";
import * as _ from 'lodash';

export const getMatchLogs = getMatchLogsClientFunction

export const getMatchLog = getMatchLogClientFunction

export const getPlayers = async (matchId: string) => {
    const log = await getMatchLog(matchId)
    if (!log) {
        throw new Error("Bad matchId")
    }
    const entries = log.logEntries
    const vars = entries.flatMap(e => e.variables)
    const uniqVars = _.uniq(vars)
}
