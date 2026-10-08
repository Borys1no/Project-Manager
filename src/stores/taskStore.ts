import { create } from 'zustand'
import { taskInputSchema, type Task, type TaskInput } from '../types/task'

type TaskStore = {
  tasks: Task[]
  createTask: (projectId: string, columnId: string, input: TaskInput) => void
  updateTask: (id: string, input: TaskInput) => void
  deleteTask: (id: string) => void
  moveTask: (taskId: string, columnId: string, index: number) => void
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],

  createTask: (projectId, columnId, input) => {
    const data = taskInputSchema.parse(input)
    const now = new Date().toISOString()

    set((state) => {
      const positions = state.tasks
        .filter((task) => task.columnId === columnId)
        .map((task) => task.position)
      const position =
        positions.length > 0 ? Math.max(...positions) + 1 : 0

      return {
        tasks: [
          ...state.tasks,
          {
            id: crypto.randomUUID(),
            projectId,
            columnId,
            title: data.title,
            content: data.content,
            priority: data.priority,
            dueDate: data.dueDate,
            position,
            createdAt: now,
            updatedAt: now,
          },
        ],
      }
    })
  },

  updateTask: (id, input) => {
    const data = taskInputSchema.parse(input)

    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? { ...task, ...data, updatedAt: new Date().toISOString() }
          : task,
      ),
    }))
  },

  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }))
  },

  moveTask: (taskId, columnId, index) => {
    set((state) => {
      const movedTask = state.tasks.find((task) => task.id === taskId)
      if (!movedTask) {
        return state
      }

      const remaining = state.tasks.filter((task) => task.id !== taskId)
      const targetColumnTasks = remaining
        .filter((task) => task.columnId === columnId)
        .sort((a, b) => a.position - b.position)
      const targetIndex = Math.max(
        0,
        Math.min(index, targetColumnTasks.length),
      )
      targetColumnTasks.splice(targetIndex, 0, {
        ...movedTask,
        columnId,
      })

      const positions = new Map(
        targetColumnTasks.map((task, position) => [task.id, position]),
      )

      if (movedTask.columnId !== columnId) {
        remaining
          .filter((task) => task.columnId === movedTask.columnId)
          .sort((a, b) => a.position - b.position)
          .forEach((task, position) => positions.set(task.id, position))
      }

      const tasks: Task[] = remaining.map((task) => {
        const position = positions.get(task.id)
        if (position === undefined || position === task.position) {
          return task
        }
        return { ...task, position }
      })

      tasks.push({ ...movedTask, columnId, position: targetIndex })

      return { tasks }
    })
  },
}))
