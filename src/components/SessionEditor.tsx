import { useEffect, useId, useRef } from 'react'
import type { EditorState, SessionDraft } from '../types'
import { DAY_LABELS, SESSION_COLORS, SLOT_MINUTES } from '../constants'
import { minutesToTimeString, parseTimeToMinutes } from '../timeUtils'

type Props = {
  state: EditorState
  error: string | null
  onChange: (draft: SessionDraft) => void
  onSave: () => void
  onDelete: () => void
  onClose: () => void
}

export function SessionEditor({
  state,
  error,
  onChange,
  onSave,
  onDelete,
  onClose,
}: Props) {
  const titleId = useId()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    if (!el.open) el.showModal()
    titleInputRef.current?.focus()
    titleInputRef.current?.select()
  }, [])

  const { draft } = state
  const startStr = minutesToTimeString(draft.startMin)
  const endStr = minutesToTimeString(draft.endMin)

  return (
    <dialog ref={dialogRef} className="session-editor" onClose={onClose}>
      <form
        method="dialog"
        className="session-editor__form"
        onSubmit={(e) => {
          e.preventDefault()
          onSave()
        }}
      >
        <header className="session-editor__head">
          <h2>{state.mode === 'create' ? 'New session' : 'Edit session'}</h2>
          <button
            type="button"
            className="session-editor__icon-btn"
            aria-label="Close"
            onClick={onClose}
          >
            ×
          </button>
        </header>

        <div className="session-editor__body">
          <label className="field" htmlFor={titleId}>
            <span>Title</span>
            <input
              ref={titleInputRef}
              id={titleId}
              value={draft.title}
              onChange={(e) =>
                onChange({ ...draft, title: e.target.value })
              }
              placeholder="e.g. Algebra II"
              autoComplete="off"
            />
          </label>

          <label className="field">
            <span>Day</span>
            <select
              value={draft.dayIndex}
              onChange={(e) =>
                onChange({ ...draft, dayIndex: Number(e.target.value) })
              }
            >
              {DAY_LABELS.map((label, i) => (
                <option key={label} value={i}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <div className="field-row">
            <label className="field">
              <span>Start</span>
              <input
                type="time"
                step={SLOT_MINUTES * 60}
                value={startStr}
                onChange={(e) => {
                  const m = parseTimeToMinutes(e.target.value)
                  if (m === null) return
                  onChange({ ...draft, startMin: m })
                }}
              />
            </label>
            <label className="field">
              <span>End</span>
              <input
                type="time"
                step={SLOT_MINUTES * 60}
                value={endStr}
                onChange={(e) => {
                  const m = parseTimeToMinutes(e.target.value)
                  if (m === null) return
                  onChange({ ...draft, endMin: m })
                }}
              />
            </label>
          </div>

          <fieldset className="color-field">
            <legend>Color</legend>
            <div className="color-field__swatches">
              {SESSION_COLORS.map((c) => (
                <label key={c} className="color-swatch">
                  <input
                    type="radio"
                    name="session-color"
                    value={c}
                    checked={draft.color === c}
                    onChange={() => onChange({ ...draft, color: c })}
                  />
                  <span style={{ background: c }} />
                </label>
              ))}
            </div>
          </fieldset>

          {error ? <p className="session-editor__error">{error}</p> : null}
        </div>

        <footer className="session-editor__foot">
          {state.mode === 'edit' ? (
            <button
              type="button"
              className="btn btn--danger"
              onClick={onDelete}
            >
              Delete
            </button>
          ) : (
            <span />
          )}
          <div className="session-editor__foot-actions">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary">
              Save
            </button>
          </div>
        </footer>
      </form>
    </dialog>
  )
}
