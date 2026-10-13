import { useEffect, type ReactNode } from 'react'
import { useThemeStore } from '../stores/themeStore'
import { Sidebar } from './Sidebar'
import { NotificationsMenu } from '../features/notifications/NotificationsMenu'

type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const theme = useThemeStore((state) => state.theme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Sidebar />

      <div className={`
        transition-all duration-200 ease-out
        lg:ml-64
        ${''}
      `}>
        <header className="sticky top-0 z-30 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Project Manager</h1>
            <div className="flex shrink-0 items-center gap-2">
              <NotificationsMenu />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}