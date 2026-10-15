import type { TaskPriority } from '../../types/task'
import { getProjectColumns, isCompletedColumn } from '../../types/column'

export type StatusVisual = {
  key: string
  label: string
  dotClass: string
  barClass: string
}

const STATUS_VISUALS: Record<string, StatusVisual> = {
  pendiente: {
    key: 'pendiente',
    label: 'Pendiente',
    dotClass: 'bg-slate-400',
    barClass: 'bg-slate-400',
  },
  'en-progreso': {
    key: 'en-progreso',
    label: 'En progreso',
    dotClass: 'bg-sky-400',
    barClass: 'bg-sky-400',
  },
  'en-revision': {
    key: 'en-revision',
    label: 'En revisión',
    dotClass: 'bg-amber-400',
    barClass: 'bg-amber-400',
  },
  completado: {
    key: 'completado',
    label: 'Completado',
    dotClass: 'bg-emerald-500',
    barClass: 'bg-emerald-500/70',
  },
}

export function getStatusVisual(columnId: string): StatusVisual {
  const key = isCompletedColumn(columnId)
    ? 'completado'
    : (columnId.split(':').pop() ?? 'pendiente')
  return STATUS_VISUALS[key] ?? STATUS_VISUALS.pendiente
}

export function getStatusLabel(projectId: string, columnId: string): string {
  const column = getProjectColumns(projectId).find((c) => c.id === columnId)
  return column?.name ?? getStatusVisual(columnId).label
}

export const priorityDotClass: Record<TaskPriority, string> = {
  low: 'bg-slate-400',
  medium: 'bg-blue-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500',
}

export const priorityBorderClass: Record<TaskPriority, string> = {
  low: 'border-l-slate-400',
  medium: 'border-l-blue-500',
  high: 'border-l-orange-500',
  urgent: 'border-l-red-500',
}
