import { z } from 'zod'

export const projectStatusSchema = z.enum(['active', 'archived'])

export type ProjectStatus = z.infer<typeof projectStatusSchema>

export const projectInputSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es obligatorio.'),
  description: z.string().trim(),
  color: z.string().min(1, 'El color es obligatorio.'),
})

export type ProjectInput = z.infer<typeof projectInputSchema>

export const projectEditSchema = projectInputSchema.extend({
  status: projectStatusSchema,
})

export type ProjectEditInput = z.infer<typeof projectEditSchema>

export const projectSchema = z.object({
  id: z.string().min(1, 'El identificador es obligatorio.'),
  name: z.string().trim().min(1, 'El nombre es obligatorio.'),
  description: z.string().trim(),
  color: z.string().min(1, 'El color es obligatorio.'),
  status: projectStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Project = z.infer<typeof projectSchema>
