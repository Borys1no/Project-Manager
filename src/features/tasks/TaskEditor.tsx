import { useState, useEffect, useRef, useCallback, useId, type FormEvent } from 'react'
import { useTaskStore } from '../../stores/taskStore'
import { useProjectStore } from '../../stores/projectStore'
import { taskInputSchema, taskPriorityLabels, type Task, type TaskPriority } from '../../types/task'
import { getProjectColumns } from '../../types/column'
import { MarkdownRenderer } from '../../components/ui/MarkdownRenderer'
import type { Project } from '../../types/project'

type TaskEditorMode = 'create' | 'edit'

type ExtendedTask = Task & {
  sprintId?: string
  tagIds?: string[]
}

type TaskEditorProps = {
  projectId: string
  columnId: string
  task?: ExtendedTask
  onClose: () => void
  project?: Project
  columnName?: string
}

type Tag = { name: string; color: string }

const DEFAULT_TAGS: Tag[] = [
  { name: 'frontend', color: '#3B82F6' },
  { name: 'backend', color: '#8B5CF6' },
  { name: 'bug', color: '#EF4444' },
  { name: 'feature', color: '#10B981' },
]

const CUSTOM_TAG_COLOR = '#6366F1'

const priorityPillClasses: Record<TaskPriority, { selected: string; idle: string }> = {
  low: {
    selected: 'bg-slate-500 text-white',
    idle: 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700',
  },
  medium: {
    selected: 'bg-blue-500 text-white',
    idle: 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:hover:bg-blue-500/30',
  },
  high: {
    selected: 'bg-orange-500 text-white',
    idle: 'bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-500/20 dark:text-orange-300 dark:hover:bg-orange-500/30',
  },
  urgent: {
    selected: 'bg-red-500 text-white',
    idle: 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-500/20 dark:text-red-300 dark:hover:bg-red-500/30',
  },
}

const priorityIconClasses: Record<TaskPriority, string> = {
  low: 'text-slate-500 dark:text-slate-400',
  medium: 'text-blue-500 dark:text-blue-400',
  high: 'text-orange-500 dark:text-orange-400',
  urgent: 'text-red-500 dark:text-red-400',
}

