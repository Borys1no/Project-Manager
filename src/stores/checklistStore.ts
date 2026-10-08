import { create } from 'zustand'
import {
  checklistItemInputSchema,
  checklistItemSchema,
  type ChecklistItem,
  type ChecklistItemInput,
} from '../types/checklist'

type ChecklistStore = {
  items: ChecklistItem[]
  addItem: (taskId: string, input: ChecklistItemInput) => void
  updateItem: (id: string, input: ChecklistItemInput) => void
  toggleItem: (id: string) => void
  deleteItem: (id: string) => void
}

export const useChecklistStore = create<ChecklistStore>((set) => ({
  items: [],

  addItem: (taskId, input) => {
    const data = checklistItemInputSchema.parse(input)

    set((state) => {
      const positions = state.items
        .filter((item) => item.taskId === taskId)
        .map((item) => item.position)
      const position = positions.length > 0 ? Math.max(...positions) + 1 : 0

      const item = checklistItemSchema.parse({
        id: crypto.randomUUID(),
        taskId,
        text: data.text,
        completed: false,
        position,
      })

      return { items: [...state.items, item] }
    })
  },

  updateItem: (id, input) => {
    const data = checklistItemInputSchema.parse(input)

    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, text: data.text } : item,
      ),
    }))
  },

  toggleItem: (id) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    }))
  },

  deleteItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }))
  },
}))
