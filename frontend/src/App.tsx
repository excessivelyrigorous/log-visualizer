import { useEffect, useState } from 'react';
import 'chart.js/auto';
import { getMatchLog, getMatchLogs } from './api/logs';
import * as _ from 'lodash';
import type { MatchLog, MatchLogVerbose } from './api/models/rawModels';
import { useGetMatches } from './api/matches';
import { TimelinePage } from './pages/TimelinePage';

function App() {
  const { data: matches } = useGetMatches()
  const matchId = matches?.[0].matchId
  const [matchLog, setMatchLog] = useState<MatchLogVerbose>();
  const [matchLogs, setMatchLogs] = useState<MatchLog[]>([]);
  const matchName = matchLogs?.[0]?.matchName; //for now, assume there is one match
  const logEntriesByType = _.groupBy(matchLog?.logEntries, "messageType");
  const messagesByType = Object.entries(logEntriesByType).map(p => ({ type: p[0], messages: p[1].map(e => e.message) }));
  console.log('logEntriesByType', logEntriesByType);
  console.log('messagesByType', messagesByType);

  useEffect(() => {
    getMatchLogs()
      .then(res => setMatchLogs(res.data))
      .catch(err => console.error('Error fetching matches:', err));
  }, []);
  useEffect(() => {
    if (matchName) {
      getMatchLog(matchName)
        .then(res => setMatchLog(res.data))
        .catch(err => console.error('Error fetching logs:', err));
    }
  }, [matchName]);

  if (!matchId) {
    return <span className="loading loading-spinner loading-xl"></span>
  }

  return (
    <div className="p-4 width-full">
      <h1 className="text-xl font-bold">Log Visualizer</h1>
      <TimelinePage matchId={matchId} />
    </div>
  );
}

export default App;