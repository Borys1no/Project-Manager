import { AppShell } from './app/AppShell'
import { ProjectDetailView } from './features/projects/ProjectDetailView'
import { ProjectsView } from './features/projects/ProjectsView'
import { HomeView } from './features/home/HomeView'
import { TasksView } from './features/tasks/TasksView'
import { ScheduleView } from './features/schedule/ScheduleView'
import { SettingsView } from './features/settings/SettingsView'
import { useProjectStore } from './stores/projectStore'
import { useUiStore } from './stores/uiStore'

function App() {
  const activeSection = useUiStore((state) => state.activeSection)
  const project = useProjectStore((state) =>
    state.projects.find((item) => item.id === state.selectedProjectId),
  )
  const selectProject = useProjectStore((state) => state.selectProject)

  const renderContent = () => {
    if (project) {
      return <ProjectDetailView project={project} onBack={() => selectProject(null)} />
    }

    switch (activeSection) {
      case 'home':
        return <HomeView />
      case 'projects':
        return <ProjectsView />
      case 'tasks':
        return <TasksView />
      case 'schedule':
        return <ScheduleView />
      case 'settings':
        return <SettingsView />
      default:
        return <HomeView />
    }
  }

  return (
    <AppShell>
      {renderContent()}
    </AppShell>
  )
}

export default App