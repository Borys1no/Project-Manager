const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export function isValidDateKey(key: string): boolean {
  if (!DATE_KEY_PATTERN.test(key)) {
    return false
  }
  const [year, month, day] = key.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}

export function getLocalDateKey(date: Date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function parseLocalDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function toUtcMillis(key: string): number {
  const [year, month, day] = key.split('-').map(Number)
  return Date.UTC(year, month - 1, day)
}

export function addDaysToKey(key: string, days: number): string {
  const date = parseLocalDateKey(key)
  date.setDate(date.getDate() + days)
  return getLocalDateKey(date)
}

export function diffDaysKeys(fromKey: string, toKey: string): number {
  return Math.round((toUtcMillis(toKey) - toUtcMillis(fromKey)) / 86_400_000)
}

export function startOfWeekKey(key: string): string {
  const date = parseLocalDateKey(key)
  const weekday = date.getDay()
  const offset = weekday === 0 ? -6 : 1 - weekday
  date.setDate(date.getDate() + offset)
  return getLocalDateKey(date)
}

export function startOfMonthKey(key: string): string {
  const date = parseLocalDateKey(key)
  date.setDate(1)
  return getLocalDateKey(date)
}

export function compareDateKeys(a: string, b: string): number {
  return a.localeCompare(b)
}
