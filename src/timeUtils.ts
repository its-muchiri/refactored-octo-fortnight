import {
  GRID_END_HOUR,
  GRID_START_HOUR,
  SLOT_MINUTES,
} from './constants'

export const GRID_START_MIN = GRID_START_HOUR * 60
export const GRID_END_MIN = GRID_END_HOUR * 60

export function minutesToTimeString(total: number): string {
  const h = Math.floor(total / 60)
  const m = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function parseTimeToMinutes(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim())
  if (!match) return null
  const h = Number(match[1])
  const m = Number(match[2])
  if (h < 0 || h > 23 || m < 0 || m > 59) return null
  return h * 60 + m
}

export function slotCount(): number {
  return ((GRID_END_MIN - GRID_START_MIN) / SLOT_MINUTES) | 0
}

export function clampToGrid(min: number): number {
  const snapped =
    Math.round((min - GRID_START_MIN) / SLOT_MINUTES) * SLOT_MINUTES +
    GRID_START_MIN
  return Math.min(Math.max(snapped, GRID_START_MIN), GRID_END_MIN - SLOT_MINUTES)
}

export function overlaps(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number,
): boolean {
  return aStart < bEnd && bStart < aEnd
}
