import { describe, expect, it } from 'vitest'
import { parseTaskRecord } from './taskRecord'
import { getLocalDateKey } from '../../utils/date'

const baseTask = {
  id: 't1',
  projectId: 'p1',
  columnId: 'p1:pendiente',
  title: 'Tarea',
  content: 'Contenido',
  priority: 'high',
  dueDate: '2026-06-20',
  position: 0,
  createdAt: '2026-03-10T12:00:00.000Z',
  updatedAt: '2026-03-11T08:00:00.000Z',
}

describe('parseTaskRecord', () => {
  it('acepta registros actuales sin normalizar', () => {
    const parsed = parseTaskRecord({
      ...baseTask,
      plannedStartDate: '2026-06-15',
    })
    expect(parsed).not.toBeNull()
    expect(parsed?.normalized).toBe(false)
    expect(parsed?.task.plannedStartDate).toBe('2026-06-15')
    expect(parsed?.task.title).toBe('Tarea')
    expect(parsed?.task.dueDate).toBe('2026-06-20')
  })

  it('inicializa los registros antiguos con la fecha de creación local', () => {
    const parsed = parseTaskRecord(baseTask)
    expect(parsed).not.toBeNull()
    expect(parsed?.normalized).toBe(true)
    expect(parsed?.task.plannedStartDate).toBe(
      getLocalDateKey(new Date(baseTask.createdAt)),
    )
    expect(parsed?.task.content).toBe('Contenido')
    expect(parsed?.task.priority).toBe('high')
    expect(parsed?.task.dueDate).toBe('2026-06-20')
    expect(parsed?.task.createdAt).toBe(baseTask.createdAt)
  })

  it('conserva los demás campos al normalizar', () => {
    const parsed = parseTaskRecord(baseTask)
    expect(parsed?.task.id).toBe('t1')
    expect(parsed?.task.projectId).toBe('p1')
    expect(parsed?.task.columnId).toBe('p1:pendiente')
    expect(parsed?.task.position).toBe(0)
    expect(parsed?.task.updatedAt).toBe(baseTask.updatedAt)
  })

  it('descarta los registros que no cumplen el esquema', () => {
    expect(parseTaskRecord({ id: 'x' })).toBeNull()
    expect(parseTaskRecord(null)).toBeNull()
    expect(
      parseTaskRecord({ ...baseTask, priority: 'sin-nivel' }),
    ).toBeNull()
  })
})
