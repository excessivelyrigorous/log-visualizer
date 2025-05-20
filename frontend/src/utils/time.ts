import type { RawLogEntryTime } from "../api/models/rawModels";

const leftPadZero = (n: number): string => n < 10 ? "0" + n : n.toString()
export const timeToString = (t: RawLogEntryTime) => [t.hour, t.minute, t.second].map(leftPadZero).join(":")
export const timeToSeconds = (t: RawLogEntryTime) => t.hour * 60 * 60 + t.minute * 60 + t.second
