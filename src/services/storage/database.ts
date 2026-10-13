const DATABASE_NAME = 'project-manager'
const DATABASE_VERSION = 2

let databasePromise: Promise<IDBDatabase> | null = null

export function openDatabase(): Promise<IDBDatabase> {
  if (databasePromise === null) {
    databasePromise = new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION)

      request.onupgradeneeded = () => {
        const database = request.result

        if (!database.objectStoreNames.contains('projects')) {
          database.createObjectStore('projects', { keyPath: 'id' })
        }
        if (!database.objectStoreNames.contains('tasks')) {
          database.createObjectStore('tasks', { keyPath: 'id' })
        }
        if (!database.objectStoreNames.contains('checklistItems')) {
          database.createObjectStore('checklistItems', { keyPath: 'id' })
        }
        if (!database.objectStoreNames.contains('settings')) {
          database.createObjectStore('settings', { keyPath: 'id' })
        }
      }

      request.onsuccess = () => resolve(request.result)
      request.onerror = () =>
        reject(request.error ?? new Error('No se pudo abrir IndexedDB.'))
    })

    databasePromise.catch(() => {
      databasePromise = null
    })
  }

  return databasePromise
}
