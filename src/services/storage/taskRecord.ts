import { legacyTaskSchema, taskSchema, type Task } from '../../types/task'
import { getLocalDateKey } from '../../utils/date'

export type ParsedTaskRecord = {
  task: Task
  normalized: boolean
}

export function parseTaskRecord(record: unknown): ParsedTaskRecord | null {
  const direct = taskSchema.safeParse(record)
  if (direct.success) {
    return { task: direct.data, normalized: false }
  }

  const legacy = legacyTaskSchema.safeParse(record)
  if (!legacy.success) {
    return null
  }

  const createdAt = new Date(legacy.data.createdAt)
  const plannedStartDate = Number.isNaN(createdAt.getTime())
    ? getLocalDateKey()
    : getLocalDateKey(createdAt)

  return {
    task: { ...legacy.data, plannedStartDate },
    normalized: true,
  }
}
