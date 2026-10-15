import { useMemo, useState } from 'react'
import { useProjectStore } from '../../stores/projectStore'
import { useTaskStore } from '../../stores/taskStore'
import { useUiStore } from '../../stores/uiStore'
import type { Task } from '../../types/task'
import { TaskDetailView } from '../tasks/TaskDetailView'
import { AgendaView } from './AgendaView'
import { CalendarView } from './CalendarView'
import { GanttView } from './GanttView'

type ScheduleViewId = 'gantt' | 'calendar' | 'agenda'

type ScheduleViewProps = {
  projectId?: string
}

const SCHEDULE_VIEWS: Array<{ id: ScheduleViewId; label: string }> = [
  { id: 'gantt', label: 'Gantt' },
  { id: 'calendar', label: 'Calendario' },
  { id: 'agenda', label: 'Agenda' },
]

export function ScheduleView({ projectId }: ScheduleViewProps) {
  const [view, setView] = useState<ScheduleViewId>('gantt')

  const tasks = useTaskStore((state) => state.tasks)
  const projects = useProjectStore((state) => state.projects)
  const openTask = useUiStore((state) => state.openTask)
  const closeTask = useUiStore((state) => state.closeTask)
  const selectedTaskId = useUiStore((state) => state.selectedTaskId)

  const projectsById = useMemo(
    () => new Map(projects.map((project) => [project.id, project])),
    [projects],
  )

  const scopedTasks = useMemo(() => {
    if (projectId !== undefined) {
      return tasks.filter((task) => task.projectId === projectId)
    }
    const activeIds = new Set(
      projects.filter((project) => project.status === 'active').map((project) => project.id),
    )
    return tasks.filter((task) => activeIds.has(task.projectId))
  }, [tasks, projects, projectId])

  const selectedTask =
    selectedTaskId === null
      ? undefined
      : scopedTasks.find((task) => task.id === selectedTaskId)

  const handleOpenTask = (task: Task) => {
    openTask(task.id)
  }

  const showProjectContext = projectId === undefined

  return (
    <section className={projectId === undefined ? 'py-8' : ''}>
      {projectId === undefined && (
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Cronograma</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Tareas de tus proyectos activos en Gantt, calendario y agenda.
          </p>
        </div>
      )}

      <div
        className="mb-4 inline-flex rounded-md border border-slate-300 p-0.5 dark:border-slate-600"
        role="group"
        aria-label="Vista del cronograma"
      >
        {SCHEDULE_VIEWS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setView(item.id)}
            aria-pressed={view === item.id}
            className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
              view === item.id
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {view === 'gantt' && (
        <GanttView
          tasks={scopedTasks}
          projectsById={showProjectContext ? projectsById : undefined}
          onOpenTask={handleOpenTask}
        />
      )}
      {view === 'calendar' && <CalendarView tasks={scopedTasks} onOpenTask={handleOpenTask} />}
      {view === 'agenda' && (
        <AgendaView
          tasks={scopedTasks}
          projectsById={showProjectContext ? projectsById : undefined}
          onOpenTask={handleOpenTask}
        />
      )}

      {selectedTask !== undefined && (
        <TaskDetailView task={selectedTask} onClose={closeTask} />
      )}
    </section>
  )
}
