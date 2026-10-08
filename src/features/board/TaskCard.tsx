import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
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
        </div>
      </div>
    </div>
  )
}
