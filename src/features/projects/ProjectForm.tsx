import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useProjectStore } from '../../stores/projectStore'
import {
  projectEditSchema,
  projectInputSchema,
  projectStatusSchema,
  type Project,
  type ProjectStatus,
} from '../../types/project'

type ProjectFormProps = {
  project?: Project
  onClose: () => void
}

export function ProjectForm({ project, onClose }: ProjectFormProps) {
  const createProject = useProjectStore((state) => state.createProject)
  const updateProject = useProjectStore((state) => state.updateProject)

  const [name, setName] = useState(project?.name ?? '')
  const [description, setDescription] = useState(project?.description ?? '')
  const [color, setColor] = useState(project?.color ?? '#2563eb')
  const [status, setStatus] = useState<ProjectStatus>(project?.status ?? 'active')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (project) {
      const result = projectEditSchema.safeParse({ name, description, color, status })
      if (!result.success) {
        setError(result.error.issues[0]?.message ?? 'Revisa los datos del formulario.')
        return
      }
      updateProject(project.id, result.data)
    } else {
      const result = projectInputSchema.safeParse({ name, description, color })
      if (!result.success) {
        setError(result.error.issues[0]?.message ?? 'Revisa los datos del formulario.')
        return
      }
      createProject(result.data)
    }

    onClose()
  }

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const result = projectStatusSchema.safeParse(event.target.value)
    if (result.success) {
      setStatus(result.data)
    }
  }

  return (
    <section className="rounded-lg border bg-white p-4 shadow-sm sm:p-6 dark:border-slate-700 dark:bg-slate-900">
      <h3 className="text-lg font-semibold">
        {project ? 'Editar proyecto' : 'Crear proyecto'}
      </h3>

      <form noValidate onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label
            htmlFor="project-name"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Nombre
          </label>
          <input
            id="project-name"
            type="text"
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              setError(null)
            }}
            aria-invalid={error !== null}
            aria-describedby={error !== null ? 'project-form-error' : undefined}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <div>
          <label
            htmlFor="project-description"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Descripción
          </label>
          <textarea
            id="project-description"
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="mt-1 w-full resize-y rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <div>
          <label
            htmlFor="project-color"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Color
          </label>
          <input
            id="project-color"
            type="color"
            value={color}
            onChange={(event) => setColor(event.target.value)}
            className="mt-1 h-10 w-14 cursor-pointer rounded-md border border-slate-300 dark:border-slate-600"
          />
        </div>

        {project && (
          <div>
            <label
              htmlFor="project-status"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Estado
            </label>
            <select
              id="project-status"
              value={status}
              onChange={handleStatusChange}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 sm:w-auto"
            >
              <option value="active">Activo</option>
              <option value="archived">Archivado</option>
            </select>
          </div>
        )}

        {error !== null && (
          <p id="project-form-error" role="alert" className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {project ? 'Guardar cambios' : 'Crear proyecto'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancelar
          </button>
        </div>
      </form>
    </section>
  )
}
