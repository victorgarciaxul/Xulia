const KEY = 'xulia_academy_progress'

export function getCompleted(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(KEY)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch {
    return new Set()
  }
}

export function markComplete(lessonId: string) {
  const set = getCompleted()
  set.add(lessonId)
  localStorage.setItem(KEY, JSON.stringify([...set]))
}

export function isCompleted(lessonId: string): boolean {
  return getCompleted().has(lessonId)
}
