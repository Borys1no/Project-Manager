import { describe, expect, it } from 'vitest'
import { taskInputSchema } from './task'

describe('taskInputSchema', () => {
  const base = {
    title: 'Tarea',
    content: '',
    priority: 'medium' as const,
    plannedStartDate: '2026-06-10',
  }

  it('acepta la fecha de entrega igual al inicio planificado', () => {
    const result = taskInputSchema.safeParse({ ...base, dueDate: '2026-06-10' })
    expect(result.success).toBe(true)
  })

  it('acepta tareas sin fecha de entrega', () => {
    const result = taskInputSchema.safeParse({ ...base, dueDate: null })
    expect(result.success).toBe(true)
  })

  it('acepta fecha de entrega posterior al inicio planificado', () => {
    const result = taskInputSchema.safeParse({ ...base, dueDate: '2026-06-20' })
    expect(result.success).toBe(true)
  })

  it('rechaza la fecha de entrega anterior al inicio planificado', () => {
    const result = taskInputSchema.safeParse({ ...base, dueDate: '2026-06-09' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        'La fecha de entrega no puede ser anterior a la fecha de inicio planificada.',
      )
    }
  })

  it('rechaza una fecha de inicio planificada con formato inválido', () => {
    const result = taskInputSchema.safeParse({
      ...base,
      plannedStartDate: '10/06/2026',
      dueDate: null,
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        'La fecha de inicio planificada no es válida.',
      )
    }
  })
})
