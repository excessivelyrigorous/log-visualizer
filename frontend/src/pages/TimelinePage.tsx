import _ from "lodash"
import { useGetRounds } from "../api/matches"
import { Timeline } from "../components/Timeline"
import { Spinner } from "../components/Spinner"

export const TimelinePage = ({ matchId }: { matchId: string }) => {
    const { data: rounds } = useGetRounds(matchId)
    if (!rounds) {
        return <Spinner />
    }
    const scores = rounds[rounds.length - 1].teamScores
    return <>
        <div className="flex justify-center items-center gap-3">
            <div className="flex flex-row flex-1 justify-between items-center max-w-50">
                <div className="text-md">{scores[0].score}</div>
                <div className="text-xl">{scores[0].team}</div>
            </div>
            <div className="flex-none">vs</div>
            <div className="flex flex-row flex-1 justify-between items-center max-w-50">
                <div className="text-xl">{scores[1].team}</div>
                <div className="text-md">{scores[1].score}</div>
            </div>
        </div>
        <Timeline matchId={matchId} />
    </>
}
