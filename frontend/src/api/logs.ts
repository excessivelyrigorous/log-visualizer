import axios from 'axios';
import type { MatchLog, MatchLogVerbose } from './models/rawModels';

const path = "http://localhost:3001/match-logs";

export const getMatchLogs = async () => axios.get<MatchLog[]>(path);
export const getMatchLog = async (matchId: string) => axios.get<MatchLogVerbose>(`${path}/${matchId}`);
