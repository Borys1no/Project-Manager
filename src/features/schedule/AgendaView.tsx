import type { Project } from '../../types/project'
import type { Task } from '../../types/task'
import { getLocalDateKey } from '../../utils/date'
import { TaskPriorityBadge } from '../tasks/TaskPriorityBadge'
import {
  agendaSectionLabels,
  classifyAgendaTasks,
  type AgendaSectionId,
} from './agenda'
import { getStatusLabel } from './taskVisuals'

type AgendaViewProps = {
  tasks: Task[]
  projectsById?: Map<string, Project>
  onOpenTask: (task: Task) => void
}

const SECTION_STYLES: Record<AgendaSectionId, { dotClass: string; headingClass: string }> = {
  overdue: {
    dotClass: 'bg-red-500',
    headingClass: 'text-red-600 dark:text-red-400',
  },
  today: {
    dotClass: 'bg-amber-500',
    headingClass: 'text-amber-600 dark:text-amber-400',
  },
  upcoming: {
    dotClass: 'bg-indigo-500',
    headingClass: 'text-indigo-600 dark:text-indigo-400',
  },
  noDue: {
    dotClass: 'bg-slate-400',
    headingClass: 'text-slate-600 dark:text-slate-400',
  },
}

const SECTION_ORDER: AgendaSectionId[] = ['overdue', 'today', 'upcoming', 'noDue']

export function AgendaView({ tasks, projectsById, onOpenTask }: AgendaViewProps) {
  const todayKey = getLocalDateKey()
  const groups = classifyAgendaTasks(tasks, todayKey)

  const totalVisible =
    groups.overdue.length + groups.today.length + groups.upcoming.length + groups.noDue.length

  if (totalVisible === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
        <h3 className="font-medium text-slate-900 dark:text-slate-100">Sin tareas</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Las tareas aparecerán aquí cuando las crees.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {SECTION_ORDER.map((sectionId) => {
        const sectionTasks = groups[sectionId]
        if (sectionTasks.length === 0) return null
        const styles = SECTION_STYLES[sectionId]
        return (
          <section key={sectionId} aria-labelledby={`agenda-${sectionId}`}>
            <h3
              id={`agenda-${sectionId}`}
              className={`flex items-center gap-2 text-sm font-semibold ${styles.headingClass}`}
            >
              <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${styles.dotClass}`} />
              {agendaSectionLabels[sectionId]}
              <span className="font-mono text-xs font-normal text-slate-400 dark:text-slate-500">
                {sectionTasks.length}
              </span>
            </h3>
            <ul className="mt-2 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
              {sectionTasks.map((task) => {
                const status = getStatusLabel(task.projectId, task.columnId)
                const project = projectsById?.get(task.projectId)
                const relevantDate =
                  sectionId === 'noDue'
                    ? `Inicio ${task.plannedStartDate}`
                    : (task.dueDate ?? '')
                return (
                  <li key={task.id} className="border-b border-slate-100 last:border-b-0 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => onOpenTask(task)}
                      className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800"
                      aria-label={`Abrir tarea ${task.title}. Estado ${status}. ${relevantDate}`}
                    >
                      <span className="min-w-0 flex-1 break-words text-sm font-medium text-slate-900 dark:text-slate-100">
                        {task.title}
                      </span>
                      {project !== undefined && (
                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                          <span
                            aria-hidden="true"
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: project.color }}
                          />
                          {project.name}
                        </span>
                      )}
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {status}
                      </span>
                      <TaskPriorityBadge priority={task.priority} />
                      <time
                        dateTime={sectionId === 'noDue' ? undefined : (task.dueDate ?? undefined)}
                        className="font-mono text-xs text-slate-500 dark:text-slate-400"
                      >
                        {relevantDate}
                      </time>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
