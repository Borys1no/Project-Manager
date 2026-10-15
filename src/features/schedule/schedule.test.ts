import { describe, expect, it } from 'vitest'
import type { Task } from '../../types/task'
import { startOfWeekKey } from '../../utils/date'
import { buildMonthGrid, buildWeekDays, groupTasksByDueDate } from './calendar'
import { computeGanttBar, computeGanttRange } from './gantt'

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

describe('computeGanttRange', () => {
  it('devuelve null sin tareas', () => {
    expect(computeGanttRange([], today)).toBeNull()
  })

  it('cubre las fechas de las tareas y hoy con margen', () => {
    const range = computeGanttRange(
      [
        makeTask({ plannedStartDate: '2026-06-10', dueDate: '2026-06-12' }),
        makeTask({ id: 't2', plannedStartDate: '2026-06-25', dueDate: null }),
      ],
      today,
    )

    expect(range).not.toBeNull()
    if (range === null) return
    expect(range.startKey <= '2026-06-10').toBe(true)
    expect(range.startKey <= today).toBe(true)
    expect(range.endKey >= '2026-06-25').toBe(true)
    expect(range.totalDays).toBeGreaterThan(0)
  })
})

describe('computeGanttBar', () => {
  it('representa el intervalo completo entre inicio y entrega', () => {
    const bar = computeGanttBar(
      makeTask({ plannedStartDate: '2026-06-10', dueDate: '2026-06-13' }),
      '2026-06-01',
    )

    expect(bar.isMarker).toBe(false)
    expect(bar.offsetDays).toBe(9)
    expect(bar.spanDays).toBe(4)
  })

  it('usa un marcador de un día para tareas sin fecha de entrega', () => {
    const bar = computeGanttBar(
      makeTask({ plannedStartDate: '2026-06-10', dueDate: null }),
      '2026-06-01',
    )

    expect(bar.isMarker).toBe(true)
    expect(bar.offsetDays).toBe(9)
    expect(bar.spanDays).toBe(1)
  })
})

describe('buildMonthGrid', () => {
  it('genera 42 días empezando en lunes', () => {
    const grid = buildMonthGrid('2026-06-15')

    expect(grid).toHaveLength(42)
    expect(startOfWeekKey(grid[0])).toBe(grid[0])
    expect(grid[0] <= '2026-06-01').toBe(true)
    expect(grid[41] >= '2026-06-30').toBe(true)
  })
})

describe('buildWeekDays', () => {
  it('genera los 7 días de la semana', () => {
    const weekStart = startOfWeekKey('2026-06-15')
    const days = buildWeekDays(weekStart)

    expect(days).toHaveLength(7)
    expect(days[0]).toBe(weekStart)
    expect(startOfWeekKey(days[6])).toBe(weekStart)
  })
})

describe('groupTasksByDueDate', () => {
  it('agrupa solo las tareas con fecha de entrega', () => {
    const byDate = groupTasksByDueDate([
      makeTask({ id: 'a', title: 'Beta', dueDate: '2026-06-20' }),
      makeTask({ id: 'b', title: 'Alfa', dueDate: '2026-06-20' }),
      makeTask({ id: 'c', dueDate: '2026-06-21' }),
      makeTask({ id: 'd', dueDate: null }),
    ])

    expect(byDate.get('2026-06-20')?.map((task) => task.title)).toEqual([
      'Alfa',
      'Beta',
    ])
    expect(byDate.get('2026-06-21')).toHaveLength(1)
    expect(byDate.has('2026-06-22')).toBe(false)

    const allKeys = [...byDate.values()].flat()
    expect(allKeys.some((task) => task.id === 'd')).toBe(false)
  })
})
