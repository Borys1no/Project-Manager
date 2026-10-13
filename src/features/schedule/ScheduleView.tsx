export function ScheduleView() {
  return (
    <section className="py-8">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center dark:bg-slate-800 mb-4">
          <svg className="w-8 h-8 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Cronograma</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          Esta sección está pendiente de implementación. Próximamente incluirá vista de calendario,
          línea de tiempo y planificación avanzada de tareas.
        </p>
        <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900 max-w-md mx-auto text-left">
          <h3 className="font-medium text-slate-900 dark:text-slate-100">Funcionalidades previstas:</h3>
          <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" aria-hidden="true" />
              Vista de calendario mensual/semanal
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" aria-hidden="true" />
              Línea de tiempo de tareas con fechas límite
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" aria-hidden="true" />
              Indicadores de carga de trabajo
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" aria-hidden="true" />
              Filtros por proyecto y estado
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}