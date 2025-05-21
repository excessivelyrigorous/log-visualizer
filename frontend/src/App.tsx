import 'chart.js/auto';
import _ from 'lodash';
import { useGetMatches } from './api/matches';
import { TimelinePage } from './pages/TimelinePage';

function App() {
  const { data: matches } = useGetMatches()
  const matchId = matches?.[0].matchId

  if (!matchId) {
    return <span className="loading loading-spinner loading-xl"></span>
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Log Visualizer</h1>
      <TimelinePage matchId={matchId} />
    </div>
  );
}

export default App;
