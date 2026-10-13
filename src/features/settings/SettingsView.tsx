import { useThemeStore } from '../../stores/themeStore'

export function SettingsView() {
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)

  return (
    <section className="py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Configuración</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">Preferencias de la aplicación</p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Apariencia</h2>
        </div>

        <div className="p-4 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Tema visual
            </label>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              Elige el modo de color de la interfaz. El cambio se aplica inmediatamente y se guarda automáticamente.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className={`
                    w-6 h-6 rounded-lg flex items-center justify-center text-sm
                    ${theme === 'light' ? 'bg-amber-100 text-amber-700 ring-2 ring-amber-400 dark:bg-amber-900/30 dark:text-amber-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}
                  `} aria-hidden="true">
                    ☀
                  </span>
                  <span>Claro</span>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span className={`
                    w-6 h-6 rounded-lg flex items-center justify-center text-sm
                    ${theme === 'dark' ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-400 dark:bg-indigo-900/30 dark:text-indigo-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}
                  `} aria-hidden="true">
                    ☾
                  </span>
                  <span>Oscuro</span>
                </div>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                aria-pressed={theme === 'dark'}
                aria-label={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
                className={`
                  relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900
                  ${theme === 'dark' ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}
                `}
                role="switch"
              >
                <span
                  className={`
                    inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform
                    ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}
                  `}
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Más opciones</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Próximamente se añadirán más opciones de configuración como notificaciones, idioma y sincronización.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}