import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useTaskStore } from '../../stores/taskStore'
import { getProjectColumns } from '../../types/column'
import type { Project } from '../../types/project'
import type { Task } from '../../types/task'
import { KanbanColumn } from './KanbanColumn'
import { TaskCardOverlay } from './TaskCard'
import { TaskDetailView } from '../tasks/TaskDetailView'

type KanbanBoardProps = {
  project: Project
}

const collisionDetection: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args)
  return pointerCollisions.length > 0 ? pointerCollisions : rectIntersection(args)
}

export function KanbanBoard({ project }: KanbanBoardProps) {
  const tasks = useTaskStore((state) => state.tasks)
  const moveTask = useTaskStore((state) => state.moveTask)
  const deleteTask = useTaskStore((state) => state.deleteTask)
  const [draggingTask, setDraggingTask] = useState<Task | null>(null)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const columns = getProjectColumns(project.id)
  const projectTasks = tasks.filter((task) => task.projectId === project.id)

  const handleDragStart = ({ active }: DragStartEvent) => {
    const task = projectTasks.find((item) => item.id === String(active.id))
    setDraggingTask(task ?? null)
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setDraggingTask(null)
    if (!over) {
      return
    }

    const taskId = String(active.id)
    const overId = String(over.id)
    const task = projectTasks.find((item) => item.id === taskId)
    if (!task) {
      return
    }

    const columnIds = columns.map((column) => column.id)
    let targetColumnId: string
    let overTaskId: string | null = null

    if (columnIds.includes(overId)) {
      targetColumnId = overId
    } else {
      const overTask = projectTasks.find((item) => item.id === overId)
      if (!overTask) {
        return
      }
      targetColumnId = overTask.columnId
      overTaskId = overId
    }

    const targetTasks = projectTasks
      .filter((item) => item.columnId === targetColumnId && item.id !== taskId)
      .sort((a, b) => a.position - b.position)

    const targetIndex =
      overTaskId === null
        ? targetTasks.length
        : targetTasks.findIndex((item) => item.id === overTaskId)

    if (targetIndex === -1) {
      return
    }

    moveTask(taskId, targetColumnId, targetIndex)
  }

  const handleDragCancel = () => {
    setDraggingTask(null)
  }

  const handleDeleteTask = (task: Task) => {
    const confirmed = window.confirm(
      `¿Eliminar la tarjeta "${task.title}"?\n\nEsta acción no se puede deshacer.`,
    )
    if (confirmed) {
      deleteTask(task.id)
      if (selectedTaskId === task.id) {
        setSelectedTaskId(null)
      }
    }
  }

  const handleOpenTask = (task: Task) => {
    setSelectedTaskId(task.id)
  }

  const selectedTask =
    selectedTaskId === null
      ? undefined
      : projectTasks.find((task) => task.id === selectedTaskId)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <section
        aria-label="Tablero Kanban"
        className="mt-6 flex gap-4 overflow-x-auto pb-4"
      >
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={projectTasks
              .filter((task) => task.columnId === column.id)
              .sort((a, b) => a.position - b.position)}
            onDeleteTask={handleDeleteTask}
            onOpenTask={handleOpenTask}
          />
        ))}
      </section>

      <DragOverlay>
        {draggingTask ? <TaskCardOverlay task={draggingTask} /> : null}
      </DragOverlay>

      {selectedTask !== undefined && (
        <TaskDetailView
          task={selectedTask}
          onClose={() => setSelectedTaskId(null)}
        />
      )}
    </DndContext>
  )
}
