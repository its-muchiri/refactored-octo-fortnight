import { useMemo } from 'react'
import type { Session } from '../types'
import { DAY_LABELS } from '../constants'
import { sessionsForDay } from '../sessionUtils'

const YEAR = 2026

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const

function daysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate()
}

/** Monday = 0 … Sunday = 6, matching `Session.dayIndex` */
function dayIndexFromDate(year: number, monthIndex: number, day: number): number {
  const js = new Date(year, monthIndex, day).getDay()
  return js === 0 ? 6 : js - 1
}

function monthRows(year: number, monthIndex: number): (number | null)[][] {
  const dim = daysInMonth(year, monthIndex)
  const first = new Date(year, monthIndex, 1).getDay()
  const startPad = first === 0 ? 6 : first - 1
  const cells: (number | null)[] = []
  for (let i = 0; i < startPad; i++) cells.push(null)
  for (let d = 1; d <= dim; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  const rows: (number | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7))
  }
  return rows
}

function isToday(year: number, monthIndex: number, day: number): boolean {
  const n = new Date()
  return (
    n.getFullYear() === year &&
    n.getMonth() === monthIndex &&
    n.getDate() === day
  )
}

type Props = {
  sessions: Session[]
}

export function MonthlyCalendar2026({ sessions }: Props) {
  const rowsByMonth = useMemo(() => {
    return MONTH_NAMES.map((_, mi) => monthRows(YEAR, mi))
  }, [])

  return (
    <div className="year-cal" aria-label={`${YEAR} monthly calendar`}>
      <div className="year-cal__banner">
        <p className="year-cal__year">{YEAR}</p>
        <p className="year-cal__lede">
          Dots show days that match a weekday with sessions in your timetable (Mon–Sun
          blocks apply to every occurrence of that weekday).
        </p>
      </div>

      <div className="year-cal__months">
        {MONTH_NAMES.map((name, monthIndex) => (
          <section key={name} className="year-cal__month" aria-labelledby={`ym-${monthIndex}`}>
            <h2 className="year-cal__month-title" id={`ym-${monthIndex}`}>
              {name}
            </h2>
            <div className="year-cal__dow" role="row">
              {DAY_LABELS.map((d) => (
                <div key={d} className="year-cal__dow-cell" role="columnheader">
                  {d}
                </div>
              ))}
            </div>
            <div className="year-cal__grid">
              {rowsByMonth[monthIndex].map((row, ri) => (
                <div key={ri} className="year-cal__row" role="row">
                  {row.map((day, ci) => {
                    if (day === null) {
                      return (
                        <div
                          key={`e-${ri}-${ci}`}
                          className="year-cal__cell year-cal__cell--empty"
                          aria-hidden
                        />
                      )
                    }
                    const dayIndex = dayIndexFromDate(YEAR, monthIndex, day)
                    const daySessions = sessionsForDay(sessions, dayIndex)
                    const hasSessions = daySessions.length > 0
                    const today = isToday(YEAR, monthIndex, day)
                    return (
                      <div
                        key={day}
                        className={[
                          'year-cal__cell',
                          today ? 'year-cal__cell--today' : '',
                          hasSessions ? 'year-cal__cell--busy' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        title={
                          hasSessions
                            ? `${day} ${name}: ${daySessions.length} session(s) this weekday`
                            : undefined
                        }
                      >
                        <span className="year-cal__day-num">{day}</span>
                        {hasSessions ? (
                          <span className="year-cal__dots" aria-hidden>
                            {daySessions.slice(0, 4).map((s) => (
                              <span
                                key={s.id}
                                className="year-cal__dot"
                                style={{ background: s.color }}
                              />
                            ))}
                          </span>
                        ) : null}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
