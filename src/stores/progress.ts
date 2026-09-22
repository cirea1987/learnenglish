import { defineStore } from 'pinia'
import { storage } from '@/utils/storage'
import { levels } from '@/data/levels'

export interface LevelProgress {
  stars: number
  completed: boolean
  completedAt?: number
}

export interface ProgressState {
  levels: Record<string, LevelProgress>
  learnedLetters: string[]
  learnedWords: string[]
  currentLevel: string
  lastStudyDate?: string
  streakDays: number
}

export const useProgressStore = defineStore('progress', {
  state: (): ProgressState => ({
    levels: {},
    learnedLetters: [],
    learnedWords: [],
    currentLevel: 'L1-1',
    lastStudyDate: undefined,
    streakDays: 0,
  }),
  actions: {
    recordStudy() {
      const today = new Date().toISOString().slice(0, 10)
      if (this.lastStudyDate === today) return

      const previousDate = this.lastStudyDate ? new Date(`${this.lastStudyDate}T00:00:00`) : null
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayKey = yesterday.toISOString().slice(0, 10)

      this.streakDays = previousDate && this.lastStudyDate === yesterdayKey ? this.streakDays + 1 : 1
      this.lastStudyDate = today
      this.save()
    },
    isLevelUnlocked(levelId: string) {
      const level = levels.find((item) => item.id === levelId)
      if (!level) return false
      if (level.unlocked) return true

      const previous = levels.find((item) => item.next === levelId)
      return previous ? this.levels[previous.id]?.completed === true : false
    },
    completeLevel(levelId: string, stars: number) {
      const firstCompletion = this.levels[levelId]?.completed !== true
      this.levels[levelId] = { stars, completed: true, completedAt: Date.now() }
      this.recordStudy()
      this.save()
      return firstCompletion
    },
    unlockNextLevel(levelId: string) {
      const current = levels.find((l) => l.id === levelId)
      const nextId = current?.next
      if (!nextId) return
      if (this.isLevelUnlocked(nextId)) this.setCurrentLevel(nextId)
      this.save()
    },
    learnLetter(letter: string) {
      if (!this.learnedLetters.includes(letter)) {
        this.learnedLetters.push(letter)
        this.save()
      }
    },
    learnWord(word: string) {
      if (!this.learnedWords.includes(word)) {
        this.learnedWords.push(word)
        this.save()
      }
    },
    setCurrentLevel(id: string) {
      this.currentLevel = id
      this.save()
    },
    save() {
      storage.set('progress', this.$state)
    },
    load() {
      const data = storage.get<ProgressState>('progress')
      if (data) this.$patch(data)
    },
  },
})
