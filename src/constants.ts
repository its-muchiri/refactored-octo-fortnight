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
  '#5b8def',
  '#34c759',
  '#ff9f0a',
  '#ff375f',
  '#bf5af2',
  '#64d2ff',
] as const

export const STORAGE_KEY = 'calendar-timetable-sessions-v1'
