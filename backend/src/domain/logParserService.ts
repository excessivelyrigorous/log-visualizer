import fs from 'fs/promises';
import { RawLogEntry, MessageType } from './models/rawLogModels';

const logLineRegex = /^\d{2}\/\d{2}\/\d{4} - (\d{2}):(\d{2}):(\d{2}): (.+)$/

export const parseLogFile = async (filePath: string): Promise<RawLogEntry[]> => {
  const raw = await fs.readFile(filePath, { encoding: 'utf8' });
  const lines = raw.split('\r\n');

  const parsedEntries: RawLogEntry[] = [];

  for (const line of lines) {
    const match = logLineRegex.exec(line);
    if (!match) continue;

    const [_, hour, minute, second, message] = match;

    const time = { hour: Number.parseInt(hour), minute: Number.parseInt(minute), second: Number.parseInt(second) };
    const entry = parseRawMessage(time, message);
    parsedEntries.push(entry);
  }

  return parsedEntries;
}

const getMessageType = (msg: string): MessageType => {
  const adminNames = ['[FACEIT]', '\u0004[FACEIT^]', '\u0007[FACEIT^]'];
  const isAdminMessage = adminNames.some(n => msg.startsWith(n) || msg.startsWith(' ' + n))
  if (msg.startsWith('Match pause is enabled')) return 'MATCH_PAUSE';
  if (msg.startsWith('Match pause is disabled')) return 'MATCH_UNPAUSE';
  if (msg.includes('connected, address')) return 'PLAYER_CONNECTED';
  if (msg.includes('entered the game')) return 'PLAYER_ENTERED';
  if (msg.includes('STEAM USERID validated')) return 'PLAYER_VALIDATED';
  if (msg.includes('switched from team')) return 'TEAM_SWITCH';
  if (msg.includes('picked up')) return 'PICKUP';
  if (msg.includes('dropped')) return 'DROP';
  if (msg.includes('Round_Start')) return 'ROUND_START';
  if (msg.includes('Match_Start')) return 'MATCH_START';
  if (msg.startsWith('MatchStatus: Team playing ')) return 'MATCH_STATUS_TEAM_PLAYING';
  if (msg.startsWith('MatchStatus: Score: ')) return 'MATCH_STATUS_SCORE';
  if (msg.includes('scored')) return 'TEAM_SCORE';
  if (msg.startsWith('Team playing')) return 'TEAM_PLAYING';
  if (msg.startsWith('World triggered')) return 'WORLD_TRIGGER';
  if (msg === 'Your server needs to be restarted in order to receive the latest update.') return 'SERVER_RESTART_NEEDED';
  if (msg.startsWith('server_cvar:')) return 'SERVER_CVAR';
  if (isAdminMessage) return 'ADMIN';
  if (msg.includes('>\" has ')) return 'HAS_MONEY';
  if (msg.includes('money change')) return 'MONEY_CHANGE';
  if (msg.includes('purchased')) return 'PURCHASED';
  if (msg.includes('Starting Freeze period')) return 'FREEZE_PERIOD_START';
  if (msg.includes('left buyzone with')) return 'LEFT_BUYZONE';
  if (msg.includes('killed other') && msg.includes('with')) return 'KILLED_OTHER';
  if (msg.includes('killed') && msg.includes('with')) return 'KILLED';
  if (msg.includes(' assisted killing ')) return 'ASSIST';
  if (msg.includes(' flash-assisted killing ')) return 'FLASH_ASSIST';
  if (msg.includes('attacked')) return 'ATTACKED';
  if (msg.includes(' threw ')) return 'THROW_GRENADE';
  if (msg.includes(' disconnected (reason ')) return 'DISCONNECT';
  if (msg.startsWith('Molotov projectile spawned at ')) return 'MOLOTOV_PROJECTILE_SPAWN';
  if (msg.includes(' triggered ')) return 'TRIGGER';
  if (msg.includes(' say ')) return 'SAY';
  if (msg.includes(' say_team ')) return 'SAY_TEAM';
  if (msg.includes(' blinded for ')) return 'BLINDED';
  if (msg.startsWith('Vote started ')) return 'VOTE_STARTED';
  if (msg.startsWith('Vote cast ')) return 'VOTE_CAST';
  if (msg.startsWith('Vote succeeded ')) return 'VOTE_SUCCEEDED';
  if (msg.startsWith('Game Over: ')) return 'GAME_OVER';
  if (msg.startsWith('ACCOLADE, FINAL: ')) return 'ACCOLADE';
  throw new Error(`Could not find type for message: ${msg}`)
};

const parseRawMessage = (time: RawLogEntry["time"], rawMessage: string): RawLogEntry => ({
  time,
  variables: [...rawMessage.matchAll(/"([^"]*)"/g)].map(m => m[1]),
  message: rawMessage,
  messageType: getMessageType(rawMessage),
});