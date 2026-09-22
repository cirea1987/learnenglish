import { defineStore } from 'pinia'
import { storage } from '@/utils/storage'

export interface Pet {
  id: string
  level: number
  exp: number
  nextExp: number
  hungry: number
}

export interface RewardState {
  stars: number
  coins: number
  stickers: string[]
  badges: string[]
  pet: Pet
}

export const useRewardStore = defineStore('reward', {
  state: (): RewardState => ({
    stars: 0,
    coins: 0,
    stickers: [],
    badges: [],
    pet: { id: 'fox', level: 1, exp: 0, nextExp: 100, hungry: 0 },
  }),
  actions: {
    addStars(n: number) {
      this.stars += n
      this.save()
    },
    addCoins(n: number) {
      this.coins += n
      this.save()
    },
    addSticker(id: string) {
      if (!this.stickers.includes(id)) {
        this.stickers.push(id)
        this.save()
      }
    },
    addBadge(id: string) {
      if (!this.badges.includes(id)) {
        this.badges.push(id)
        this.save()
      }
    },
    syncBadges(learnedLetters: string[], completedLevelCount: number, hasPhonicsLevel: boolean) {
      if (this.stars > 0) this.addBadge('first')
      if (learnedLetters.length >= 5) this.addBadge('sound')
      if (this.stars >= 20) this.addBadge('star')
      if (learnedLetters.length >= 26) this.addBadge('letter')
      if (hasPhonicsLevel) this.addBadge('phonics')
      if (completedLevelCount >= 5) this.addBadge('champion')
    },
    feedPet() {
      if (this.coins >= 10) {
        this.coins -= 10
        this.pet.exp += 20
        this.pet.hungry = Math.max(0, this.pet.hungry - 1)
        if (this.pet.exp >= this.pet.nextExp) {
          this.pet.level += 1
          this.pet.exp = 0
          this.pet.nextExp = Math.floor(this.pet.nextExp * 1.5)
        }
        this.save()
      }
    },
    save() {
      storage.set('reward', this.$state)
    },
    load() {
      const data = storage.get<RewardState>('reward')
      if (data) this.$patch(data)
    },
  },
})
