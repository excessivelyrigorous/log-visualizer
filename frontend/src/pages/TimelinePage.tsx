import _ from "lodash"
import { useGetRounds } from "../api/matches"
import { Timeline } from "../components/Timeline"

export const TimelinePage = ({ matchId }: { matchId: string }) => {
    const { data: rounds, error: roundsError, isLoading: isLoadingRounds } = useGetRounds(matchId)
    if (!rounds) {
        return <span className="loading loading-spinner loading-xl"></span>
    }
    const teams = _.uniq(rounds.map(r => r.winningTeamId))
    if (teams?.length !== 2) {
        throw new Error(`Expected exactly two teams. Got ${JSON.stringify(teams)}`)
    }
    const scores = rounds[rounds.length - 1].teamScores
    console.log('scores', scores)
    const score0 = scores.find(s => s.team == teams[0])
    const score1 = scores.find(s => s.team == teams[1])
    console.log('score0', score0)
    console.log('teams[0]', teams[0])
    console.log('teams[1]', teams[1])
    console.log('scores.find(s => s.team)', scores.find(s => s.team === 'GGBET'))
    console.log('score1', score1)
    console.log(`'TeamVitality' == teams[0]`, 'TeamVitality' == teams[0])
    console.log(`'NAVI GGBET' == teams[1]`, 'NAVI GGBET' == teams[1])
    console.log('typeof teams[0]', typeof teams[0])
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