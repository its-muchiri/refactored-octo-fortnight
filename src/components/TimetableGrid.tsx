import type { Session } from '../types'
import {
  DAY_LABELS,
  GRID_END_HOUR,
  GRID_START_HOUR,
  SLOT_HEIGHT_PX,
  SLOT_MINUTES,
} from '../constants'
import {
  GRID_END_MIN,
  GRID_START_MIN,
  minutesToTimeString,
  slotCount,
} from '../timeUtils'
import { sessionsForDay } from '../sessionUtils'

type Props = {
  sessions: Session[]
  onSlotClick: (dayIndex: number, startMin: number) => void
  onSessionClick: (session: Session) => void
}

export function TimetableGrid({
  sessions,
  onSlotClick,
  onSessionClick,
}: Props) {
  const rows = slotCount()
  const totalHeight = rows * SLOT_HEIGHT_PX

  const timeLabels: number[] = []
  for (let m = GRID_START_MIN; m < GRID_END_MIN; m += SLOT_MINUTES) {
    timeLabels.push(m)
  }

  return (
    <div className="timetable" role="grid" aria-label="Weekly timetable">
      <div
        className="timetable__scroll"
        style={{ ['--slot-h' as string]: `${SLOT_HEIGHT_PX}px` }}
      >
        <div
          className="timetable__inner"
          style={{ minHeight: `${totalHeight + 40}px` }}
        >
          <div className="timetable__corner" aria-hidden />
          {DAY_LABELS.map((label) => (
            <div key={label} className="timetable__day-head" role="columnheader">
              {label}
            </div>
          ))}

          <div className="timetable__times" role="row">
            {timeLabels.map((m) => (
              <div key={m} className="timetable__time-label">
                {minutesToTimeString(m)}
              </div>
            ))}
          </div>

          {DAY_LABELS.map((_, dayIndex) => (
            <div
              key={dayIndex}
              className="timetable__day-col"
              role="gridcell"
              onClick={(e) => {
                const t = e.target as HTMLElement
                if (t.closest('.timetable__session')) return
                const rect = e.currentTarget.getBoundingClientRect()
                const y = e.clientY - rect.top
                const slot = Math.max(
                  0,
                  Math.min(rows - 1, Math.floor(y / SLOT_HEIGHT_PX)),
                )
                const startMin = GRID_START_MIN + slot * SLOT_MINUTES
                onSlotClick(dayIndex, startMin)
              }}
            >
              <div className="timetable__slots" aria-hidden>
                {timeLabels.map((m) => (
                  <div key={m} className="timetable__slot-line" />
                ))}
              </div>
              {sessionsForDay(sessions, dayIndex).map((s) => {
                const top =
                  ((s.startMin - GRID_START_MIN) / SLOT_MINUTES) *
                  SLOT_HEIGHT_PX
                const height =
                  ((s.endMin - s.startMin) / SLOT_MINUTES) * SLOT_HEIGHT_PX
                return (
                  <button
                    key={s.id}
                    type="button"
                    className="timetable__session"
                    style={{
                      top: `${top}px`,
                      height: `${Math.max(height - 4, SLOT_HEIGHT_PX - 4)}px`,
                      borderColor: s.color,
                      background: `color-mix(in srgb, ${s.color} 22%, transparent)`,
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      onSessionClick(s)
                    }}
                  >
                    <span className="timetable__session-title">{s.title}</span>
                    <span className="timetable__session-time">
                      {minutesToTimeString(s.startMin)} –{' '}
                      {minutesToTimeString(s.endMin)}
                    </span>
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>
      <p className="timetable__hint">
        Click a blank cell to add a session. Click a block to edit. Times:{' '}
        {String(GRID_START_HOUR).padStart(2, '0')}:00–
        {String(GRID_END_HOUR).padStart(2, '0')}:00.
      </p>
    </div>
  )
}
