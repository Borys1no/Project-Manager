import { useDroppable } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useProjectStore } from '../../stores/projectStore'
import type { Column } from '../../types/column'
import type { Task } from '../../types/task'
import { TaskCard } from './TaskCard'
import { TaskEditor } from '../tasks/TaskEditor'

type KanbanColumnProps = {
  column: Column
  tasks: Task[]
  onDeleteTask: (task: Task) => void
  onOpenTask: (task: Task) => void
  onCreateTask: (columnId: string) => void
  isCreating: boolean
}

export function KanbanColumn({
  column,
  tasks,
  onDeleteTask,
  onOpenTask,
  onCreateTask,
  isCreating,
}: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id: column.id })
  const currentProject = useProjectStore((state) =>
    state.projects.find((p) => p.id === column.projectId),
  )

  return (
    <section className="flex min-w-64 flex-1 flex-col rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
      <header className="flex items-center justify-between gap-2 border-b border-slate-200 px-3 py-2 dark:border-slate-700">
        <h3 className="text-sm font-semibold">{column.name}</h3>
        <span className="text-xs text-slate-500 dark:text-slate-400">{tasks.length}</span>
      </header>

      <div className="px-3 py-2">
        {isCreating ? (
          <TaskEditor
            projectId={column.projectId}
            columnId={column.id}
            onClose={() => onCreateTask('')}
            project={currentProject}
          />
        ) : (
          <button
            type="button"
            onClick={() => onCreateTask(column.id)}
            className="w-full rounded-md border border-dashed border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-white dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            + Crear
          </button>
        )}
      </div>

      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul
          ref={setNodeRef}
          className="flex flex-1 flex-col gap-2 px-3 pb-3"
        >
          {tasks.length === 0 && (
            <li className="rounded-md border border-dashed border-slate-300 p-3 text-center text-sm text-slate-500 dark:border-slate-600 dark:text-slate-400">
              No hay tareas todavía.
            </li>
          )}
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={() => onDeleteTask(task)}
              onOpen={() => onOpenTask(task)}
            />
          ))}
        </ul>
      </SortableContext>
    </section>
  )
}