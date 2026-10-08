import { useState } from 'react'
import { useProjectStore } from '../../stores/projectStore'
import type { Project } from '../../types/project'
import { ProjectCard } from './ProjectCard'
import { ProjectForm } from './ProjectForm'

type FormMode = { mode: 'create' } | { mode: 'edit'; project: Project }

export function ProjectsView() {
  const projects = useProjectStore((state) => state.projects)
  const selectProject = useProjectStore((state) => state.selectProject)
  const deleteProject = useProjectStore((state) => state.deleteProject)
  const [formMode, setFormMode] = useState<FormMode | null>(null)

  const handleDelete = (project: Project) => {
    const confirmed = window.confirm(
      `¿Eliminar el proyecto "${project.name}"?\n\nEsta acción no se puede deshacer.`,
    )
    if (confirmed) {
      deleteProject(project.id)
    }
  }

  return (
    <section className="py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Mis proyectos</h2>
        {projects.length > 0 && (
          <button
            type="button"
            onClick={() => setFormMode({ mode: 'create' })}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Crear proyecto
          </button>
        )}
      </div>

      {formMode && (
        <div className="mt-6">
          <ProjectForm
            project={formMode.mode === 'edit' ? formMode.project : undefined}
            onClose={() => setFormMode(null)}
          />
        </div>
      )}

      {projects.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
          <p className="font-medium">No tienes proyectos todavía.</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Crea tu primer proyecto para comenzar.
          </p>
          <button
            type="button"
            onClick={() => setFormMode({ mode: 'create' })}
            className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Crear proyecto
          </button>
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpen={() => selectProject(project.id)}
              onEdit={() => setFormMode({ mode: 'edit', project })}
              onDelete={() => handleDelete(project)}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
