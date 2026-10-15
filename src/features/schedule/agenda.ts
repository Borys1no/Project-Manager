import type { Task } from '../../types/task'
import { isCompletedColumn } from '../../types/column'
import { compareDateKeys } from '../../utils/date'

export type AgendaGroups = {
  overdue: Task[]
  today: Task[]
  upcoming: Task[]
  noDue: Task[]
}

export type AgendaSectionId = keyof AgendaGroups

export const agendaSectionLabels: Record<AgendaSectionId, string> = {
  overdue: 'Vencidas',
  today: 'Para hoy',
  upcoming: 'Próximas',
  noDue: 'Sin fecha de entrega',
}

export function classifyAgendaTasks(
  tasks: Task[],
  today: string,
): AgendaGroups {
  const groups: AgendaGroups = {
    overdue: [],
    today: [],
    upcoming: [],
    noDue: [],
  }

  for (const task of tasks) {
    if (task.dueDate === null) {
      groups.noDue.push(task)
      continue
    }
    if (isCompletedColumn(task.columnId)) {
      if (task.dueDate < today) {
        continue
      }
      if (task.dueDate === today) {
        groups.today.push(task)
      } else {
        groups.upcoming.push(task)
      }
      continue
    }
    if (task.dueDate < today) {
      groups.overdue.push(task)
    } else if (task.dueDate === today) {
      groups.today.push(task)
    } else {
      groups.upcoming.push(task)
    }
  }

  groups.overdue.sort((a, b) => compareDateKeys(a.dueDate ?? '', b.dueDate ?? ''))
  groups.today.sort((a, b) => compareDateKeys(a.dueDate ?? '', b.dueDate ?? ''))
  groups.upcoming.sort((a, b) => compareDateKeys(a.dueDate ?? '', b.dueDate ?? ''))
  groups.noDue.sort((a, b) => compareDateKeys(a.createdAt, b.createdAt))

  return groups
}
