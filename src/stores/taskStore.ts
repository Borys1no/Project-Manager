import { create } from 'zustand'
import {
  taskInputSchema,
  type Task,
  type TaskInput,
} from '../types/task'
import { taskStorage } from '../services/storage/storageService'

type TaskStore = {
  tasks: Task[]
  loadTasks: () => Promise<void>
  createTask: (projectId: string, columnId: string, input: TaskInput) => void
  updateTask: (id: string, input: TaskInput) => void
  deleteTask: (id: string) => void
  moveTask: (taskId: string, columnId: string, index: number) => void
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],

  loadTasks: async () => {
    const tasks = await taskStorage.getAll()
    set({ tasks })
  },

  createTask: (projectId, columnId, input) => {
    const data = taskInputSchema.parse(input)
    const now = new Date().toISOString()
    const positions = get()
      .tasks.filter((task) => task.columnId === columnId)
      .map((task) => task.position)
    const position = positions.length > 0 ? Math.max(...positions) + 1 : 0
    const task: Task = {
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
    }

    set((state) => ({
      tasks: [...state.tasks, task],
    }))
    void taskStorage.save(task)
  },

  updateTask: (id, input) => {
    const data = taskInputSchema.parse(input)
    const existing = get().tasks.find((task) => task.id === id)
    if (!existing) {
      return
    }
    const updated: Task = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    }

    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? updated : task)),
    }))
    void taskStorage.save(updated)
  },

  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }))
    void taskStorage.remove(id)
  },

  moveTask: (taskId, columnId, index) => {
    let changedTasks: Task[] = []

    set((state) => {
      const movedTask = state.tasks.find((task) => task.id === taskId)
      if (!movedTask) {
        return state
      }

      const previousById = new Map(state.tasks.map((task) => [task.id, task]))
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

      changedTasks = tasks.filter((task) => {
        const previous = previousById.get(task.id)
        return (
          previous !== undefined &&
          (previous.position !== task.position ||
            previous.columnId !== task.columnId)
        )
      })

      return { tasks }
    })

    for (const task of changedTasks) {
      void taskStorage.save(task)
    }
  },
}))
