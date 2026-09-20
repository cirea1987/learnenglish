import { defineStore } from 'pinia'
import { storage } from '@/utils/storage'

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
}

export const useProgressStore = defineStore('progress', {
  state: (): ProgressState => ({
    levels: {},
    learnedLetters: [],
    learnedWords: [],
    currentLevel: 'L1-1',
  }),
  actions: {
    completeLevel(levelId: string, stars: number) {
      this.levels[levelId] = { stars, completed: true, completedAt: Date.now() }
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
