import { create } from 'zustand'

type UiStore = {
  selectedTaskId: string | null
  openTask: (taskId: string) => void
  closeTask: () => void
}

export const useUiStore = create<UiStore>((set) => ({
  selectedTaskId: null,

  openTask: (taskId) => {
    set({ selectedTaskId: taskId })
  },

  closeTask: () => {
    set({ selectedTaskId: null })
  },
}))
