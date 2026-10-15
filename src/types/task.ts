import { z } from 'zod'

export const taskPrioritySchema = z.enum(['low', 'medium', 'high', 'urgent'])

export type TaskPriority = z.infer<typeof taskPrioritySchema>

export const taskPriorityLabels: Record<TaskPriority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  urgent: 'Urgente',
}

const dueDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha límite no es válida.')
  .nullable()

const plannedStartDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha de inicio planificada no es válida.')

export const taskInputSchema = z
  .object({
    title: z.string().trim().min(1, 'El título es obligatorio.'),
    content: z.string().trim(),
    priority: taskPrioritySchema,
    dueDate: dueDateSchema,
    plannedStartDate: plannedStartDateSchema,
  })
  .superRefine((data, ctx) => {
    if (data.dueDate !== null && data.dueDate < data.plannedStartDate) {
      ctx.addIssue({
        code: 'custom',
        path: ['dueDate'],
        message:
          'La fecha de entrega no puede ser anterior a la fecha de inicio planificada.',
      })
    }
  })

export type TaskInput = z.infer<typeof taskInputSchema>

export const taskSchema = z.object({
  id: z.string().min(1, 'El identificador es obligatorio.'),
  projectId: z.string().min(1, 'El proyecto es obligatorio.'),
  columnId: z.string().min(1, 'La columna es obligatoria.'),
  title: z.string().trim().min(1, 'El título es obligatorio.'),
  content: z.string().trim(),
  priority: taskPrioritySchema,
  dueDate: dueDateSchema,
  plannedStartDate: plannedStartDateSchema,
  position: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Task = z.infer<typeof taskSchema>

export const legacyTaskSchema = taskSchema.omit({ plannedStartDate: true })

export type LegacyTask = z.infer<typeof legacyTaskSchema>
