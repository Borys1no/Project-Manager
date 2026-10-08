import { useState, useId } from 'react'
import { MarkdownRenderer } from '../../components/ui/MarkdownRenderer'
import type { Task } from '../../types/task'
import { TaskChecklist } from '../checklist/TaskChecklist'
import { TaskForm } from './TaskForm'
import { TaskPriorityBadge } from './TaskPriorityBadge'

type TaskDetailViewProps = {
  task: Task
  onClose: () => void
}

export function TaskDetailView({ task, onClose }: TaskDetailViewProps) {
  const [isEditing, setIsEditing] = useState(false)
  const titleId = useId()

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 dark:bg-black/60 sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
        className="my-8 w-full max-w-2xl rounded-lg border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-900"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 id={titleId} className="break-words text-xl font-semibold">
            {task.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cerrar
          </button>
        </div>

        {isEditing ? (
          <div className="mt-4">
            <TaskForm
              projectId={task.projectId}
              columnId={task.columnId}
              task={task}
              onClose={() => setIsEditing(false)}
            />
          </div>
        ) : (
          <>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <TaskPriorityBadge priority={task.priority} />
              {task.dueDate !== null && (
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Fecha límite:{' '}
                  <time
                    dateTime={task.dueDate}
                    className="font-medium text-slate-800 dark:text-slate-100"
                  >
                    {task.dueDate}
                  </time>
                </span>
              )}
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Contenido
              </h3>
              {task.content ? (
                <div className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                  <MarkdownRenderer content={task.content} />
                </div>
              ) : (
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Sin contenido
                </p>
              )}
            </div>
          </>
        )}

        <TaskChecklist taskId={task.id} />

        {!isEditing && (
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Editar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
