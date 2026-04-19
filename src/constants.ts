export const DAY_LABELS = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun',
] as const

/** First hour shown on the grid (inclusive) */
export const GRID_START_HOUR = 7
/** Hour after which the grid ends (e.g. 22 → rows through 21:30) */
export const GRID_END_HOUR = 22

export const SLOT_MINUTES = 30

export const SLOT_HEIGHT_PX = 28

export const SESSION_COLORS = [
  '#1a4d7a',
  '#c9a227',
  '#2d6aaf',
  '#152238',
  '#d4af37',
  '#3d7ec9',
] as const

export const STORAGE_KEY = 'calendar-timetable-sessions-v1'
