import type { SessionDraft } from './types'
import { GRID_END_HOUR, GRID_START_HOUR, SLOT_MINUTES } from './constants'
import { GRID_END_MIN, GRID_START_MIN } from './timeUtils'

export function validateSessionDraft(
  draft: SessionDraft,
): { ok: true } | { ok: false; message: string } {
  if (!draft.title.trim()) {
    return { ok: false, message: 'Please enter a title.' }
  }
  if (draft.endMin <= draft.startMin) {
    return { ok: false, message: 'End time must be after start time.' }
  }
  if (draft.endMin - draft.startMin < SLOT_MINUTES) {
    return {
      ok: false,
      message: `Sessions must be at least ${SLOT_MINUTES} minutes.`,
    }
  }
  if (draft.startMin < GRID_START_MIN || draft.endMin > GRID_END_MIN) {
    return {
      ok: false,
      message: `Keep the session between ${String(GRID_START_HOUR).padStart(2, '0')}:00 and ${String(GRID_END_HOUR).padStart(2, '0')}:00.`,
    }
  }
  return { ok: true }
}
