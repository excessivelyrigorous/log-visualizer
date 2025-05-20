
import path from 'path';
import { parseLogFile } from '../domain/logParserService';
import { MatchRawLogVerbose } from '../domain/models/rawLogModels';

const MATCH_NAME = "NAVIvsVitaGF-Nuke";

const matchLogsCache: Map<string, MatchRawLogVerbose> = new Map();

export const getMatchRawLogs = async (): Promise<MatchRawLogVerbose[]> => {
    await seedCacheIfEmpty();
    return Array.from(matchLogsCache).map(ml => ml[1]);
}

export const getMatchRawLog = async (matchId: string) => {
    await seedCacheIfEmpty();
    return matchLogsCache.get(matchId);
}

const seedCacheIfEmpty = async () => {
    if (!matchLogsCache.get(MATCH_NAME)) {
        await seedCache();
    }
}

const seedCache = async () => {
    const logPath = path.join(__dirname, `../../${MATCH_NAME}.txt`);
    const logEntries = await parseLogFile(logPath);
    matchLogsCache.set(MATCH_NAME, {
        matchName: MATCH_NAME,
        logEntries
    });
}
