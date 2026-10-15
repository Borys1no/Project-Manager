import type { Project } from '../../types/project'
import type { Task } from '../../types/task'
import { isCompletedColumn } from '../../types/column'
import { getLocalDateKey } from '../../utils/date'

export type TaskAlertReason = 'dueSoon' | 'overdue'

export type TaskAlert = {
  task: Task
  project: Project
  dueDate: string
  reason: TaskAlertReason
}

export const taskAlertReasonLabels: Record<TaskAlertReason, string> = {
  overdue: 'Vencida',
  dueSoon: 'Próxima a vencer',
}

export function getTaskAlertReason(
  task: Task,
  today: string,
): TaskAlertReason | null {
  if (task.dueDate === null) {
    return null
  }
  if (isCompletedColumn(task.columnId)) {
    return null
  }
  if (task.dueDate < today) {
    return 'overdue'
  }
  if (task.dueDate === today) {
    return 'dueSoon'
  }
  return null
}

export function computeTaskAlerts(
  tasks: Task[],
  projects: Project[],
  now: Date = new Date(),
): TaskAlert[] {
  const today = getLocalDateKey(now)
  const projectsById = new Map(projects.map((project) => [project.id, project]))
  const alerts: TaskAlert[] = []

  for (const task of tasks) {
    const project = projectsById.get(task.projectId)
    if (project === undefined) {
      continue
    }
    const dueDate = task.dueDate
    if (dueDate === null) {
      continue
    }
    const reason = getTaskAlertReason(task, today)
    if (reason === null) {
      continue
    }
    alerts.push({ task, project, dueDate, reason })
  }

  return alerts.sort((a, b) => {
    if (a.reason !== b.reason) {
      return a.reason === 'overdue' ? -1 : 1
    }
    return a.dueDate.localeCompare(b.dueDate)
  })
}
