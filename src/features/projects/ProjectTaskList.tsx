import { useMemo } from 'react'
import { useTaskStore } from '../../stores/taskStore'
import { useChecklistStore } from '../../stores/checklistStore'
import { getProjectColumns, isCompletedColumn } from '../../types/column'
import { taskPriorityLabels } from '../../types/task'
import type { Project } from '../../types/project'

function getColumnName(projectId: string, columnId: string): string {
  const columns = getProjectColumns(projectId)
  const column = columns.find((c) => c.id === columnId)
  return column?.name ?? columnId
}

type ProjectTaskListProps = {
  project: Project
  onOpenTask: (taskId: string) => void
}

export function ProjectTaskList({ project, onOpenTask }: ProjectTaskListProps) {
  const tasks = useTaskStore((state) => state.tasks)
  const checklistItems = useChecklistStore((state) => state.items)

  const projectTasks = useMemo(() => {
    return tasks
      .filter((task) => task.projectId === project.id)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }, [tasks, project.id])

  const handleOpenTask = (taskId: string) => {
    onOpenTask(taskId)
  }

  if (projectTasks.length === 0) {
    return (
      <div className="py-12 text-center">
        <svg
          className="mx-auto h-12 w-12 text-slate-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-slate-100">No hay tareas en este proyecto</h3>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Crea tu primera tarea desde el tablero Kanban o usando el botón «+ Nueva tarea».
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full" role="table">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Título</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Estado</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Prioridad</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Fecha límite</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Checklist</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {projectTasks.map((task) => {
            const columnName = getColumnName(project.id, task.columnId)
            const isDone = isCompletedColumn(task.columnId)
            const taskChecklistItems = checklistItems.filter((item) => item.taskId === task.id)
            const completedCount = taskChecklistItems.filter((item) => item.completed).length
            const totalCount = taskChecklistItems.length

            return (
              <tr
                key={task.id}
                className={`hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${isDone ? 'bg-slate-50 dark:bg-slate-800/50' : ''}`}
              >
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => handleOpenTask(task.id)}
                    className={`flex items-center gap-2 w-full text-left break-words font-medium ${isDone ? 'line-through text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}
                  >
                    {task.title}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    isDone
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                      : columnName === 'En progreso' || columnName === 'En revisión'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                  }`}>
                    {columnName}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {task.priority !== 'medium' && (
                    <span className="capitalize text-sm text-slate-700 dark:text-slate-300">
                      {taskPriorityLabels[task.priority]}
                    </span>
                  )}
                  {task.priority === 'medium' && (
                    <span className="text-sm text-slate-400 dark:text-slate-500">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {task.dueDate ? (
                    <time dateTime={task.dueDate} className="font-mono text-sm text-slate-700 dark:text-slate-300">
                      {task.dueDate}
                    </time>
                  ) : (
                    <span className="text-sm text-slate-400 dark:text-slate-500">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {totalCount > 0 ? (
                    <span className="inline-flex items-center gap-1 text-sm text-slate-700 dark:text-slate-300">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M9 11l3 3L22 4" />
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                      </svg>
                      {completedCount}/{totalCount}
                    </span>
                  ) : (
                    <span className="text-sm text-slate-400 dark:text-slate-500">—</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}