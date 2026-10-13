import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useChecklistStore } from '../../stores/checklistStore'
import type { Task } from '../../types/task'
import { TaskPriorityBadge } from '../tasks/TaskPriorityBadge'

type TaskCardProps = {
  task: Task
  onDelete: () => void
  onOpen: () => void
}

type TaskCardOverlayProps = {
  task: Task
}

const cardClassName =
  'flex items-start gap-1 rounded-md border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800'

export function TaskCard({ task, onDelete, onOpen }: TaskCardProps) {
  const checklistItems = useChecklistStore((state) => state.items)
  const taskChecklistItems = checklistItems.filter((item) => item.taskId === task.id)
  const completedCount = taskChecklistItems.filter((item) => item.completed).length
  const totalCount = taskChecklistItems.length

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={`${cardClassName} ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <button
          type="button"
          {...attributes}
          {...listeners}
          onClick={onOpen}
          aria-label={`Ver detalle de la tarjeta "${task.title}"`}
          className="cursor-grab break-words text-left text-sm font-medium active:cursor-grabbing"
        >
          {task.title}
        </button>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <TaskPriorityBadge priority={task.priority} />
          {task.dueDate !== null && (
            <time
              dateTime={task.dueDate}
              className="text-xs text-slate-500 dark:text-slate-400"
            >
              {task.dueDate}
            </time>
          )}
          {totalCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
              {completedCount}/{totalCount}
            </span>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={onDelete}
        aria-label={`Eliminar tarjeta "${task.title}"`}
        title="Eliminar tarjeta"
        className="shrink-0 rounded px-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:text-slate-500 dark:hover:bg-red-950 dark:hover:text-red-400"
      >
        ×
      </button>
    </li>
  )
}

export function TaskCardOverlay({ task }: TaskCardOverlayProps) {
  const checklistItems = useChecklistStore((state) => state.items)
  const taskChecklistItems = checklistItems.filter((item) => item.taskId === task.id)
  const completedCount = taskChecklistItems.filter((item) => item.completed).length
  const totalCount = taskChecklistItems.length

  return (
    <div className={`${cardClassName} cursor-grab shadow-lg`}>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="break-words text-sm font-medium">{task.title}</span>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <TaskPriorityBadge priority={task.priority} />
          {task.dueDate !== null && (
            <time
              dateTime={task.dueDate}
              className="text-xs text-slate-500 dark:text-slate-400"
            >
              {task.dueDate}
            </time>
          )}
          {totalCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
              {completedCount}/{totalCount}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
