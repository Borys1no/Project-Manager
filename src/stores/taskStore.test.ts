import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useTaskStore } from './taskStore'
import type { TaskInput } from '../types/task'

const validInput: TaskInput = {
  title: 'Tarea',
  content: 'Contenido',
  priority: 'medium',
  dueDate: '2026-06-20',
  plannedStartDate: '2026-06-15',
}

describe('taskStore', () => {
  beforeEach(() => {
    useTaskStore.setState({ tasks: [] })
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('createTask guarda la tarea y su promesa se resuelve (cierre tras persistir)', async () => {
    await useTaskStore.getState().createTask('p1', 'p1:pendiente', validInput)

    const tasks = useTaskStore.getState().tasks
    expect(tasks).toHaveLength(1)
    expect(tasks[0]?.title).toBe('Tarea')
    expect(tasks[0]?.plannedStartDate).toBe('2026-06-15')
    expect(tasks[0]?.dueDate).toBe('2026-06-20')
    expect(tasks[0]?.columnId).toBe('p1:pendiente')
  })

  it('createTask con fechas inválidas lanza el error y no modifica el store', () => {
    expect(() =>
      useTaskStore.getState().createTask('p1', 'p1:pendiente', {
        ...validInput,
        dueDate: '2026-06-01',
      }),
    ).toThrow()

    expect(useTaskStore.getState().tasks).toHaveLength(0)
  })

  it('createTask con título vacío lanza el error y no modifica el store', () => {
    expect(() =>
      useTaskStore.getState().createTask('p1', 'p1:pendiente', {
        ...validInput,
        title: '   ',
      }),
    ).toThrow()

    expect(useTaskStore.getState().tasks).toHaveLength(0)
  })

  it('updateTask conserva la edición de fechas y campos existentes', async () => {
    await useTaskStore.getState().createTask('p1', 'p1:pendiente', validInput)
    const created = useTaskStore.getState().tasks[0]
    expect(created).toBeDefined()
    if (created === undefined) return

    useTaskStore.getState().updateTask(created.id, {
      ...validInput,
      title: 'Tarea editada',
      plannedStartDate: '2026-06-16',
      dueDate: '2026-06-25',
    })

    const updated = useTaskStore.getState().tasks[0]
    expect(updated?.title).toBe('Tarea editada')
    expect(updated?.plannedStartDate).toBe('2026-06-16')
    expect(updated?.dueDate).toBe('2026-06-25')
    expect(updated?.id).toBe(created.id)
    expect(updated?.position).toBe(created.position)
    expect(updated?.createdAt).toBe(created.createdAt)
  })

  it('una segunda creación tras la primera funciona (formulario reutilizable)', async () => {
    await useTaskStore.getState().createTask('p1', 'p1:pendiente', validInput)
    await useTaskStore.getState().createTask('p1', 'p1:pendiente', {
      ...validInput,
      title: 'Segunda tarea',
    })

    const tasks = useTaskStore.getState().tasks
    expect(tasks).toHaveLength(2)
    expect(tasks.map((task) => task.title)).toEqual(['Tarea', 'Segunda tarea'])
  })
})
