import { useMemo, useState } from 'react'
import { taskPriorityLabels, type Task } from '../../types/task'
import { isCompletedColumn } from '../../types/column'
import {
  addDaysToKey,
  getLocalDateKey,
  parseLocalDateKey,
  startOfWeekKey,
} from '../../utils/date'
import { buildMonthGrid, buildWeekDays, groupTasksByDueDate } from './calendar'
import { getStatusLabel, priorityDotClass } from './taskVisuals'

type CalendarViewProps = {
  tasks: Task[]
  onOpenTask: (task: Task) => void
}

type CalendarMode = 'month' | 'week'

const WEEKDAY_LABELS = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom']

function TaskChip({
  task,
  onOpenTask,
}: {
  task: Task
  onOpenTask: (task: Task) => void
}) {
  const status = getStatusLabel(task.projectId, task.columnId)
  const completed = isCompletedColumn(task.columnId)
  return (
    <button
      type="button"
      onClick={() => onOpenTask(task)}
      title={`${task.title} · ${status} · Prioridad ${taskPriorityLabels[task.priority]}`}
      aria-label={`Abrir tarea ${task.title}. Estado ${status}. Prioridad ${taskPriorityLabels[task.priority]}`}
      className={`flex w-full items-center gap-1.5 rounded border-l-2 bg-slate-100 px-1.5 py-0.5 text-left text-xs dark:bg-slate-800 ${
        completed ? 'opacity-70' : ''
      }`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${priorityDotClass[task.priority]}`}
      />
      <span className={`min-w-0 flex-1 truncate ${completed ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
        {task.title}
      </span>
    </button>
  )
}

function DayTaskList({
  tasks,
  onOpenTask,
  expanded,
  onToggleExpand,
}: {
  tasks: Task[]
  onOpenTask: (task: Task) => void
  expanded: boolean
  onToggleExpand: () => void
}) {
  if (tasks.length === 0) return null

  const visible = expanded ? tasks : tasks.slice(0, 3)
  const hiddenCount = tasks.length - visible.length

  return (
    <div className="mt-1 space-y-1">
      {visible.map((task) => (
        <TaskChip key={task.id} task={task} onOpenTask={onOpenTask} />
      ))}
      {hiddenCount > 0 && (
        <button
          type="button"
          onClick={onToggleExpand}
          className="text-[11px] font-medium text-indigo-600 hover:underline dark:text-indigo-300"
        >
          +{hiddenCount} más
        </button>
      )}
      {expanded && tasks.length > 3 && (
        <button
          type="button"
          onClick={onToggleExpand}
          className="text-[11px] font-medium text-slate-500 hover:underline dark:text-slate-400"
        >
          Mostrar menos
        </button>
      )}
    </div>
  )
}

export function CalendarView({ tasks, onOpenTask }: CalendarViewProps) {
  const [mode, setMode] = useState<CalendarMode>('month')
  const [anchorKey, setAnchorKey] = useState(() => getLocalDateKey())
  const [expandedCell, setExpandedCell] = useState<string | null>(null)

  const todayKey = getLocalDateKey()
  const tasksByDate = useMemo(() => groupTasksByDueDate(tasks), [tasks])

  const periodLabel = useMemo(() => {
    const anchor = parseLocalDateKey(anchorKey)
    if (mode === 'month') {
      return anchor.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
    }
    const weekStart = startOfWeekKey(anchorKey)
    const weekEnd = addDaysToKey(weekStart, 6)
    const start = parseLocalDateKey(weekStart)
    const end = parseLocalDateKey(weekEnd)
    const sameMonth = start.getMonth() === end.getMonth()
    const startLabel = start.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: sameMonth ? undefined : 'short',
    })
    const endLabel = end.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
    return `${startLabel} – ${endLabel}`
  }, [anchorKey, mode])

  const cells = useMemo(
    () =>
      mode === 'month'
        ? buildMonthGrid(anchorKey)
        : buildWeekDays(startOfWeekKey(anchorKey)),
    [mode, anchorKey],
  )

  const anchorMonth = parseLocalDateKey(anchorKey).getMonth()
  const anchorYear = parseLocalDateKey(anchorKey).getFullYear()

  const handlePrev = () => {
    const date = parseLocalDateKey(anchorKey)
    if (mode === 'month') {
      date.setDate(1)
      date.setMonth(date.getMonth() - 1)
    } else {
      date.setDate(date.getDate() - 7)
    }
    setAnchorKey(getLocalDateKey(date))
    setExpandedCell(null)
  }

  const handleNext = () => {
    const date = parseLocalDateKey(anchorKey)
    if (mode === 'month') {
      date.setDate(1)
      date.setMonth(date.getMonth() + 1)
    } else {
      date.setDate(date.getDate() + 7)
    }
    setAnchorKey(getLocalDateKey(date))
    setExpandedCell(null)
  }

  const handleToday = () => {
    setAnchorKey(todayKey)
    setExpandedCell(null)
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3 dark:border-slate-700">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Calendario</h3>
          <p className="font-mono text-xs capitalize text-slate-500 dark:text-slate-400">{periodLabel}</p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex rounded-md border border-slate-300 p-0.5 dark:border-slate-600" role="group" aria-label="Vista de calendario">
            <button
              type="button"
              onClick={() => setMode('month')}
              aria-pressed={mode === 'month'}
              className={`rounded px-2.5 py-1 text-xs font-medium ${
                mode === 'month'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              Mensual
            </button>
            <button
              type="button"
              onClick={() => setMode('week')}
              aria-pressed={mode === 'week'}
              className={`rounded px-2.5 py-1 text-xs font-medium ${
                mode === 'week'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              Semanal
            </button>
          </div>
          <button
            type="button"
            onClick={handlePrev}
            aria-label={mode === 'month' ? 'Mes anterior' : 'Semana anterior'}
            className="rounded-md border border-slate-300 px-2.5 py-1.5 text-sm text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={handleToday}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Hoy
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label={mode === 'month' ? 'Mes siguiente' : 'Semana siguiente'}
            className="rounded-md border border-slate-300 px-2.5 py-1.5 text-sm text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            ›
          </button>
        </div>
      </header>

      <div className="p-3">
        {/* Weekday header */}
        <div className={`grid ${mode === 'month' ? 'grid-cols-7' : 'grid-cols-7'} gap-1`}>
          {WEEKDAY_LABELS.map((label) => (
            <div
              key={label}
              className="px-1 py-1 text-center font-mono text-[11px] uppercase text-slate-400 dark:text-slate-500"
            >
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((dateKey) => {
            const date = parseLocalDateKey(dateKey)
            const inMonth =
              mode === 'week' ||
              (date.getMonth() === anchorMonth && date.getFullYear() === anchorYear)
            const isToday = dateKey === todayKey
            const dayTasks = tasksByDate.get(dateKey) ?? []
            const expanded = expandedCell === dateKey
            return (
              <div
                key={dateKey}
                className={`min-h-24 rounded-md border p-1 sm:min-h-28 ${
                  isToday
                    ? 'border-indigo-400 bg-indigo-50/60 dark:border-indigo-500 dark:bg-indigo-500/10'
                    : 'border-slate-200 dark:border-slate-700'
                } ${inMonth ? '' : 'opacity-50'}`}
              >
                <div className="flex items-center justify-between px-0.5">
                  <span
                    className={`font-mono text-xs ${
                      isToday
                        ? 'font-semibold text-indigo-600 dark:text-indigo-300'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {date.getDate()}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
                      {dayTasks.length}
                    </span>
                  )}
                </div>
                <DayTaskList
                  tasks={dayTasks}
                  onOpenTask={onOpenTask}
                  expanded={expanded}
                  onToggleExpand={() => setExpandedCell(expanded ? null : dateKey)}
                />
              </div>
            )
          })}
        </div>

        <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
          Las tareas aparecen en su fecha de entrega. Las tareas sin fecha de entrega están en la vista de agenda.
        </p>
      </div>
    </div>
  )
}
