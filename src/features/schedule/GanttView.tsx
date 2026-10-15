import { useMemo, useRef } from 'react'
import type { Project } from '../../types/project'
import { taskPriorityLabels, type Task } from '../../types/task'
import { isCompletedColumn } from '../../types/column'
import { addDaysToKey, diffDaysKeys, getLocalDateKey, parseLocalDateKey } from '../../utils/date'
import { computeGanttBar, computeGanttRange } from './gantt'
import { getStatusVisual, priorityDotClass } from './taskVisuals'

type GanttViewProps = {
  tasks: Task[]
  projectsById?: Map<string, Project>
  onOpenTask: (task: Task) => void
}

const DAY_WIDTH = 36
const ROW_HEIGHT = 44
const LABEL_WIDTH = '13rem'

export function GanttView({ tasks, projectsById, onOpenTask }: GanttViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const todayKey = getLocalDateKey()

  const range = useMemo(
    () => computeGanttRange(tasks, todayKey),
    [tasks, todayKey],
  )

  const sortedTasks = useMemo(
    () =>
      [...tasks].sort((a, b) =>
        a.plannedStartDate !== b.plannedStartDate
          ? a.plannedStartDate.localeCompare(b.plannedStartDate)
          : (a.dueDate ?? '').localeCompare(b.dueDate ?? ''),
      ),
    [tasks],
  )

  const monthSegments = useMemo(() => {
    if (range === null) return []
    type Segment = { label: string; days: number }
    const segments: Segment[] = []
    for (let index = 0; index < range.totalDays; index += 1) {
      const key = addDaysToKey(range.startKey, index)
      const label = parseLocalDateKey(key).toLocaleDateString('es-ES', {
        month: 'long',
        year: 'numeric',
      })
      const last = segments[segments.length - 1]
      if (last !== undefined && last.label === label) {
        last.days += 1
      } else {
        segments.push({ label, days: 1 })
      }
    }
    return segments
  }, [range])

  if (range === null) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
        <h3 className="font-medium text-slate-900 dark:text-slate-100">Sin tareas</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Las tareas aparecerán aquí cuando crees tareas con fechas.
        </p>
      </div>
    )
  }

  const todayOffset = diffDaysKeys(range.startKey, todayKey)
  const timelineWidth = range.totalDays * DAY_WIDTH

  const handlePrev = () => {
    scrollRef.current?.scrollBy({ left: -DAY_WIDTH * 21, behavior: 'smooth' })
  }
  const handleNext = () => {
    scrollRef.current?.scrollBy({ left: DAY_WIDTH * 21, behavior: 'smooth' })
  }
  const handleToday = () => {
    const element = scrollRef.current
    if (element === null) return
    element.scrollTo({ left: Math.max(0, todayOffset * DAY_WIDTH - 96), behavior: 'smooth' })
  }

  const dayKeys = Array.from({ length: range.totalDays }, (_, index) =>
    addDaysToKey(range.startKey, index),
  )

  return (
    <div className="rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3 dark:border-slate-700">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Gantt</h3>
          <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
            {range.startKey} → {range.endKey}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Período anterior"
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
            aria-label="Período siguiente"
            className="rounded-md border border-slate-300 px-2.5 py-1.5 text-sm text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            ›
          </button>
        </div>
      </header>

      <div ref={scrollRef} className="overflow-x-auto">
        <div style={{ width: `calc(${LABEL_WIDTH} + ${timelineWidth}px)`, minWidth: '100%' }}>
          {/* Timeline header */}
          <div className="flex border-b border-slate-200 dark:border-slate-700">
            <div
              className="sticky left-0 z-20 shrink-0 border-r border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
              style={{ width: LABEL_WIDTH }}
            >
              Tareas
            </div>
            <div className="shrink-0">
              <div className="flex h-6">
                {monthSegments.map((segment, index) => (
                  <div
                    key={`${segment.label}-${index}`}
                    className="flex items-center overflow-hidden border-r border-slate-200 px-1.5 font-mono text-[11px] text-slate-500 dark:border-slate-700 dark:text-slate-400"
                    style={{ width: segment.days * DAY_WIDTH }}
                  >
                    {segment.label}
                  </div>
                ))}
              </div>
              <div className="flex h-6">
                {dayKeys.map((key) => {
                  const date = parseLocalDateKey(key)
                  const weekend = date.getDay() === 0 || date.getDay() === 6
                  const isToday = key === todayKey
                  return (
                    <div
                      key={key}
                      className={`flex shrink-0 items-center justify-center border-r font-mono text-[10px] dark:border-slate-700 ${
                        isToday
                          ? 'bg-indigo-50 font-semibold text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300'
                          : weekend
                            ? 'bg-slate-50 text-slate-400 dark:bg-slate-800/60 dark:text-slate-500'
                            : 'text-slate-400 dark:text-slate-500'
                      }`}
                      style={{ width: DAY_WIDTH }}
                    >
                      {date.getDate()}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Rows */}
          {sortedTasks.map((task) => {
            const bar = computeGanttBar(task, range.startKey)
            const status = getStatusVisual(task.columnId)
            const project = projectsById?.get(task.projectId)
            const showRange =
              !bar.isMarker && task.dueDate !== null
                ? `${task.plannedStartDate} → ${task.dueDate}`
                : `${task.plannedStartDate} · sin fecha de entrega`
            return (
              <div key={task.id} className="flex border-b border-slate-100 dark:border-slate-800" style={{ height: ROW_HEIGHT }}>
                <div
                  className="sticky left-0 z-10 flex shrink-0 items-center gap-2 border-r border-slate-200 bg-white px-3 dark:border-slate-700 dark:bg-slate-900"
                  style={{ width: LABEL_WIDTH }}
                >
                  {project !== undefined && (
                    <span
                      aria-hidden="true"
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => onOpenTask(task)}
                    className="min-w-0 flex-1 truncate text-left text-sm text-slate-700 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-300"
                    aria-label={`Abrir tarea ${task.title}. ${showRange}`}
                  >
                    {task.title}
                  </button>
                  <span
                    aria-label={`Prioridad ${taskPriorityLabels[task.priority]}`}
                    title={`Prioridad ${taskPriorityLabels[task.priority]}`}
                    className={`h-2 w-2 shrink-0 rounded-full ${priorityDotClass[task.priority]}`}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onOpenTask(task)}
                  aria-label={`Abrir tarea ${task.title}. ${showRange}`}
                  className="relative shrink-0 text-left"
                  style={{ width: timelineWidth }}
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-0 bottom-0 w-px bg-indigo-500/60"
                    style={{ left: todayOffset * DAY_WIDTH }}
                  />
                  {bar.isMarker ? (
                    <span
                      aria-hidden="true"
                      className={`absolute top-1/2 h-5 w-6 -translate-y-1/2 rounded-sm border-2 border-dashed ${status.barClass} ${task.dueDate === null ? 'opacity-90' : ''}`}
                      style={{ left: bar.offsetDays * DAY_WIDTH + 4 }}
                      title={`${task.plannedStartDate} · sin fecha de entrega`}
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className={`absolute top-1/2 h-5 -translate-y-1/2 overflow-hidden rounded-md border-l-4 ${status.barClass} ${
                        isCompletedColumn(task.columnId) ? 'opacity-70' : ''
                      }`}
                      style={{
                        left: bar.offsetDays * DAY_WIDTH + 2,
                        width: Math.max(DAY_WIDTH - 4, bar.spanDays * DAY_WIDTH - 4),
                      }}
                      title={showRange}
                    >
                      {bar.spanDays >= 3 && (
                        <span className="block truncate px-2 text-[11px] font-medium leading-5 text-white">
                          {task.title}
                        </span>
                      )}
                    </span>
                  )}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <footer className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-slate-200 px-4 py-2 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
        {(['pendiente', 'en-progreso', 'en-revision', 'completado'] as const).map((key) => {
          const visual = getStatusVisual(`x:${key}`)
          return (
            <span key={key} className="inline-flex items-center gap-1.5">
              <span aria-hidden="true" className={`h-2 w-2 rounded-full ${visual.dotClass}`} />
              {visual.label}
            </span>
          )
        })}
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="h-3 w-3 rounded-sm border-2 border-dashed border-slate-400" />
          Sin fecha de entrega
        </span>
      </footer>
    </div>
  )
}
