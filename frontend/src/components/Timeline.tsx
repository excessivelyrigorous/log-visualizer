import React, { useState, type ReactNode } from "react"
import { useGetKills, useGetMatch, useGetMatches, useGetRounds } from "../api/matches"
import type { MatchRound } from "../api/models/processedModels"
import type { RawLogEntryTime } from "../api/models/rawModels"
import { numberToHeightClass } from "../utils/numberToHeightClass"
import { WeaponIcon } from "./Weapon"
import * as _ from "lodash"

const timeToString = (t: RawLogEntryTime) => `${t.hour}:${t.minute}:${t.second}`
const timeToSeconds = (t: RawLogEntryTime) => t.hour * 60 * 60 + t.minute * 60 + t.second
const getLineHeightClassName = (duration: number) => {
    const n = Math.round(duration / 2)
    return numberToHeightClass(n)
}

export const Timeline = () => {
    const { data: matches } = useGetMatches()
    const matchId = matches?.[0].matchId
    if (!matchId) {
        return <span className="loading loading-spinner loading-xl"></span>
    }
    return <TimelineInner matchId={matchId} />
}

const TimelineInner = ({ matchId }: { matchId: string }) => {
    const { data: match, error: matchError, isLoading: isLoadingMatch } = useGetMatch(matchId)
    const { data: rounds, error: roundsError, isLoading: isLoadingRounds } = useGetRounds(matchId)
    if (!rounds || !match) {
        return <span className="loading loading-spinner loading-xl"></span>
    }
    const timeToSecondsSinceMatchStart = (t: RawLogEntryTime) => timeToSeconds(t) - timeToSeconds(match.startTime)
    const getRoundDuration = (r: MatchRound) => timeToSeconds(r.roundEndTime) - timeToSeconds(r.roundStartTime)
    const getPreroundDuration = (roundIdx: number) => timeToSeconds(rounds[roundIdx].roundStartTime) - timeToSeconds(rounds[roundIdx - 1]?.roundStartTime ?? match.startTime)
    const lastRoundStartTime = rounds[rounds.length - 1].roundStartTime
    const postroundDuration = timeToSeconds(match.endTime) - timeToSeconds(lastRoundStartTime)

    return (
        <ul className="timeline timeline-vertical">
            {rounds.map((round, roundIdx) =>
                <React.Fragment key={timeToString(round.roundStartTime)}>
                    <LineSegment2
                        height={getPreroundDuration(roundIdx)}
                    >
                    </LineSegment2>
                    <RoundSegment round={round} matchId={matchId} />
                </React.Fragment>
            )}
            <LineSegment2
                height={postroundDuration}
            >
            </LineSegment2>
        </ul >
    )
}

const TimelineSegment = ({ height, type, children, color }: { height: number, type: "start" | "middle" | "last", children: React.ReactNode, color?: boolean }) => {
    const col = color ? "bg-indigo-900" : "bg-slate-900"
    const text = color ? "text-warning" : ""
    return <li className={getLineHeightClassName(height)}>
        <hr className={col} />
        <div className={"timeline-start timeline-box"}>Round X</div>
        <div className="timeline-middle">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className={text + " h-5 w-5"}
            >
                <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={text + "h-5 w-5"}>
                <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 10.28a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72H8.25a.75.75 0 0 0 0 1.5h5.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3Z"
                    clipRule="evenodd"
                />
            </svg>
        </div>
        <div className="timeline-end timeline-box">{children}</div>
        <hr className={col} />
    </li>
}

const LineSegment = ({ height, color }: { height: number, color?: boolean }) => {
    const col = color ? "bg-warning" : ""
    return <hr className={getLineHeightClassName(height) + " " + col} />
}

const RoundSegment = ({ round, matchId }: { round: MatchRound, matchId: string }) => {
    const { data, error, isLoading } = useGetKills(matchId)
    if (!data) {
        return null
    }
    const kills = data.filter(k => timeToSeconds(k.time) > timeToSeconds(round.roundStartTime) && timeToSeconds(k.time) < timeToSeconds(round.roundEndTime))
    const weapons = _.uniq(data.map(k => k.weapon))
    //console.log('weapons', weapons)
    return <div>
        {kills.map((kill, idx) => {
            const killTime = timeToSeconds(kill.time)
            const prevTime = idx === 0 ? round.roundStartTime : kills[idx - 1].time
            const height = killTime - timeToSeconds(prevTime)
            return <LineSegment3
                key={kill.player2}
                height={height}
                icon={<WeaponIcon id={kill.weapon} className="w-4 h-4 fill-yellow-400" />}
                color
            />
        })}
    </div>
}

const LineSegment2 = ({ height, color, icon }: { height: number, color?: boolean, icon?: ReactNode }) => {
    const [collapsed, setCollapsed] = useState(false)
    const vis = collapsed ? 'invisible' : 'visible'
    return <div
        className={getLineHeightClassName(collapsed ? 20 : height) + " " + "w-full transition-[height] flex justify-center"}
        onClick={() => setCollapsed(!collapsed)}
    >
        <div className={vis + " " + 'transition-[invisible] transition-[visible] duration-300 absolute'}>
            {icon}
        </div>
        <div className={"w-4 h-full first:rounded-t-lg border-1 bg-zinc-900 border-zinc-800"} />
    </div>
}
const LineSegment3 = ({ height, color, icon }: { height: number, color?: boolean, icon?: ReactNode }) => {
    const [collapsed, setCollapsed] = useState(false)
    const col = color ? "bg-indigo-900" : "bg-slate-900"
    const vis = collapsed ? 'invisible' : 'visible'
    return <div
        className={getLineHeightClassName(collapsed ? 20 : height) + " " + "w-full transition-[height] flex justify-center"}
        onClick={() => setCollapsed(!collapsed)}
    >
        <div className={vis + " " + 'transition-[invisible] transition-[visible] duration-300 absolute'}>
            {icon}
        </div>
        <div className={col + " " + "w-4 h-full"} />
    </div>
}