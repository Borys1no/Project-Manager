import type { ProjectStatus } from '../../types/project'

type ProjectStatusBadgeProps = {
  status: ProjectStatus
}

export function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
  const isActive = status === 'active'

  return (
    <span
      className={
        isActive
          ? 'inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-950 dark:text-green-300'
          : 'inline-flex items-center gap-1.5 rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-200'
      }
    >
      <span
        aria-hidden="true"
        className={
          isActive
            ? 'h-1.5 w-1.5 rounded-full bg-green-600 dark:bg-green-500'
            : 'h-1.5 w-1.5 rounded-full bg-slate-500 dark:bg-slate-400'
        }
      />
      {isActive ? 'Activo' : 'Archivado'}
    </span>
  )
}
