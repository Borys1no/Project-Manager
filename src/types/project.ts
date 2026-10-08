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

export type Project = {
  id: string
  name: string
  description: string
  color: string
  status: ProjectStatus
  createdAt: string
  updatedAt: string
}
