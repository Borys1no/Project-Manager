import type { ZodType } from 'zod'
import { openDatabase } from './database'
import { projectSchema, type Project } from '../../types/project'
import { taskSchema, type Task } from '../../types/task'
import { checklistItemSchema, type ChecklistItem } from '../../types/checklist'
import {
  THEME_SETTING_ID,
  themeSettingSchema,
  type ThemeSetting,
} from '../../types/theme'

type StorageStoreName = 'projects' | 'tasks' | 'checklistItems' | 'settings'

function getRecord<T>(
  storeName: StorageStoreName,
  id: string,
  schema: ZodType<T>,
): Promise<T | null> {
  return openDatabase()
    .then(
      (database) =>
        new Promise<unknown>((resolve, reject) => {
          const transaction = database.transaction(storeName, 'readonly')
          const request = transaction.objectStore(storeName).get(id)
          request.onsuccess = () => resolve(request.result)
          request.onerror = () =>
            reject(request.error ?? new Error(`No se pudo leer "${storeName}".`))
        }),
    )
    .then((record) => {
      if (record === undefined) {
        return null
      }
      const result = schema.safeParse(record)
      if (result.success) {
        return result.data
      }
      console.warn(
        `Registro descartado de "${storeName}" por no ser válido.`,
        record,
        result.error.issues,
      )
      return null
    })
    .catch((error: unknown) => {
      console.error(`Error al cargar "${storeName}" desde IndexedDB.`, error)
      return null
    })
}

function getAllRecords<T>(
  storeName: StorageStoreName,
  schema: ZodType<T>,
): Promise<T[]> {
  return openDatabase()
    .then(
      (database) =>
        new Promise<unknown[]>((resolve, reject) => {
          const transaction = database.transaction(storeName, 'readonly')
          const request = transaction.objectStore(storeName).getAll()
          request.onsuccess = () => resolve(request.result)
          request.onerror = () =>
            reject(request.error ?? new Error(`No se pudo leer "${storeName}".`))
        }),
    )
    .then((records) => {
      const items: T[] = []
      for (const record of records) {
        const result = schema.safeParse(record)
        if (result.success) {
          items.push(result.data)
        } else {
          console.warn(
            `Registro descartado de "${storeName}" por no ser válido.`,
            record,
            result.error.issues,
          )
        }
      }
      return items
    })
    .catch((error: unknown) => {
      console.error(`Error al cargar "${storeName}" desde IndexedDB.`, error)
      return [] as T[]
    })
}

function saveRecord<T>(storeName: StorageStoreName, record: T): Promise<void> {
  return openDatabase()
    .then(
      (database) =>
        new Promise<void>((resolve, reject) => {
          const transaction = database.transaction(storeName, 'readwrite')
          transaction.objectStore(storeName).put(record)
          transaction.oncomplete = () => resolve()
          transaction.onabort = () =>
            reject(
              transaction.error ?? new Error(`No se pudo guardar en "${storeName}".`),
            )
          transaction.onerror = () =>
            reject(
              transaction.error ?? new Error(`No se pudo guardar en "${storeName}".`),
            )
        }),
    )
    .catch((error: unknown) => {
      console.error(`Error al guardar en "${storeName}" de IndexedDB.`, error)
    })
}

function removeRecord(storeName: StorageStoreName, id: string): Promise<void> {
  return openDatabase()
    .then(
      (database) =>
        new Promise<void>((resolve, reject) => {
          const transaction = database.transaction(storeName, 'readwrite')
          transaction.objectStore(storeName).delete(id)
          transaction.oncomplete = () => resolve()
          transaction.onabort = () =>
            reject(
              transaction.error ?? new Error(`No se pudo eliminar de "${storeName}".`),
            )
          transaction.onerror = () =>
            reject(
              transaction.error ?? new Error(`No se pudo eliminar de "${storeName}".`),
            )
        }),
    )
    .catch((error: unknown) => {
      console.error(`Error al eliminar de "${storeName}" de IndexedDB.`, error)
    })
}

export const projectStorage = {
  getAll: (): Promise<Project[]> => getAllRecords('projects', projectSchema),
  save: (project: Project): Promise<void> => saveRecord('projects', project),
  remove: (id: string): Promise<void> => removeRecord('projects', id),
}

export const taskStorage = {
  getAll: (): Promise<Task[]> => getAllRecords('tasks', taskSchema),
  save: (task: Task): Promise<void> => saveRecord('tasks', task),
  remove: (id: string): Promise<void> => removeRecord('tasks', id),
}

export const checklistStorage = {
  getAll: (): Promise<ChecklistItem[]> =>
    getAllRecords('checklistItems', checklistItemSchema),
  save: (item: ChecklistItem): Promise<void> =>
    saveRecord('checklistItems', item),
  remove: (id: string): Promise<void> => removeRecord('checklistItems', id),
}

export const themeStorage = {
  get: (): Promise<ThemeSetting | null> =>
    getRecord('settings', THEME_SETTING_ID, themeSettingSchema),
  save: (setting: ThemeSetting): Promise<void> =>
    saveRecord('settings', setting),
}
