import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { useProjectStore } from './stores/projectStore'
import { useTaskStore } from './stores/taskStore'
import { useChecklistStore } from './stores/checklistStore'
import { useThemeStore } from './stores/themeStore'

async function bootstrap() {
  try {
    await Promise.all([
      useProjectStore.getState().loadProjects(),
      useTaskStore.getState().loadTasks(),
      useChecklistStore.getState().loadChecklistItems(),
      useThemeStore.getState().loadTheme(),
    ])
  } catch (error) {
    console.error('No se pudieron cargar los datos persistidos.', error)
  }

  document.documentElement.classList.toggle(
    'dark',
    useThemeStore.getState().theme === 'dark',
  )

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

void bootstrap()
