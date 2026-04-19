import type { Session } from './types'
import { STORAGE_KEY } from './constants'

function isSession(x: unknown): x is Session {
  if (!x || typeof x !== 'object') return false
  const o = x as Record<string, unknown>
  return (
    typeof o.id === 'string' &&
    typeof o.title === 'string' &&
    typeof o.dayIndex === 'number' &&
    typeof o.startMin === 'number' &&
    typeof o.endMin === 'number' &&
    typeof o.color === 'string'
  )
}

export function loadSessions(): Session[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isSession)
  } catch {
    return []
  }
}

export function saveSessions(sessions: Session[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
}
