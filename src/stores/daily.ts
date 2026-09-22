import { defineStore } from 'pinia'
import { storage } from '@/utils/storage'

export interface DailyTask {
  id: 'letters' | 'words' | 'readAloud'
  desc: string
  target: number
  reward: number
}

export const dailyTasks: DailyTask[] = [
  { id: 'letters', desc: '学习 3 个字母音', target: 3, reward: 20 },
  { id: 'words', desc: '拼读 5 个单词', target: 5, reward: 30 },
  { id: 'readAloud', desc: '跟读 3 次', target: 3, reward: 15 },
]

interface DailyState {
  date: string
  progress: Record<DailyTask['id'], number>
  claimed: DailyTask['id'][]
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

export const useDailyStore = defineStore('daily', {
  state: (): DailyState => ({
    date: today(),
    progress: { letters: 0, words: 0, readAloud: 0 },
    claimed: [],
  }),
  actions: {
    ensureToday() {
      if (this.date === today()) return
      this.date = today()
      this.progress = { letters: 0, words: 0, readAloud: 0 }
      this.claimed = []
      this.save()
    },
    record(id: DailyTask['id'], amount = 1) {
      this.ensureToday()
      this.progress[id] += amount
      this.save()
    },
    progressFor(id: DailyTask['id']) {
      this.ensureToday()
      return this.progress[id]
    },
    claim(task: DailyTask) {
      this.ensureToday()
      if (this.claimed.includes(task.id) || this.progress[task.id] < task.target) return 0
      this.claimed.push(task.id)
      this.save()
      return task.reward
    },
    save() {
      storage.set('daily', this.$state)
    },
    load() {
      const data = storage.get<DailyState>('daily')
      if (data) this.$patch(data)
      this.ensureToday()
    },
  },
})