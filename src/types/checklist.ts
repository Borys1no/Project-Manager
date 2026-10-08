import { z } from 'zod'

export const checklistItemSchema = z.object({
  id: z.string().min(1, 'El identificador es obligatorio.'),
  taskId: z.string().min(1, 'La tarea es obligatoria.'),
  text: z.string().trim().min(1, 'El texto es obligatorio.'),
  completed: z.boolean(),
  position: z.number(),
})

export type ChecklistItem = z.infer<typeof checklistItemSchema>

export const checklistItemInputSchema = z.object({
  text: z.string().trim().min(1, 'El texto es obligatorio.'),
})

export type ChecklistItemInput = z.infer<typeof checklistItemInputSchema>
