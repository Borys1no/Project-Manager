import type { Task } from '../../types/task'
import { addDaysToKey, diffDaysKeys, isValidDateKey } from '../../utils/date'

export type GanttRange = {
  startKey: string
  endKey: string
  totalDays: number
}

export type GanttBar = {
  offsetDays: number
  spanDays: number
  isMarker: boolean
}

export function computeGanttRange(tasks: Task[], todayKey: string): GanttRange | null {
  if (tasks.length === 0) {
    return null
  }

  let minKey = todayKey
  let maxKey = todayKey

  for (const task of tasks) {
    const startKey = isValidDateKey(task.plannedStartDate)
      ? task.plannedStartDate
      : todayKey
    const endKey =
      task.dueDate !== null && isValidDateKey(task.dueDate) ? task.dueDate : startKey

    if (startKey < minKey) minKey = startKey
    if (endKey < minKey) minKey = endKey
    if (startKey > maxKey) maxKey = startKey
    if (endKey > maxKey) maxKey = endKey
  }

  const startKey = addDaysToKey(minKey, -2)
  const endKey = addDaysToKey(maxKey, 2)
  return {
    startKey,
    endKey,
    totalDays: diffDaysKeys(startKey, endKey) + 1,
  }
}

export function computeGanttBar(
  task: Task,
  rangeStartKey: string,
): GanttBar {
  const startKey = isValidDateKey(task.plannedStartDate)
    ? task.plannedStartDate
    : rangeStartKey
  const offsetDays = diffDaysKeys(rangeStartKey, startKey)

  if (task.dueDate === null || !isValidDateKey(task.dueDate)) {
    return { offsetDays, spanDays: 1, isMarker: true }
  }

  const inclusiveSpan = diffDaysKeys(startKey, task.dueDate) + 1
  return {
    offsetDays,
    spanDays: Math.max(1, inclusiveSpan),
    isMarker: false,
  }
}
