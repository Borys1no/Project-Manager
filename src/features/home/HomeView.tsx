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

export function HomeView() {
  const projects = useProjectStore((state) => state.projects)
  const tasks = useTaskStore((state) => state.tasks)
  const selectProject = useProjectStore((state) => state.selectProject)
  const openTask = useUiStore((state) => state.openTask)

  const activeProjects = useMemo(
    () => projects.filter((p) => p.status === 'active'),
    [projects],
  )

  const stats = useMemo(() => {
    const pending = tasks.filter((t) => {
      const cols = getProjectColumns(t.projectId)
      const col = cols.find((c) => c.id === t.columnId)
      return col?.name === 'Pendiente'
    }).length

    const inProgress = tasks.filter((t) => {
      const cols = getProjectColumns(t.projectId)
      const col = cols.find((c) => c.id === t.columnId)
      return col?.name === 'En progreso' || col?.name === 'En revisión'
    }).length

    const completed = tasks.filter((t) => isCompletedColumn(t.columnId)).length

    return {
      activeProjects: activeProjects.length,
      pending,
      inProgress,
      completed,
      totalTasks: tasks.length,
    }
  }, [tasks, activeProjects])

  const recentTasks = useMemo(() => {
    return [...tasks]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 10)
  }, [tasks])

  const tasksWithProjects = useMemo(() => {
    return recentTasks.map((task) => {
      const project = projects.find((p) => p.id === task.projectId)
      return { task, project }
    })
  }, [recentTasks, projects])

  const handleOpenTask = (task: Task, projectId: string) => {
    selectProject(projectId)
    openTask(task.id)
  }

  if (activeProjects.length === 0) {
    return (
      <section className="py-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Bienvenido a Project Manager</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            No tienes proyectos todavía. Crea tu primer proyecto para comenzar.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Inicio</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">Resumen de tu actividad</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Proyectos activos"
          value={stats.activeProjects}
          icon={ProjectsIcon}
          color="indigo"
        />
        <StatCard
          title="Pendientes"
          value={stats.pending}
          icon={PendingIcon}
          color="amber"
        />
        <StatCard
          title="En progreso"
          value={stats.inProgress}
          icon={InProgressIcon}
          color="blue"
        />
        <StatCard
          title="Completadas"
          value={stats.completed}
          icon={CompletedIcon}
          color="emerald"
        />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Tareas recientes</h2>
        </div>

        {tasksWithProjects.length === 0 ? (
          <div className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
            No hay tareas todavía. Crea una tarea en alguno de tus proyectos.
          </div>
        ) : (
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
        )}
      </div>
    </section>
  )
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  color: 'indigo' | 'amber' | 'blue' | 'emerald'
}) {
  const colorClasses = {
    indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-400">{title}</p>
          <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
        </div>
        <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}

function TaskRow({
  task,
  project,
  onClick,
}: {
  task: Task
  project: Project | undefined
  onClick: () => void
}) {
  const columnName = project ? getColumnName(project.id, task.columnId) : 'Desconocido'
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
            {project && (
              <span className="inline-flex items-center gap-1">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
                {project.name}
              </span>
            )}
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

function ProjectsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  )
}

function PendingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function InProgressIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

function CompletedIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}