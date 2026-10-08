import { useState, type FormEvent } from 'react'
import { useChecklistStore } from '../../stores/checklistStore'
import { checklistItemInputSchema } from '../../types/checklist'

type TaskChecklistProps = {
  taskId: string
}

export function TaskChecklist({ taskId }: TaskChecklistProps) {
  const items = useChecklistStore((state) => state.items)
  const addItem = useChecklistStore((state) => state.addItem)
  const updateItem = useChecklistStore((state) => state.updateItem)
  const toggleItem = useChecklistStore((state) => state.toggleItem)
  const deleteItem = useChecklistStore((state) => state.deleteItem)

  const [newText, setNewText] = useState('')
  const [addError, setAddError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')
  const [editError, setEditError] = useState<string | null>(null)

  const taskItems = items
    .filter((item) => item.taskId === taskId)
    .sort((a, b) => a.position - b.position)
  const completedCount = taskItems.filter((item) => item.completed).length

  const handleAdd = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const result = checklistItemInputSchema.safeParse({ text: newText })
    if (!result.success) {
      setAddError(
        result.error.issues[0]?.message ?? 'Revisa los datos del formulario.',
      )
      return
    }

    addItem(taskId, result.data)
    setNewText('')
    setAddError(null)
  }

  const handleStartEdit = (id: string, text: string) => {
    setEditingId(id)
    setEditingText(text)
    setEditError(null)
  }

  const handleSaveEdit = () => {
    if (editingId === null) {
      return
    }

    const result = checklistItemInputSchema.safeParse({ text: editingText })
    if (!result.success) {
      setEditError(
        result.error.issues[0]?.message ?? 'Revisa los datos del formulario.',
      )
      return
    }

    updateItem(editingId, result.data)
    setEditingId(null)
    setEditingText('')
    setEditError(null)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingText('')
    setEditError(null)
  }

  return (
    <section aria-label="Checklist" className="mt-6">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
        Checklist
      </h3>

      {taskItems.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {completedCount} de {taskItems.length} completados
          </p>
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={taskItems.length}
            aria-valuenow={completedCount}
            aria-label="Progreso del checklist"
            className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
          >
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300 dark:bg-blue-500"
              style={{
                width: `${(completedCount / taskItems.length) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      <form
        noValidate
        onSubmit={handleAdd}
        className="mt-3 flex flex-wrap gap-2"
      >
        <label htmlFor="checklist-new-item" className="sr-only">
          Nuevo elemento
        </label>
        <input
          id="checklist-new-item"
          type="text"
          value={newText}
          placeholder="Nuevo elemento"
          onChange={(event) => {
            setNewText(event.target.value)
            setAddError(null)
          }}
          className="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
        />
        <button
          type="submit"
          className="shrink-0 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Agregar
        </button>
        {addError !== null && (
          <p role="alert" className="w-full text-xs text-red-600 dark:text-red-400">
            {addError}
          </p>
        )}
      </form>

      {taskItems.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2">
          {taskItems.map((item) => (
            <li
              key={item.id}
              className="flex items-start gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
            >
              {editingId === item.id ? (
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                  <label htmlFor={`checklist-edit-${item.id}`} className="sr-only">
                    Texto del elemento
                  </label>
                  <input
                    id={`checklist-edit-${item.id}`}
                    type="text"
                    value={editingText}
                    autoFocus
                    onChange={(event) => {
                      setEditingText(event.target.value)
                      setEditError(null)
                    }}
                    className="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                  />
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    className="shrink-0 rounded-md bg-blue-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-blue-700"
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="shrink-0 rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    Cancelar
                  </button>
                  {editError !== null && (
                    <p
                      role="alert"
                      className="w-full text-xs text-red-600 dark:text-red-400"
                    >
                      {editError}
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <input
                    id={`checklist-item-${item.id}`}
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleItem(item.id)}
                    className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-blue-600"
                  />
                  <label
                    htmlFor={`checklist-item-${item.id}`}
                    className={`min-w-0 flex-1 break-words text-sm ${
                      item.completed
                        ? 'text-slate-400 line-through dark:text-slate-500'
                        : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {item.text}
                  </label>
                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(item.id, item.text)}
                      aria-label={`Editar elemento "${item.text}"`}
                      className="rounded px-1.5 py-0.5 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteItem(item.id)}
                      aria-label={`Eliminar elemento "${item.text}"`}
                      className="rounded px-1.5 py-0.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                    >
                      Eliminar
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
