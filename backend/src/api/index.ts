import express from 'express';
import cors from 'cors';
import { getKills, getMatch, getMatches, getRounds } from '../data/processedLogsClient';
import { getMatchRawLog, getMatchRawLogs } from '../data/rawLogsClient';

const app = express();
const PORT = 3001;

app.use(cors());

app.get('/matches', async (_req, res) => {
  try {
    const matches = await getMatches();
    res.json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch match-log' });
  }
});

app.get('/matches/:matchId', async (_req, res) => {
  try {
    const match = await getMatch(_req.params.matchId);
    res.json(match);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch match-log' });
  }
});

app.get('/matches/:matchId/rounds', async (_req, res) => {
  try {
    const rounds = await getRounds(_req.params.matchId);
    res.json(rounds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch match-log' });
  }
});

app.get('/matches/:matchId/kills', async (_req, res) => {
  try {
    const kills = await getKills(_req.params.matchId);
    res.json(kills);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch match-log' });
  }
});

app.get('/match-logs/:matchId', async (_req, res) => {
  try {
    const matchLog = await getMatchRawLog(_req.params.matchId);
    res.json(matchLog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch match-log' });
  }
});

app.get('/match-logs', async (_req, res) => {
  try {
    const matchLogs = await getMatchRawLogs();
    res.json(matchLogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch match-logs' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
