import { useMemo } from 'react'
import { useProjectStore } from '../../stores/projectStore'
import { useTaskStore } from '../../stores/taskStore'
import { useUiStore } from '../../stores/uiStore'
import { getProjectColumns, isCompletedColumn } from '../../types/column'
import { taskPriorityLabels } from '../../types/task'
import type { Project } from '../../types/project'
import type { Task } from '../../types/task'

function getColumnName(projectId: string, columnId: string): string {
  const columns = getProjectColumns(projectId)
  const column = columns.find((c) => c.id === columnId)
  return column?.name ?? columnId
}

export function TasksView() {
  const projects = useProjectStore((state) => state.projects)
  const tasks = useTaskStore((state) => state.tasks)
  const selectProject = useProjectStore((state) => state.selectProject)
  const openTask = useUiStore((state) => state.openTask)

  const projectsById = useMemo(
    () => new Map(projects.map((p) => [p.id, p])),
    [projects],
  )

  const tasksWithProjects = useMemo(() => {
    const items: Array<{ task: Task; project: Project }> = []
    for (const task of tasks) {
      const project = projectsById.get(task.projectId)
      if (project) {
        items.push({ task, project })
      }
    }
    return items.sort((a, b) => new Date(b.task.updatedAt).getTime() - new Date(a.task.updatedAt).getTime())
  }, [tasks, projectsById])

  const handleOpenTask = (task: Task, projectId: string) => {
    selectProject(projectId)
    openTask(task.id)
  }

  return (
    <section className="py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Tareas</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">Vista general de todas tus tareas</p>
      </div>

      {tasksWithProjects.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
          <svg
            className="mx-auto h-12 w-12 text-slate-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <h2 className="mt-4 text-lg font-medium text-slate-900 dark:text-slate-100">No hay tareas</h2>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Las tareas aparecerán aquí cuando las crees en tus proyectos.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 overflow-hidden">
          <ul className="divide-y divide-slate-200 dark:divide-slate-700">
            {tasksWithProjects.map(({ task, project }) => (
              <TaskRow
                key={task.id}
                task={task}
                project={project}
                onClick={() => handleOpenTask(task, task.projectId)}
              />
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

function TaskRow({
  task,
  project,
  onClick,
}: {
  task: Task
  project: Project
  onClick: () => void
}) {
  const columnName = getColumnName(project.id, task.columnId)
  const isDone = isCompletedColumn(task.columnId)

  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <p className={`break-words font-medium ${isDone ? 'line-through text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>
            {task.title}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1">
              <span
                aria-hidden="true"
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: project.color }}
              />
              {project.name}
            </span>
            <span aria-hidden="true">·</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
              {columnName}
            </span>
            {task.priority !== 'medium' && (
              <>
                <span aria-hidden="true">·</span>
                <span className="capitalize">{taskPriorityLabels[task.priority]}</span>
              </>
            )}
            {task.dueDate && (
              <>
                <span aria-hidden="true">·</span>
                <time dateTime={task.dueDate} className="font-mono">
                  {task.dueDate}
                </time>
              </>
            )}
          </div>
        </div>
        <svg
          className="shrink-0 w-5 h-5 text-slate-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </li>
  )
}