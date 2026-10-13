import { useEffect, useMemo, useRef, useState } from 'react'
import { useProjectStore } from '../../stores/projectStore'
import { useTaskStore } from '../../stores/taskStore'
import { useUiStore } from '../../stores/uiStore'
import {
  computeTaskAlerts,
  taskAlertReasonLabels,
  type TaskAlert,
  type TaskAlertReason,
} from './alerts'

function reasonClassName(reason: TaskAlertReason): string {
  return reason === 'overdue'
    ? 'text-xs font-medium text-red-600 dark:text-red-400'
    : 'text-xs font-medium text-amber-600 dark:text-amber-400'
}

export function NotificationsMenu() {
  const tasks = useTaskStore((state) => state.tasks)
  const projects = useProjectStore((state) => state.projects)
  const selectProject = useProjectStore((state) => state.selectProject)
  const openTask = useUiStore((state) => state.openTask)
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const alerts = useMemo(
    () => computeTaskAlerts(tasks, projects),
    [tasks, projects],
  )

  useEffect(() => {
    if (!isOpen) {
      return
    }
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target
      if (
        containerRef.current !== null &&
        target instanceof Node &&
        !containerRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [isOpen])

  const handleOpenTask = (alert: TaskAlert) => {
    selectProject(alert.task.projectId)
    openTask(alert.task.id)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={
          alerts.length > 0
            ? `Avisos: ${alerts.length} pendientes`
            : 'Avisos'
        }
        className="flex shrink-0 items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        Avisos
        {alerts.length > 0 && (
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-semibold text-white">
            {alerts.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
          <div className="border-b border-slate-200 px-3 py-2 text-sm font-semibold dark:border-slate-700">
            Avisos pendientes
          </div>

          {alerts.length === 0 ? (
            <p className="px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
              No hay avisos pendientes.
            </p>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {alerts.map((alert) => (
                <li
                  key={alert.task.id}
                  className="border-b border-slate-100 last:border-b-0 dark:border-slate-800"
                >
                  <button
                    type="button"
                    onClick={() => handleOpenTask(alert)}
                    className="flex w-full flex-col gap-1 px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <span className="break-words text-sm font-medium">
                      {alert.task.title}
                    </span>
                    <span className="flex flex-wrap items-center gap-x-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <span
                          aria-hidden="true"
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: alert.project.color }}
                        />
                        {alert.project.name}
                      </span>
                      <span aria-hidden="true">·</span>
                      <time dateTime={alert.dueDate}>{alert.dueDate}</time>
                    </span>
                    <span className={reasonClassName(alert.reason)}>
                      {taskAlertReasonLabels[alert.reason]}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
