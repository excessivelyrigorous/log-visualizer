import axios from 'axios';
import type { Kill, Match, MatchRound } from './models/processedModels';
import useSWR from 'swr'

const path = "http://localhost:3001/matches";

const getMatches = async () => axios.get<Match[]>(`${path}`)
const getMatch = async (matchId: string) => axios.get<Match>(`${path}/${matchId}`)
const getRounds = async (matchId: string) => axios.get<MatchRound[]>(`${path}/${matchId}/rounds`)
const getKills = async (matchId: string) => axios.get<Kill[]>(`${path}/${matchId}/kills`)

const getMatchesKey = () => [useGetMatches.name]
const getMatchKey = (matchId: string) => [useGetMatch.name, matchId]
const getRoundsKey = (matchId: string) => [useGetRounds.name, matchId]
const getKillsKey = (matchId: string) => [useGetKills.name, matchId]

export const useGetMatches = () => useSWR(getMatchesKey(), () => getMatches().then(res => res.data))
export const useGetMatch = (matchId: string) => useSWR(getMatchKey(matchId), () => getMatch(matchId).then(res => res.data))
export const useGetRounds = (matchId: string) => useSWR(getRoundsKey(matchId), () => getRounds(matchId).then(res => res.data))
export const useGetKills = (matchId: string) => useSWR(getKillsKey(matchId), () => getKills(matchId).then(res => res.data))
