import type { Task } from '../../types/task'
import { addDaysToKey, startOfMonthKey, startOfWeekKey } from '../../utils/date'

export function buildMonthGrid(monthKey: string): string[] {
  const gridStart = startOfWeekKey(startOfMonthKey(monthKey))
  return Array.from({ length: 42 }, (_, index) => addDaysToKey(gridStart, index))
}

export function buildWeekDays(weekStartKey: string): string[] {
  return Array.from({ length: 7 }, (_, index) => addDaysToKey(weekStartKey, index))
}

export function groupTasksByDueDate(tasks: Task[]): Map<string, Task[]> {
  const byDate = new Map<string, Task[]>()
  for (const task of tasks) {
    if (task.dueDate === null) {
      continue
    }
    const bucket = byDate.get(task.dueDate)
    if (bucket === undefined) {
      byDate.set(task.dueDate, [task])
    } else {
      bucket.push(task)
    }
  }
  for (const bucket of byDate.values()) {
    bucket.sort((a, b) => a.title.localeCompare(b.title))
  }
  return byDate
}
