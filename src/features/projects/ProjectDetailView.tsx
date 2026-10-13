import { useState, useMemo } from 'react'
import { useProjectStore } from '../../stores/projectStore'
import { useUiStore } from '../../stores/uiStore'
import { KanbanBoard } from '../board/KanbanBoard'
import { ProjectTabs, type ProjectTabId } from './ProjectTabs'
import { ProjectTaskList } from './ProjectTaskList'
import { ScheduleView } from '../schedule/ScheduleView'
import { ProjectStatusBadge } from './ProjectStatusBadge'
import { ProjectForm } from './ProjectForm'
import { TaskForm } from '../tasks/TaskForm'
import type { Project } from '../../types/project'
import { getProjectColumns } from '../../types/column'

type ProjectDetailViewProps = {
  project: Project
  onBack: () => void
}

export function ProjectDetailView({ project, onBack }: ProjectDetailViewProps) {
  const [isEditingProject, setIsEditingProject] = useState(false)
  const [isCreatingTask, setIsCreatingTask] = useState(false)
  const [activeTab, setActiveTab] = useState<ProjectTabId>('kanban')

  const selectProject = useProjectStore((state) => state.selectProject)
  const updateProject = useProjectStore((state) => state.updateProject)
  const deleteProject = useProjectStore((state) => state.deleteProject)
  const openTask = useUiStore((state) => state.openTask)

  const columns = useMemo(() => getProjectColumns(project.id), [project.id])

  const handleOpenTask = (taskId: string) => {
    openTask(taskId)
  }

  const handleCreateTask = () => {
    setIsCreatingTask(true)
  }

  const handleTaskFormClose = () => {
    setIsCreatingTask(false)
  }

  const handleEditProject = () => {
    setIsEditingProject(true)
  }

  const handleProjectFormClose = () => {
    setIsEditingProject(false)
  }

  const handleArchiveProject = () => {
    updateProject(project.id, { ...project, status: 'archived' })
  }

  const handleReactivateProject = () => {
    updateProject(project.id, { ...project, status: 'active' })
  }

  const handleDeleteProject = () => {
    const confirmed = window.confirm(
      `¿Eliminar el proyecto "${project.name}"?\n\nEsta acción no se puede deshacer y también eliminará todas sus tareas.`,
    )
    if (confirmed) {
      deleteProject(project.id)
      onBack()
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'kanban':
        return (
          <KanbanBoard
            project={project}
            onCreateTask={handleCreateTask}
          />
        )
      case 'tasks':
        return (
          <ProjectTaskList
            project={project}
            onOpenTask={handleOpenTask}
          />
        )
      case 'schedule':
        return <ScheduleView />
      default:
        return null
    }
  }

  return (
    <section className="py-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm mb-6" aria-label="Migas de pan">
        <button
          type="button"
          onClick={() => {
            selectProject(null)
            onBack()
          }}
          className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          Inicio
        </button>
        <svg className="w-4 h-4 text-slate-300 dark:text-slate-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M9 18l6-6-6-6" />
        </svg>
        <button
          type="button"
          onClick={onBack}
          className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          Mis proyectos
        </button>
        <svg className="w-4 h-4 text-slate-300 dark:text-slate-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M9 18l6-6-6-6" />
        </svg>
        <span className="text-slate-900 dark:text-slate-100 font-medium truncate max-w-xs" aria-current="page">
          {project.name}
        </span>
      </nav>

      {/* Project Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-10 w-10 shrink-0 rounded-xl"
                style={{ backgroundColor: project.color }}
              />
              <div>
                <h1 className="break-words text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {project.name}
                </h1>
                <div className="mt-1 flex items-center gap-2">
                  <ProjectStatusBadge status={project.status} />
                </div>
              </div>
            </div>
            {project.description && (
              <p className="mt-3 break-words text-slate-600 dark:text-slate-400">
                {project.description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCreateTask}
              className="w-full sm:w-auto inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
               Nueva tarea
            </button>

            <div className="w-full sm:w-auto flex items-center gap-2">
              <button
                type="button"
                onClick={handleEditProject}
                className="w-full sm:w-auto rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                Editar
              </button>

              {project.status === 'active' ? (
                <button
                  type="button"
                  onClick={handleArchiveProject}
                  className="w-full sm:w-auto rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                  Archivar
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleReactivateProject}
                  className="w-full sm:w-auto rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                  Reactivar
                </button>
              )}

              <button
                type="button"
                onClick={handleDeleteProject}
                className="w-full sm:w-auto rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <ProjectTabs
          project={project}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-slate-900 rounded-b-lg border border-slate-200 dark:border-slate-700 border-t-0">
        {isCreatingTask && activeTab === 'kanban' && (
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <TaskForm
              projectId={project.id}
              columnId={columns[0].id}
              onClose={handleTaskFormClose}
            />
          </div>
        )}

        {isEditingProject && (
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <ProjectForm
              project={project}
              onClose={handleProjectFormClose}
            />
          </div>
        )}

        <div className="p-4 sm:p-6">
          {renderTabContent()}
        </div>
      </div>
    </section>
  )
}