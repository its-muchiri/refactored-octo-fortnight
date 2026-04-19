import { useEffect, useState } from 'react'
import { TimetableGrid } from './components/TimetableGrid'
import { SessionEditor } from './components/SessionEditor'
import { validateSessionDraft } from './validateSessionDraft'
import type { EditorState, Session, SessionDraft } from './types'
import { SESSION_COLORS, SLOT_MINUTES } from './constants'
import {
  GRID_END_MIN,
  GRID_START_MIN,
  clampToGrid,
  minutesToTimeString,
} from './timeUtils'
import { findOverlappingSession } from './sessionUtils'
import { loadSessions, saveSessions } from './storage'
import './App.css'

function newDraft(
  partial: Partial<SessionDraft> & Pick<SessionDraft, 'dayIndex' | 'startMin'>,
): SessionDraft {
  const startMin = clampToGrid(partial.startMin)
  const rawEnd = partial.endMin ?? startMin + 60
  let endMin = Math.min(
    GRID_END_MIN,
    Math.round((rawEnd - GRID_START_MIN) / SLOT_MINUTES) * SLOT_MINUTES +
      GRID_START_MIN,
  )
  if (endMin <= startMin) {
    endMin = Math.min(GRID_END_MIN, startMin + SLOT_MINUTES)
  }
  return {
    title: partial.title ?? '',
    dayIndex: partial.dayIndex,
    startMin,
    endMin,
    color: partial.color ?? SESSION_COLORS[0],
  }
}

function sessionToDraft(s: Session): SessionDraft {
  return {
    title: s.title,
    dayIndex: s.dayIndex,
    startMin: s.startMin,
    endMin: s.endMin,
    color: s.color,
  }
}

export default function App() {
  const [sessions, setSessions] = useState<Session[]>(() => loadSessions())
  const [editor, setEditor] = useState<EditorState | null>(null)
  const [editorError, setEditorError] = useState<string | null>(null)

  useEffect(() => {
    saveSessions(sessions)
  }, [sessions])

  function openCreate(dayIndex: number, startMin: number) {
    const draft = newDraft({
      dayIndex,
      startMin: clampToGrid(startMin),
    })
    setEditorError(null)
    setEditor({ mode: 'create', draft })
  }

  function openEdit(session: Session) {
    setEditorError(null)
    setEditor({
      mode: 'edit',
      sessionId: session.id,
      draft: sessionToDraft(session),
    })
  }

  function closeEditor() {
    setEditor(null)
    setEditorError(null)
  }

  function setDraft(draft: SessionDraft) {
    setEditor((e) => (e ? { ...e, draft } : e))
  }

  function handleSave() {
    if (!editor) return
    const v = validateSessionDraft(editor.draft)
    if (!v.ok) {
      setEditorError(v.message)
      return
    }
    const overlap = findOverlappingSession(
      sessions,
      editor.draft.dayIndex,
      editor.draft.startMin,
      editor.draft.endMin,
      editor.mode === 'edit' ? editor.sessionId : undefined,
    )
    if (overlap) {
      setEditorError(
        `Overlaps with “${overlap.title}” (${minutesToTimeString(overlap.startMin)}–${minutesToTimeString(overlap.endMin)}).`,
      )
      return
    }
    setEditorError(null)
    if (editor.mode === 'create') {
      const s: Session = {
        id: crypto.randomUUID(),
        title: editor.draft.title.trim(),
        dayIndex: editor.draft.dayIndex,
        startMin: editor.draft.startMin,
        endMin: editor.draft.endMin,
        color: editor.draft.color,
      }
      setSessions((prev) => [...prev, s])
    } else {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === editor.sessionId
            ? {
                ...s,
                title: editor.draft.title.trim(),
                dayIndex: editor.draft.dayIndex,
                startMin: editor.draft.startMin,
                endMin: editor.draft.endMin,
                color: editor.draft.color,
              }
            : s,
        ),
      )
    }
    closeEditor()
  }

  function handleDelete() {
    if (!editor || editor.mode !== 'edit') return
    setSessions((prev) => prev.filter((s) => s.id !== editor.sessionId))
    closeEditor()
  }

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <h1 className="app__title">Weekly timetable</h1>
          <p className="app__subtitle">
            Plan recurring blocks; data stays in this browser.
          </p>
        </div>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => openCreate(0, GRID_START_MIN + 9 * 60)}
        >
          Add session
        </button>
      </header>

      <TimetableGrid
        sessions={sessions}
        onSlotClick={openCreate}
        onSessionClick={openEdit}
      />

      {editor ? (
        <SessionEditor
          state={editor}
          error={editorError}
          onChange={(d) => {
            setEditorError(null)
            setDraft(d)
          }}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={closeEditor}
        />
      ) : null}
    </div>
  )
}
