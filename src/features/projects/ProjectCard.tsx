import type { Project } from '../../types/project'
import { ProjectStatusBadge } from './ProjectStatusBadge'

type ProjectCardProps = {
  project: Project
  onOpen: () => void
  onEdit: () => void
  onDelete: () => void
}

export function ProjectCard({ project, onOpen, onEdit, onDelete }: ProjectCardProps) {
  return (
    <li className="flex flex-col gap-3 rounded-lg border bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span
            aria-hidden="true"
            className="h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: project.color }}
          />
          <h3 className="break-words font-semibold">{project.name}</h3>
        </div>
        <ProjectStatusBadge status={project.status} />
      </div>

      <p className="break-words text-sm text-slate-600 dark:text-slate-400">
        {project.description || 'Sin descripción.'}
      </p>

      <div className="mt-auto flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onOpen}
          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Abrir
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Editar
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-md px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
        >
          Eliminar
        </button>
      </div>
    </li>
  )
}
