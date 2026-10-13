import { create } from 'zustand'
import {
  checklistItemInputSchema,
  checklistItemSchema,
  type ChecklistItem,
  type ChecklistItemInput,
} from '../types/checklist'
import { checklistStorage } from '../services/storage/storageService'

type ChecklistStore = {
  items: ChecklistItem[]
  loadChecklistItems: () => Promise<void>
  addItem: (taskId: string, input: ChecklistItemInput) => void
  updateItem: (id: string, input: ChecklistItemInput) => void
  toggleItem: (id: string) => void
  deleteItem: (id: string) => void
}

export const useChecklistStore = create<ChecklistStore>((set, get) => ({
  items: [],

  loadChecklistItems: async () => {
    const items = await checklistStorage.getAll()
    set({ items })
  },

  addItem: (taskId, input) => {
    const data = checklistItemInputSchema.parse(input)
    const positions = get()
      .items.filter((item) => item.taskId === taskId)
      .map((item) => item.position)
    const position = positions.length > 0 ? Math.max(...positions) + 1 : 0

    const item = checklistItemSchema.parse({
      id: crypto.randomUUID(),
      taskId,
      text: data.text,
      completed: false,
      position,
    })

    set((state) => ({ items: [...state.items, item] }))
    void checklistStorage.save(item)
  },

  updateItem: (id, input) => {
    const data = checklistItemInputSchema.parse(input)
    const existing = get().items.find((item) => item.id === id)
    if (!existing) {
      return
    }
    const updated: ChecklistItem = { ...existing, text: data.text }

    set((state) => ({
      items: state.items.map((item) => (item.id === id ? updated : item)),
    }))
    void checklistStorage.save(updated)
  },

  toggleItem: (id) => {
    const existing = get().items.find((item) => item.id === id)
    if (!existing) {
      return
    }
    const updated: ChecklistItem = { ...existing, completed: !existing.completed }

    set((state) => ({
      items: state.items.map((item) => (item.id === id ? updated : item)),
    }))
    void checklistStorage.save(updated)
  },

  deleteItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }))
    void checklistStorage.remove(id)
  },
}))
