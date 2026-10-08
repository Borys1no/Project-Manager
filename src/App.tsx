import { AppShell } from './app/AppShell'
import { ProjectDetailView } from './features/projects/ProjectDetailView'
import { ProjectsView } from './features/projects/ProjectsView'
import { useProjectStore } from './stores/projectStore'

function App() {
  const project = useProjectStore((state) =>
    state.projects.find((item) => item.id === state.selectedProjectId),
  )
  const selectProject = useProjectStore((state) => state.selectProject)

  return (
    <AppShell>
      {project ? (
        <ProjectDetailView project={project} onBack={() => selectProject(null)} />
      ) : (
        <ProjectsView />
      )}
    </AppShell>
  )
}

export default App
