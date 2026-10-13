import type { Project } from '../../types/project'

export type ProjectTabId = 'kanban' | 'tasks' | 'schedule'

type ProjectTabsProps = {
  project: Project
  activeTab: ProjectTabId
  onTabChange: (tab: ProjectTabId) => void
}

export function ProjectTabs({ activeTab, onTabChange }: ProjectTabsProps) {
  const tabs = [
    { id: 'kanban' as ProjectTabId, label: 'Tablero Kanban' },
    { id: 'tasks' as ProjectTabId, label: 'Lista de tareas' },
    { id: 'schedule' as ProjectTabId, label: 'Cronograma' },
  ] as const

  return (
    <div className="border-b border-slate-200 dark:border-slate-700">
      <nav className="flex gap-1 px-4" aria-label="Navegación interna del proyecto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors
                ${isActive
                  ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 border-b-2 border-indigo-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800'
                }
              `}
              aria-current={isActive ? 'page' : undefined}
              aria-selected={isActive}
              role="tab"
            >
              {tab.label}
            </button>
          )
        })}
      </nav>
    </div>
  )
}