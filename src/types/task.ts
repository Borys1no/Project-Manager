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

export const taskInputSchema = z.object({
  title: z.string().trim().min(1, 'El título es obligatorio.'),
  content: z.string().trim(),
  priority: taskPrioritySchema,
  dueDate: dueDateSchema,
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
  position: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Task = z.infer<typeof taskSchema>
