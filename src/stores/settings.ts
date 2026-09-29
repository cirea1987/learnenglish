import { defineStore } from 'pinia'
import { storage } from '@/utils/storage'

export const avatarOptions = [
  { id: 'cat', name: '猫咪', emoji: '🐱' },
  { id: 'princess', name: '公主', emoji: '👸' },
  { id: 'rabbit', name: '兔子', emoji: '🐰' },
  { id: 'panda', name: '熊猫', emoji: '🐼' },
  { id: 'fox', name: '小狐狸', emoji: '🦊' },
  { id: 'unicorn', name: '独角兽', emoji: '🦄' },
] as const

export type AvatarId = typeof avatarOptions[number]['id']

export interface SettingsState {
  volume: number
  dailyLimit: number
  soundEnabled: boolean
  musicEnabled: boolean
  theme: 'cat' | 'princess'
  avatar: AvatarId
}

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsState => ({
    volume: 0.8,
    dailyLimit: 20,
    soundEnabled: true,
    musicEnabled: true,
    theme: 'cat',
    avatar: 'cat',
  }),
  actions: {
    setAvatar(avatar: AvatarId) {
      this.avatar = avatar
      this.save()
    },
    setTheme(theme: SettingsState['theme']) {
      this.theme = theme
      this.save()
    },
    save() {
      storage.set('settings', this.$state)
    },
    load() {
      const data = storage.get<SettingsState>('settings')
      if (data) {
        const avatar = avatarOptions.find((option) => option.id === data.avatar)?.id ?? 'cat'
        this.$patch({ ...data, theme: data.theme === 'princess' ? 'princess' : 'cat', avatar })
      }
    },
  },
})
