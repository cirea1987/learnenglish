const PREFIX = 'eng_'

export const storage = {
  set(key: string, value: unknown) {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  },
  get<T>(key: string): T | null {
    const v = localStorage.getItem(PREFIX + key)
    return v ? (JSON.parse(v) as T) : null
  },
  remove(key: string) {
    localStorage.removeItem(PREFIX + key)
  },
  clear() {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k))
  },
}

export function migrate(version = 1) {
  const v = storage.get<number>('version')
  if (!v) {
    storage.set('version', version)
    return
  }
  if (v < version) {
    storage.set('version', version)
  }
}
