import { create } from 'zustand'
import {
  projectEditSchema,
  projectInputSchema,
  type Project,
  type ProjectEditInput,
  type ProjectInput,
} from '../types/project'

type ProjectStore = {
  projects: Project[]
  selectedProjectId: string | null
  createProject: (input: ProjectInput) => void
  updateProject: (id: string, input: ProjectEditInput) => void
  deleteProject: (id: string) => void
  selectProject: (id: string | null) => void
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  selectedProjectId: null,

  createProject: (input) => {
    const data = projectInputSchema.parse(input)
    const now = new Date().toISOString()

    set((state) => ({
      projects: [
        ...state.projects,
        {
          id: crypto.randomUUID(),
          ...data,
          status: 'active',
          createdAt: now,
          updatedAt: now,
        },
      ],
    }))
  },

  updateProject: (id, input) => {
    const data = projectEditSchema.parse(input)

    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id
          ? { ...project, ...data, updatedAt: new Date().toISOString() }
          : project,
      ),
    }))
  },

  deleteProject: (id) => {
    set((state) => ({
      projects: state.projects.filter((project) => project.id !== id),
      selectedProjectId:
        state.selectedProjectId === id ? null : state.selectedProjectId,
    }))
  },

  selectProject: (id) => {
    set({ selectedProjectId: id })
  },
}))
