import 'chart.js/auto';
import _ from 'lodash';
import { useGetMatches } from './api/matches';
import { TimelinePage } from './pages/TimelinePage';
import { Spinner } from './components/Spinner';

function App() {
  const { data: matches } = useGetMatches()
  const matchId = matches?.[0].matchId

  if (!matchId) {
    return <Spinner />
  }

  return (
    <div className="p-4 w-screen">
      <TimelinePage matchId={matchId} />
    </div>
  );
}

export default App;
