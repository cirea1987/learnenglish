import { defineStore } from 'pinia'
import { useDailyStore } from '@/stores/daily'
import { useProgressStore } from '@/stores/progress'
import { useRewardStore } from '@/stores/reward'
import { useSettingsStore } from '@/stores/settings'
import { useUserStore } from '@/stores/user'
import { migrate, storage, type StoredAppData } from '@/utils/storage'

const DEMO_MODE = import.meta.env.VITE_DEMO_AUTH === 'true'

interface AuthStatusResponse {
  authenticated: boolean
}

interface AuthConfigResponse {
  configured: boolean
}

interface AuthState {
  status: 'checking' | 'anonymous' | 'authenticated' | 'conflict' | 'error'
  isDemoMode: boolean
  configured: boolean
  username: string
  password: string
  error: string
  busy: boolean
  welcomeBack: boolean
  serverData: StoredAppData | null
  legacyData: StoredAppData | null
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, { ...init, credentials: 'same-origin' })
  if (!response.ok) {
    const result = await response.json().catch(() => ({})) as { error?: string }
    throw new Error(result.error ?? '请求失败，请稍后重试。')
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

function loadStores() {
  useProgressStore().load()
  useRewardStore().load()
  useSettingsStore().load()
  useUserStore().load()
  useDailyStore().load()
  migrate()
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    status: 'checking',
    isDemoMode: false,
    configured: false,
    username: '',
    password: '',
    error: '',
    busy: false,
    welcomeBack: false,
    serverData: null,
    legacyData: null,
  }),
  actions: {
    async initialize() {
      if (DEMO_MODE) {
        this.isDemoMode = true
        this.configured = true
        this.status = 'anonymous'
        return
      }
      try {
        const [session, config] = await Promise.all([
          request<AuthStatusResponse>('/api/auth/status'),
          request<AuthConfigResponse>('/api/auth/config'),
        ])
        this.configured = config.configured
        this.status = session.authenticated ? 'checking' : 'anonymous'
        if (session.authenticated) await this.loadAccountData()
      } catch {
        this.status = 'error'
        this.error = '暂时无法连接安全服务，请检查网络后重试。'
      }
    },
    async login() {
      this.busy = true
      this.error = ''
      try {
        if (this.isDemoMode) {
          this.activateData(storage.readLegacy(), true)
          return
        }
        await request('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: this.username, password: this.password }),
        })
        this.password = ''
        this.status = 'checking'
        await this.loadAccountData()
      } catch (error) {
        if (this.status === 'checking') this.status = 'error'
        this.error = error instanceof Error ? error.message : '登录失败，请稍后重试。'
      } finally {
        this.busy = false
      }
    },
    async loadAccountData() {
      const serverData = await request<StoredAppData | null>('/api/data')
      const legacyData = storage.readLegacy()
      this.serverData = serverData
      this.legacyData = legacyData
      if (storage.hasData(serverData ?? {}) && storage.hasData(legacyData)) {
        this.status = 'conflict'
        return
      }
      if (storage.hasData(legacyData)) {
        await request('/api/data', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(legacyData),
        })
        this.activateData(legacyData)
      } else {
        this.activateData(serverData)
      }
    },
    async resolveDataConflict(choice: 'server' | 'browser') {
      if (choice === 'browser' && this.legacyData) {
        this.busy = true
        this.error = ''
        try {
          await request('/api/data', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.legacyData),
          })
          this.activateData(this.legacyData)
        } catch (error) {
          this.error = error instanceof Error ? error.message : '数据迁移失败。'
        } finally {
          this.busy = false
        }
        return
      }
      this.activateData(this.serverData)
    },
    activateData(data: StoredAppData | null, localOnly = false) {
      this.welcomeBack = Boolean(data?.app || data?.progress || data?.reward)
      if (localOnly) storage.activateLocal(data)
      else {
        storage.activate(data)
        storage.clearLegacy()
      }
      useProgressStore().$reset()
      useRewardStore().$reset()
      useSettingsStore().$reset()
      useUserStore().$reset()
      useDailyStore().$reset()
      loadStores()
      storage.set('app', { lastOpenedAt: Date.now() })
      this.serverData = null
      this.legacyData = null
      this.status = 'authenticated'
    },
    async logout() {
      this.busy = true
      try {
        await storage.flush()
        if (!this.isDemoMode) await request('/api/auth/logout', { method: 'POST' })
      } finally {
        storage.deactivate()
        this.status = 'anonymous'
        this.busy = false
      }
    },
  },
})
