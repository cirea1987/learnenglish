import { defineStore } from 'pinia'
import { storage } from '@/utils/storage'

export interface UserState {
  userId: string
  createdAt: number
  nickname: string
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    userId: 'local-001',
    createdAt: Date.now(),
    nickname: '小小拼读家',
  }),
  actions: {
    save() {
      storage.set('user', this.$state)
    },
    load() {
      const data = storage.get<UserState>('user')
      if (data) this.$patch(data)
    },
  },
})
