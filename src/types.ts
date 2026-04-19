export type Session = {
  id: string
  title: string
  /** 0 = Monday … 6 = Sunday */
  dayIndex: number
  /** Minutes from midnight */
  startMin: number
  endMin: number
  color: string
}

export type EditorState =
  | { mode: 'create'; draft: SessionDraft }
  | { mode: 'edit'; sessionId: string; draft: SessionDraft }

export type SessionDraft = {
  title: string
  dayIndex: number
  startMin: number
  endMin: number
  color: string
}
