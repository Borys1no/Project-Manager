import { describe, expect, it } from 'vitest'
import type { Project } from '../../types/project'
import type { Task } from '../../types/task'
import { computeTaskAlerts, getTaskAlertReason } from './alerts'

const project: Project = {
  id: 'p1',
  name: 'Proyecto',
  description: '',
  color: '#2563eb',
  status: 'active',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 't1',
    projectId: project.id,
    columnId: `${project.id}:pendiente`,
    title: 'Tarea',
    content: '',
    priority: 'medium',
    dueDate: null,
    position: 0,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

const today = '2026-06-15'
const now = new Date(2026, 5, 15, 10, 0, 0)

describe('getTaskAlertReason', () => {
  it('marca como próxima a vencer si vence hoy', () => {
    expect(getTaskAlertReason(makeTask({ dueDate: today }), today)).toBe(
      'dueSoon',
    )
  })

  it('marca como vencida si la fecha ya pasó', () => {
    expect(getTaskAlertReason(makeTask({ dueDate: '2026-06-14' }), today)).toBe(
      'overdue',
    )
  })

  it('no genera aviso sin fecha', () => {
    expect(getTaskAlertReason(makeTask({ dueDate: null }), today)).toBeNull()
  })

  it('no genera aviso en la columna Completado', () => {
    const task = makeTask({
      columnId: `${project.id}:completado`,
      dueDate: '2026-06-14',
    })
    expect(getTaskAlertReason(task, today)).toBeNull()
  })

  it('no genera aviso si vence después de hoy', () => {
    expect(
      getTaskAlertReason(makeTask({ dueDate: '2026-06-16' }), today),
    ).toBeNull()
  })
})

describe('computeTaskAlerts', () => {
  it('refleja el paso de próxima a vencer a vencida', () => {
    const dueSoon = computeTaskAlerts(
      [makeTask({ dueDate: today })],
      [project],
      now,
    )
    expect(dueSoon).toHaveLength(1)
    expect(dueSoon[0]?.reason).toBe('dueSoon')

    const overdue = computeTaskAlerts(
      [makeTask({ dueDate: '2026-06-14' })],
      [project],
      now,
    )
    expect(overdue).toHaveLength(1)
    expect(overdue[0]?.reason).toBe('overdue')
  })

  it('refleja el cambio de fecha de la tarea', () => {
    const initial = computeTaskAlerts(
      [makeTask({ dueDate: '2026-06-16' })],
      [project],
      now,
    )
    expect(initial).toHaveLength(0)

    const updated = computeTaskAlerts(
      [makeTask({ dueDate: today })],
      [project],
      now,
    )
    expect(updated).toHaveLength(1)
  })

  it('ignora tareas cuyo proyecto ya no existe', () => {
    const alerts = computeTaskAlerts(
      [makeTask({ projectId: 'otro', dueDate: '2026-06-14' })],
      [project],
      now,
    )
    expect(alerts).toHaveLength(0)
  })

  it('ordena las vencidas antes que las próximas a vencer', () => {
    const alerts = computeTaskAlerts(
      [
        makeTask({ id: 'a', dueDate: today }),
        makeTask({ id: 'b', dueDate: '2026-06-10' }),
      ],
      [project],
      now,
    )
    expect(alerts.map((alert) => alert.task.id)).toEqual(['b', 'a'])
  })
})
