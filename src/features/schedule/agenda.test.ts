import { describe, expect, it } from 'vitest'
import type { Task } from '../../types/task'
import { classifyAgendaTasks } from './agenda'

const projectId = 'p1'

function makeTask(overrides: Partial<Task> = {}): Task {
  const base: Task = {
    id: 't1',
    projectId,
    columnId: `${projectId}:pendiente`,
    title: 'Tarea',
    content: '',
    priority: 'medium',
    dueDate: null,
    plannedStartDate: '2026-06-01',
    position: 0,
    createdAt: '2026-06-01T00:00:00.000Z',
    updatedAt: '2026-06-01T00:00:00.000Z',
  }
  return { ...base, ...overrides }
}

const today = '2026-06-15'

describe('classifyAgendaTasks', () => {
  it('clasifica vencidas, hoy, próximas y sin fecha', () => {
    const groups = classifyAgendaTasks(
      [
        makeTask({ id: 'pasada', dueDate: '2026-06-10' }),
        makeTask({ id: 'hoy', dueDate: today }),
        makeTask({ id: 'futura', dueDate: '2026-06-20' }),
        makeTask({ id: 'sin-fecha', dueDate: null }),
      ],
      today,
    )

    expect(groups.overdue.map((task) => task.id)).toEqual(['pasada'])
    expect(groups.today.map((task) => task.id)).toEqual(['hoy'])
    expect(groups.upcoming.map((task) => task.id)).toEqual(['futura'])
    expect(groups.noDue.map((task) => task.id)).toEqual(['sin-fecha'])
  })

  it('no clasifica como vencida una tarea completada', () => {
    const groups = classifyAgendaTasks(
      [
        makeTask({
          id: 'completada-vencida',
          columnId: `${projectId}:completado`,
          dueDate: '2026-06-10',
        }),
      ],
      today,
    )

    expect(groups.overdue).toHaveLength(0)
    expect(groups.today).toHaveLength(0)
    expect(groups.upcoming).toHaveLength(0)
    expect(groups.noDue).toHaveLength(0)
  })

  it('mantiene las tareas completadas de hoy y futuras en su sección', () => {
    const groups = classifyAgendaTasks(
      [
        makeTask({
          id: 'completada-hoy',
          columnId: `${projectId}:completado`,
          dueDate: today,
        }),
        makeTask({
          id: 'completada-futura',
          columnId: `${projectId}:completado`,
          dueDate: '2026-06-18',
        }),
      ],
      today,
    )

    expect(groups.today.map((task) => task.id)).toEqual(['completada-hoy'])
    expect(groups.upcoming.map((task) => task.id)).toEqual(['completada-futura'])
  })

  it('ordena cronológicamente dentro de cada sección', () => {
    const groups = classifyAgendaTasks(
      [
        makeTask({ id: 'b', dueDate: '2026-06-12' }),
        makeTask({ id: 'a', dueDate: '2026-06-05' }),
        makeTask({ id: 'd', dueDate: '2026-06-25' }),
        makeTask({ id: 'c', dueDate: '2026-06-18' }),
      ],
      today,
    )

    expect(groups.overdue.map((task) => task.id)).toEqual(['a', 'b'])
    expect(groups.upcoming.map((task) => task.id)).toEqual(['c', 'd'])
  })

  it('incluye las tareas sin fecha de entrega aunque estén completadas', () => {
    const groups = classifyAgendaTasks(
      [
        makeTask({
          id: 'completada-sin-fecha',
          columnId: `${projectId}:completado`,
          dueDate: null,
        }),
      ],
      today,
    )

    expect(groups.noDue.map((task) => task.id)).toEqual(['completada-sin-fecha'])
  })
})
