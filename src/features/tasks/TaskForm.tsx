import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useTaskStore } from '../../stores/taskStore'
import {
  taskInputSchema,
  taskPriorityLabels,
  taskPrioritySchema,
  type Task,
  type TaskPriority,
} from '../../types/task'

type TaskFormProps = {
  projectId: string
  columnId: string
  task?: Task
  onClose: () => void
}

export function TaskForm({
  projectId,
  columnId,
  task,
  onClose,
}: TaskFormProps) {
  const createTask = useTaskStore((state) => state.createTask)
  const updateTask = useTaskStore((state) => state.updateTask)

  const [title, setTitle] = useState(task?.title ?? '')
  const [content, setContent] = useState(task?.content ?? '')
  const [priority, setPriority] = useState<TaskPriority>(
    task?.priority ?? 'medium',
  )
  const [dueDate, setDueDate] = useState(task?.dueDate ?? '')
  const [error, setError] = useState<string | null>(null)

  const idBase = task?.id ?? `new-${columnId}`
  const errorId = `task-form-error-${idBase}`

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const result = taskInputSchema.safeParse({
      title,
      content,
      priority,
      dueDate: dueDate === '' ? null : dueDate,
    })
    if (!result.success) {
      setError(
        result.error.issues[0]?.message ?? 'Revisa los datos del formulario.',
      )
      return
    }

    if (task) {
      updateTask(task.id, result.data)
    } else {
      createTask(projectId, columnId, result.data)
    }
    onClose()
  }

  const handlePriorityChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const result = taskPrioritySchema.safeParse(event.target.value)
    if (result.success) {
      setPriority(result.data)
    }
  }

  return (
    <section aria-label={task ? 'Editar tarea' : 'Crear tarea'}>
      <h3 className="text-sm font-semibold">
        {task ? 'Editar tarea' : 'Crear tarea'}
      </h3>

      <form noValidate onSubmit={handleSubmit} className="mt-3 space-y-3">
        <div>
          <label
            htmlFor={`task-title-${idBase}`}
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Título
          </label>
          <input
            id={`task-title-${idBase}`}
            type="text"
            value={title}
            autoFocus
            onChange={(event) => {
              setTitle(event.target.value)
              setError(null)
            }}
            aria-invalid={error !== null}
            aria-describedby={error !== null ? errorId : undefined}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <div>
          <label
            htmlFor={`task-content-${idBase}`}
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Contenido (Markdown)
          </label>
          <textarea
            id={`task-content-${idBase}`}
            rows={8}
            value={content}
            placeholder="Escribe aquí el contenido en Markdown…"
            onChange={(event) => setContent(event.target.value)}
            className="mt-1 w-full resize-y rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <div>
          <label
            htmlFor={`task-priority-${idBase}`}
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Prioridad
          </label>
          <select
            id={`task-priority-${idBase}`}
            value={priority}
            onChange={handlePriorityChange}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 sm:w-auto"
          >
            {(Object.keys(taskPriorityLabels) as TaskPriority[]).map(
              (value) => (
                <option key={value} value={value}>
                  {taskPriorityLabels[value]}
                </option>
              ),
            )}
          </select>
        </div>

        <div>
          <label
            htmlFor={`task-due-date-${idBase}`}
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Fecha límite
          </label>
          <input
            id={`task-due-date-${idBase}`}
            type="date"
            value={dueDate}
            onChange={(event) => {
              setDueDate(event.target.value)
              setError(null)
            }}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 sm:w-auto"
          />
        </div>

        {error !== null && (
          <p id={errorId} role="alert" className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {task ? 'Guardar cambios' : 'Crear tarea'}
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
