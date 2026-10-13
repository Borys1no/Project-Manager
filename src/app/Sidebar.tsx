import { useUiStore } from '../stores/uiStore'

const sections = [
  { id: 'home' as const, label: 'Inicio', icon: HomeIcon },
  { id: 'projects' as const, label: 'Mis proyectos', icon: ProjectsIcon },
  { id: 'tasks' as const, label: 'Tareas', icon: TasksIcon },
  { id: 'schedule' as const, label: 'Cronograma', icon: ScheduleIcon },
  { id: 'settings' as const, label: 'Configuración', icon: SettingsIcon },
] as const

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function ProjectsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  )
}

function TasksIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  )
}

function ScheduleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

export function Sidebar() {
  const { sidebarExpanded, toggleSidebar, activeSection, setActiveSection } = useUiStore()

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-40 flex flex-col transition-all duration-200 ease-out
        bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800
        ${sidebarExpanded ? 'w-64' : 'w-16'}
      `}
      aria-label="Navegación principal"
    >
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
        <span className={`
          font-semibold text-lg text-slate-900 dark:text-slate-100
          transition-opacity duration-150
          ${sidebarExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}>
          Project Manager
        </span>
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={sidebarExpanded ? 'Contraer barra lateral' : 'Expandir barra lateral'}
          aria-expanded={sidebarExpanded}
          className="shrink-0 flex items-center justify-center w-8 h-8 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            {sidebarExpanded ? (
              <polyline points="15 18 9 12 15 6" />
            ) : (
              <polyline points="9 18 15 12 9 6" />
            )}
          </svg>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1" aria-label="Secciones principales">
        {sections.map((section) => {
          const isActive = activeSection === section.id
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150
                ${isActive
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800'
                }
                ${!sidebarExpanded ? 'justify-center' : ''}
              `}
              aria-current={isActive ? 'page' : undefined}
              aria-label={sidebarExpanded ? section.label : undefined}
            >
              <span className="shrink-0 w-5 h-5" aria-hidden="true">
                <section.icon className="w-5 h-5" />
              </span>
              <span className={`
                whitespace-nowrap transition-opacity duration-100
                ${sidebarExpanded ? 'opacity-100' : 'opacity-0 absolute pointer-events-none'}
              `}>
                {section.label}
              </span>
            </button>
          )
        })}
      </nav>

      <div className="p-2 border-t border-slate-200 dark:border-slate-800">
        <div className={`
          text-xs text-center text-slate-500 dark:text-slate-400
          transition-opacity duration-150
          ${sidebarExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}>
          v0.0.0
        </div>
      </div>
    </aside>
  )
}