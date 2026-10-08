import type { Project } from '../../types/project'
import { KanbanBoard } from '../board/KanbanBoard'
import { ProjectStatusBadge } from './ProjectStatusBadge'

type ProjectDetailViewProps = {
  project: Project
  onBack: () => void
}

export function ProjectDetailView({ project, onBack }: ProjectDetailViewProps) {
  return (
    <section className="py-8">
      <button
        type="button"
        onClick={onBack}
        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        Volver a proyectos
      </button>

      <div className="mt-6 rounded-lg border bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-wrap items-center gap-3">
          <span
            aria-hidden="true"
            className="h-4 w-4 shrink-0 rounded-full"
            style={{ backgroundColor: project.color }}
          />
          <h2 className="break-words text-2xl font-semibold">{project.name}</h2>
          <ProjectStatusBadge status={project.status} />
        </div>

        <p className="mt-3 break-words text-slate-600 dark:text-slate-400">
          {project.description || 'Sin descripción.'}
        </p>
      </div>

      <KanbanBoard project={project} />
    </section>
  )
}