function RowIcon({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <svg
      className={`h-4 w-4 shrink-0 ${className ?? ''}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

function PropertyRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-9 items-center gap-3">
      {icon}
      <span className="w-36 shrink-0 text-sm text-slate-500 dark:text-slate-400">{label}</span>
      <div className="flex min-w-0 flex-1 items-center gap-2">{children}</div>
    </div>
  )
}

const borderlessInput =
  'min-w-0 rounded-md bg-transparent px-1.5 py-1 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 hover:bg-slate-50 focus:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-400 dark:hover:bg-slate-800/60 dark:focus:bg-slate-800/60'

export function TaskEditor({
  projectId,
  columnId,
  task,
  onClose,
  project,
  columnName,
}: TaskEditorProps) {
  const mode: TaskEditorMode = task ? 'edit' : 'create'
  const createTask = useTaskStore((state) => state.createTask)
  const updateTask = useTaskStore((state) => state.updateTask)
  const projects = useProjectStore((state) => state.projects)

  const currentProject = project ?? projects.find((p) => p.id === projectId)
  const columns = getProjectColumns(projectId)
  const currentColumn = columns.find((c) => c.id === columnId)
  const pendingColumn = columns.find((c) => c.id.endsWith(':pendiente'))
  const statusLabel = mode === 'create' ? 'Pendiente' : (columnName ?? currentColumn?.name ?? '')

  const [title, setTitle] = useState(task?.title ?? '')
  const [content, setContent] = useState(task?.content ?? '')
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? 'medium')
  const [dueDate, setDueDate] = useState(task?.dueDate ?? '')
  const [sprint, setSprint] = useState(task?.sprintId ?? '')
  const [tags, setTags] = useState<string[]>(task?.tagIds ?? [])
  const [showPreview, setShowPreview] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newTag, setNewTag] = useState('')

  const titleInputRef = useRef<HTMLInputElement>(null)
  const titleId = useId()
  const contentId = useId()
  const errorId = useId()

  const createdLabel = task
    ? new Date(task.createdAt).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Hoy'

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setError(null)

      const result = taskInputSchema.safeParse({
        title,
        content,
        priority,
        dueDate: dueDate === '' ? null : dueDate,
      })

      if (!result.success) {
        setError(result.error.issues[0]?.message ?? 'Revisa los datos del formulario.')
        return
      }

      try {
        const taskData = {
          ...result.data,
          sprintId: sprint.trim() || undefined,
          tagIds: tags,
        }

        if (mode === 'create') {
          createTask(projectId, pendingColumn?.id ?? columnId, taskData)
        } else if (task) {
          await updateTask(task.id, taskData)
        }
        onClose()
      } catch {
        setError('No se pudo guardar la tarea. Inténtalo de nuevo.')
      }
    },
    [mode, title, content, priority, dueDate, sprint, tags, projectId, columnId, pendingColumn, task, createTask, updateTask, onClose]
  )

  useEffect(() => {
    titleInputRef.current?.focus()
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault()
        handleSubmit({ currentTarget: null, target: null, preventDefault: () => {}, stopPropagation: () => {}, nativeEvent: event } as unknown as FormEvent<HTMLFormElement>)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleSubmit])

  const handleCancel = useCallback(() => {
    onClose()
  }, [onClose])

  const handleAddTag = () => {
    const trimmed = newTag.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
      setNewTag('')
    }
  }

  const availableTags = [
    ...DEFAULT_TAGS,
    ...tags
      .filter((t) => !DEFAULT_TAGS.some((d) => d.name === t))
      .map((t) => ({ name: t, color: CUSTOM_TAG_COLOR })),
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4 dark:bg-black/60"
      onClick={handleCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        className="w-full max-w-3xl rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
      >
        {/* Top Bar */}
        <header className="flex items-center justify-between gap-4 px-6 py-3.5 flex-shrink-0">
          <div className="flex min-w-0 items-center gap-3">
            {currentProject && (
              <>
                <span
                  aria-hidden="true"
                  className="h-7 w-7 shrink-0 rounded-lg"
                  style={{ backgroundColor: currentProject.color }}
                />
                <span className="max-w-[10rem] truncate text-sm font-medium text-slate-700 dark:text-slate-200 sm:max-w-xs">
                  {currentProject.name}
                </span>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">/</span>
              </>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-medium text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
              {statusLabel}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e as unknown as FormEvent<HTMLFormElement>)}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
            >
              {mode === 'create' ? 'Crear tarea' : 'Guardar cambios'}
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2">
          {/* Title - Notion style */}
          <input
            ref={titleInputRef}
            id={titleId}
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              setError(null)
            }}
            placeholder="Ingresar título…"
            className="w-full border-none bg-transparent text-3xl font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
            aria-describedby={error ? errorId : undefined}
            aria-invalid={error !== null}
            style={{ lineHeight: 1.2 }}
          />

          {/* Properties - vertical, borderless, colored icons */}
          <div className="mt-5 space-y-0.5">
            {/* Creation date */}
            <PropertyRow
              icon={<RowIcon className="text-indigo-500 dark:text-indigo-400"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></RowIcon>}
              label="Fecha de creación"
            >
              <span className="text-sm text-slate-600 dark:text-slate-300">{createdLabel}</span>
            </PropertyRow>

            {/* Due date */}
            <PropertyRow
              icon={<RowIcon className="text-amber-500 dark:text-amber-400"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></RowIcon>}
              label="Fecha entrega"
            >
              <input
                type="date"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value)
                  setError(null)
                }}
                className={borderlessInput}
              />
            </PropertyRow>

            {/* Status */}
            <PropertyRow
              icon={<RowIcon className="text-sky-500 dark:text-sky-400"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3.5" fill="currentColor" stroke="none" /></RowIcon>}
              label="Estado"
            >
              <span className="inline-flex items-center rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-medium text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
                {statusLabel || 'Pendiente'}
              </span>
            </PropertyRow>

            {/* Priority */}
            <PropertyRow
              icon={<RowIcon className={priorityIconClasses[priority]}><path d="M5 21V4" /><path d="M5 4h11l-1.5 3.5L16 11H5" /></RowIcon>}
              label="Prioridad"
            >
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(taskPriorityLabels) as TaskPriority[]).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setPriority(value)}
                    aria-pressed={priority === value}
                    className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                      priority === value
                        ? priorityPillClasses[value].selected
                        : priorityPillClasses[value].idle
                    }`}
                  >
                    {taskPriorityLabels[value]}
                  </button>
                ))}
              </div>
            </PropertyRow>

            {/* Sprint */}
            <PropertyRow
              icon={<RowIcon className="text-purple-500 dark:text-purple-400"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" /></RowIcon>}
              label="Sprint"
            >
              <input
                type="text"
                value={sprint}
                onChange={(e) => setSprint(e.target.value)}
                placeholder="Escribe un sprint…"
                className={`${borderlessInput} ${sprint.trim() ? 'font-medium text-purple-600 dark:text-purple-300' : ''}`}
              />
            </PropertyRow>

            {/* Tags */}
            <PropertyRow
              icon={<RowIcon className="text-teal-500 dark:text-teal-400"><path d="M12.6 3H21v8.4L11.5 21 3 12.5 12.6 3z" /><circle cx="17" cy="7" r="1.6" fill="currentColor" stroke="none" /></RowIcon>}
              label="Etiquetas"
            >
              <div className="flex flex-wrap items-center gap-1.5">
                {availableTags.map((tag) => {
                  const active = tags.includes(tag.name)
                  return (
                    <button
                      key={tag.name}
                      type="button"
                      onClick={() => {
                        if (active) {
                          setTags(tags.filter((t) => t !== tag.name))
                        } else {
                          setTags([...tags, tag.name])
                        }
                      }}
                      aria-pressed={active}
                      className="rounded-full px-2.5 py-1 text-xs font-medium transition-colors"
                      style={
                        active
                          ? { backgroundColor: tag.color, color: '#FFFFFF' }
                          : { backgroundColor: `${tag.color}26`, color: tag.color }
                      }
                    >
                      {tag.name}
                    </button>
                  )
                })}
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newTag.trim()) {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                  placeholder="+ Crear etiqueta…"
                  className={`${borderlessInput} w-36`}
                />
              </div>
            </PropertyRow>
          </div>

          {/* Content - blank page style */}
          <div className="mt-6 flex items-center justify-end">
            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              aria-pressed={showPreview}
            >
              {showPreview ? 'Editar' : 'Vista previa'}
            </button>
          </div>

          {showPreview ? (
            <div id={contentId} className="markdown-content min-h-[280px] pt-1 text-slate-700 dark:text-slate-200">
              {content ? (
                <MarkdownRenderer content={content} />
              ) : (
                <p className="text-slate-400 italic dark:text-slate-500">Ingresa el contenido…</p>
              )}
            </div>
          ) : (
            <textarea
              id={contentId}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Ingresa el contenido…"
              rows={14}
              className="w-full resize-y border-none bg-transparent text-sm leading-relaxed text-slate-700 placeholder:text-slate-400 focus:outline-none dark:text-slate-200 dark:placeholder:text-slate-500"
              spellCheck={false}
            />
          )}

          {error && (
            <p id={errorId} role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
