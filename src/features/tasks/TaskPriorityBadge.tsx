import type { TaskPriority } from '../../types/task'
import { taskPriorityLabels } from '../../types/task'

type TaskPriorityBadgeProps = {
  priority: TaskPriority
}

const priorityClasses: Record<TaskPriority, string> = {
  low: 'text-slate-500 dark:text-slate-400',
  medium: 'text-blue-600 dark:text-blue-400',
  high: 'text-orange-500 dark:text-orange-400',
  urgent: 'text-red-600 dark:text-red-400',
}

export function TaskPriorityBadge({ priority }: TaskPriorityBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium ${priorityClasses[priority]}`}
    >
      <span
        aria-hidden="true"
        className="h-2 w-2 shrink-0 rounded-full bg-current"
      />
      {taskPriorityLabels[priority]}
    </span>
  )
}
