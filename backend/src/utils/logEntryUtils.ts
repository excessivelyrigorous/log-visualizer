import { RawLogEntryTime } from "../domain/models/rawLogModels";

export const getSecondsSinceMidnight = (t: RawLogEntryTime) => t.hour * 60 * 60 + t.minute * 60 + t.second

/**
 * @returns a positive number if @param t1 is greater than @param t2, 0 if they are equal, and a negative number otherwise.
 */
export const timeCompare = (t1: RawLogEntryTime, t2: RawLogEntryTime) => getSecondsSinceMidnight(t1) - getSecondsSinceMidnight(t2)