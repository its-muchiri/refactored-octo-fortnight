import type { Session } from './types'
import { overlaps } from './timeUtils'

export function findOverlappingSession(
  sessions: Session[],
  dayIndex: number,
  startMin: number,
  endMin: number,
  excludeId?: string,
): Session | undefined {
  return sessions.find(
    (s) =>
      s.dayIndex === dayIndex &&
      s.id !== excludeId &&
      overlaps(s.startMin, s.endMin, startMin, endMin),
  )
}

export function sessionsForDay(sessions: Session[], dayIndex: number): Session[] {
  return sessions
    .filter((s) => s.dayIndex === dayIndex)
    .slice()
    .sort((a, b) => a.startMin - b.startMin)
}
