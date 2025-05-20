import _ from "lodash"
import { useGetRounds } from "../api/matches"
import { Timeline } from "../components/Timeline"

export const TimelinePage = ({ matchId }: { matchId: string }) => {
    const { data: rounds, error: roundsError, isLoading: isLoadingRounds } = useGetRounds(matchId)
    if (!rounds) {
        return <span className="loading loading-spinner loading-xl"></span>
    }
    const scores = rounds[rounds.length - 1].teamScores
    return <div className="w-full">
        <div className="flex items-center gap-2">
            <div className="flex flex-row flex-1 justify-between items-center">
                <div className="text-md">{scores[0].score}</div>
                <div className="text-xl">{scores[0].team}</div>
            </div>
            <div className="flex-none">vs</div>
            <div className="flex flex-row flex-1 justify-between items-center">
                <div className="text-xl">{scores[1].team}</div>
                <div className="text-md">{scores[1].score}</div>
            </div>
        </div>
        <Timeline />
    </div>
}