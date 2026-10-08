export type Column = {
  id: string
  projectId: string
  name: string
  position: number
}

const KANBAN_COLUMN_DEFINITIONS = [
  { key: 'pendiente', name: 'Pendiente' },
  { key: 'en-progreso', name: 'En progreso' },
  { key: 'en-revision', name: 'En revisión' },
  { key: 'completado', name: 'Completado' },
] as const

export function getProjectColumns(projectId: string): Column[] {
  return KANBAN_COLUMN_DEFINITIONS.map((definition, position) => ({
    id: `${projectId}:${definition.key}`,
    projectId,
    name: definition.name,
    position,
  }))
}
