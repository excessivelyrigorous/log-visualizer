import React, { useState, type ReactNode } from "react"
import { useGetKills, useGetMatch, useGetRounds } from "../api/matches"
import type { Kill, MatchRound } from "../api/models/processedModels"
import { numberToHeightClass } from "../utils/numberToHeightClass"
import _ from "lodash"
import { WeaponRow } from "./WeaponRow"
import { timeToSeconds, timeToString } from "../utils/time"

const getLineHeightClassName = (duration: number) => {
    const n = Math.round(duration)
    return numberToHeightClass(n)
}

export const Timeline = ({ matchId }: { matchId: string }) => {
    const { data: match } = useGetMatch(matchId)
    const { data: rounds } = useGetRounds(matchId)
    if (!rounds || !match) {
        return <span className="loading loading-spinner loading-xl"></span>
    }
    const getPreroundDuration = (roundIdx: number) => timeToSeconds(rounds[roundIdx].roundStartTime) - timeToSeconds(rounds[roundIdx - 1]?.roundStartTime ?? match.startTime)
    const lastRoundStartTime = rounds[rounds.length - 1].roundStartTime
    const postroundDuration = timeToSeconds(match.endTime) - timeToSeconds(lastRoundStartTime)

    return (
        <ul className="timeline timeline-vertical">
            {rounds.map((round, roundIdx) =>
                <React.Fragment key={timeToString(round.roundStartTime)}>
                    <InterRoundSegment
                        height={getPreroundDuration(roundIdx)}
                    >
                    </InterRoundSegment>
                    <RoundSegment round={round} roundIdx={roundIdx} matchId={matchId} />
                </React.Fragment>
            )}
            <InterRoundSegment
                height={postroundDuration}
            >
            </InterRoundSegment>
        </ul >
    )
}

const RoundSegment = ({ round, roundIdx, matchId }: { round: MatchRound, roundIdx: number, matchId: string }) => {
    const { data } = useGetKills(matchId)
    if (!data) {
        return null
    }
    const kills = data.filter(k => timeToSeconds(k.time) > timeToSeconds(round.roundStartTime) && timeToSeconds(k.time) < timeToSeconds(round.roundEndTime))
    const partitionedKillsDict = _.groupBy(kills, k => Math.ceil(timeToSeconds(k.time) / 5))
    const partitionedKills = _.values(partitionedKillsDict)
    const getKillGroupTime = (ks: Kill[]) => Math.min(...ks.map(k => k.time).map(timeToSeconds))
    return <div>
        <WeaponSegment
            height={getKillGroupTime(partitionedKills[0]) - timeToSeconds(round.roundStartTime)}
            icon={<div className="avatar avatar-placeholder -top-1 tooltip">
                <div className="tooltip-content flex flex-col">
                    {Object.entries(round).map(([key, value]) => <p key={key}>{`${key}: ${key.toLowerCase().includes("time") ? timeToString(value) : JSON.stringify(value)}`}</p>)}
                </div>
                <div className="bg-indigo-800 text-neutral-content w-8 rounded-full">
                    <span className="text-xs">{roundIdx + 1}</span>
                </div>
            </div>}
        />
        {partitionedKills.map((killGroup, idx) => {
            const killTime = getKillGroupTime(killGroup)
            const nextTime = idx === partitionedKills.length - 1 ? timeToSeconds(round.roundEndTime) : getKillGroupTime(partitionedKills[idx + 1])
            const height = nextTime - killTime
            return <WeaponSegment
                key={killGroup[0].player2}
                height={height}
                icon={<WeaponRow kills={killGroup} className="relative -top-1" />}
            />
        })}
    </div>
}

const InterRoundSegment = ({ height }: { height: number }) => {
    const [collapsed, setCollapsed] = useState(false)
    return <div
        className={getLineHeightClassName(collapsed ? 20 : height) + " " + "transition-[height] flex justify-center"}
        onClick={() => setCollapsed(!collapsed)}
    >
        <div className={"w-4 h-full border-1 bg-zinc-900 border-zinc-800"} />
    </div>
}
const WeaponSegment = ({ height, icon }: { height: number, icon?: ReactNode }) => {
    return <div
        className={getLineHeightClassName(height) + " " + "transition-[height] flex justify-center"}
    >
        <div className={'absolute'}>
            {icon}
        </div>
        <div className={"bg-indigo-900 w-4 h-full"} />
    </div>
}
