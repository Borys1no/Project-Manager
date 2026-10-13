import { create } from 'zustand'

export type SectionId = 'home' | 'projects' | 'tasks' | 'schedule' | 'settings'

type UiStore = {
  selectedTaskId: string | null
  openTask: (taskId: string) => void
  closeTask: () => void
  sidebarExpanded: boolean
  toggleSidebar: () => void
  activeSection: SectionId
  setActiveSection: (section: SectionId) => void
}

export const useUiStore = create<UiStore>((set) => ({
  selectedTaskId: null,
  sidebarExpanded: true,
  activeSection: 'home',

  openTask: (taskId) => {
    set({ selectedTaskId: taskId })
  },

  closeTask: () => {
    set({ selectedTaskId: null })
  },

  toggleSidebar: () => {
    set((state) => ({ sidebarExpanded: !state.sidebarExpanded }))
  },

  setActiveSection: (section) => {
    set({ activeSection: section })
  },
}))