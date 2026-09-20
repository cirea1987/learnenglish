import { defineStore } from 'pinia'
import { storage } from '@/utils/storage'

export interface SettingsState {
  volume: number
  dailyLimit: number
  soundEnabled: boolean
  musicEnabled: boolean
}

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsState => ({
    volume: 0.8,
    dailyLimit: 20,
    soundEnabled: true,
    musicEnabled: true,
  }),
  actions: {
    save() {
      storage.set('settings', this.$state)
    },
    load() {
      const data = storage.get<SettingsState>('settings')
      if (data) this.$patch(data)
    },
  },
})
