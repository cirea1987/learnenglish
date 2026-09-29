const PREFIX = 'eng_'
const memory = new Map<string, unknown>()
let remoteEnabled = false
let localEnabled = false
let saveTimer: ReturnType<typeof setTimeout> | undefined
let saveQueue = Promise.resolve()
const REMOTE_KEYS = ['app', 'progress', 'reward', 'settings', 'user', 'daily'] as const

export type StoredAppData = Record<string, unknown>

function snapshotData() {
  return Object.fromEntries(REMOTE_KEYS.flatMap((key) => {
    const value = memory.get(key)
    return value === undefined ? [] : [[key, value]]
  }))
}

function persistRemote() {
  if (!remoteEnabled) return saveQueue
  const snapshot = snapshotData()
  saveQueue = saveQueue
    .then(() => fetch('/api/data', {
      method: 'PUT',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(snapshot),
    }))
    .then((response) => {
      if (!response.ok) throw new Error('学习进度暂时没有同步成功。')
    })
    .catch((error: unknown) => console.error('学习数据同步失败', error))
  return saveQueue
}

function queueRemoteSave() {
  if (!remoteEnabled) return
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    saveTimer = undefined
    void persistRemote()
  }, 150)
}

export const storage = {
  set(key: string, value: unknown) {
    memory.set(key, value)
    if (REMOTE_KEYS.includes(key as typeof REMOTE_KEYS[number])) {
      if (localEnabled) localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value))
      else queueRemoteSave()
    }
  },
  get<T>(key: string): T | null {
    const value = memory.get(key) as T | undefined
    if (value !== undefined) return value
    if (localEnabled && REMOTE_KEYS.includes(key as typeof REMOTE_KEYS[number])) {
      const stored = localStorage.getItem(`${PREFIX}${key}`)
      return stored ? JSON.parse(stored) as T : null
    }
    return null
  },
  remove(key: string) {
    memory.delete(key)
    if (localEnabled) localStorage.removeItem(`${PREFIX}${key}`)
    else queueRemoteSave()
  },
  clear() {
    memory.clear()
    if (localEnabled) this.clearLegacy()
    else queueRemoteSave()
  },
  activate(data: StoredAppData | null) {
    memory.clear()
    localEnabled = false
    if (data) {
      for (const [key, value] of Object.entries(data)) {
        if (REMOTE_KEYS.includes(key as typeof REMOTE_KEYS[number])) memory.set(key, value)
      }
    }
    remoteEnabled = true
  },
  activateLocal(data: StoredAppData | null) {
    memory.clear()
    remoteEnabled = false
    localEnabled = true
    if (data) {
      for (const [key, value] of Object.entries(data)) {
        if (!REMOTE_KEYS.includes(key as typeof REMOTE_KEYS[number])) continue
        memory.set(key, value)
        localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value))
      }
    }
  },
  deactivate() {
    remoteEnabled = false
    localEnabled = false
    memory.clear()
    if (saveTimer) clearTimeout(saveTimer)
  },
  async flush() {
    if (localEnabled) return
    if (saveTimer) {
      clearTimeout(saveTimer)
      saveTimer = undefined
      await persistRemote()
      return
    }
    await saveQueue
  },
  readLegacy(): StoredAppData {
    const legacy: StoredAppData = {}
    for (const key of REMOTE_KEYS) {
      const stored = localStorage.getItem(`${PREFIX}${key}`)
      if (!stored) continue
      try {
        legacy[key] = JSON.parse(stored) as unknown
      } catch {
        localStorage.removeItem(`${PREFIX}${key}`)
      }
    }
    return legacy
  },
  clearLegacy() {
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith(PREFIX)) localStorage.removeItem(key)
    }
  },
  hasData(data: StoredAppData) {
    return Object.keys(data).some((key) => key !== 'version' && key !== 'hasOpenedBefore')
  },
}

export function migrate(version = 1) {
  const v = storage.get<number>('version')
  if (!v) {
    storage.set('version', version)
    return
  }
  if (v < version) storage.set('version', version)
}
