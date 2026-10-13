import { create } from 'zustand'
import {
  projectEditSchema,
  projectInputSchema,
  type Project,
  type ProjectEditInput,
  type ProjectInput,
} from '../types/project'
import { projectStorage } from '../services/storage/storageService'

type ProjectStore = {
  projects: Project[]
  selectedProjectId: string | null
  loadProjects: () => Promise<void>
  createProject: (input: ProjectInput) => void
  updateProject: (id: string, input: ProjectEditInput) => void
  deleteProject: (id: string) => void
  selectProject: (id: string | null) => void
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  selectedProjectId: null,

  loadProjects: async () => {
    const projects = await projectStorage.getAll()
    set({ projects })
  },

  createProject: (input) => {
    const data = projectInputSchema.parse(input)
    const now = new Date().toISOString()
    const project: Project = {
      id: crypto.randomUUID(),
      ...data,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    }

    set((state) => ({
      projects: [...state.projects, project],
    }))
    void projectStorage.save(project)
  },

  updateProject: (id, input) => {
    const data = projectEditSchema.parse(input)
    const existing = get().projects.find((project) => project.id === id)
    if (!existing) {
      return
    }
    const updated: Project = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    }

    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id ? updated : project,
      ),
    }))
    void projectStorage.save(updated)
  },

  deleteProject: (id) => {
    set((state) => ({
      projects: state.projects.filter((project) => project.id !== id),
      selectedProjectId:
        state.selectedProjectId === id ? null : state.selectedProjectId,
    }))
    void projectStorage.remove(id)
  },

  selectProject: (id) => {
    set({ selectedProjectId: id })
  },
}))
