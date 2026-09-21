<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRewardStore } from '@/stores/reward'
import { playComplete, playCorrect } from '@/utils/sfx'
import Confetti from '@/components/reward/Confetti.vue'

const reward = useRewardStore()
const showConfetti = ref(false)

const petStages = ['🥚', '🦊', '🐕', '🦁', '🐉']
const petName = computed(() => {
  const names = ['小蛋蛋', '小火狐', '小狼狗', '小狮子', '小龙王']
  return names[Math.min(reward.pet.level - 1, names.length - 1)]
})
const petEmoji = computed(() => {
  return petStages[Math.min(reward.pet.level - 1, petStages.length - 1)]
})

function feed() {
  if (reward.coins < 10) return
  const prevLevel = reward.pet.level
  reward.feedPet()
  if (reward.pet.level > prevLevel) {
    showConfetti.value = true
    playComplete()
    setTimeout(() => { showConfetti.value = false }, 2000)
  } else {
    playCorrect()
  }
}
</script>

<template>
  <div class="pet-card">
    <Confetti :show="showConfetti" />
    <div class="scene">
      <span class="spark">✦</span>
      <span class="pet">{{ petEmoji }}</span>
      <span class="heart">♥</span>
    </div>
    <h3>{{ petName }} · Lv.{{ reward.pet.level }}</h3>
    <div class="bar"><span :style="{ width: (reward.pet.exp / reward.pet.nextExp * 100) + '%' }"></span></div>
    <small>{{ reward.pet.exp }} / {{ reward.pet.nextExp }} 经验</small>
    <button :disabled="reward.coins < 10" @click="feed">🍖 喂一喂 (-10金币)</button>
  </div>
</template>

<style scoped>
.pet-card { padding: 18px; border-radius: 20px; background: #fff; box-shadow: 0 6px 0 #eee4d2; text-align: center; }
.scene { position: relative; height: 110px; display: grid; place-items: center; }
.pet { font-size: 72px; animation: float 2.5s ease-in-out infinite; }
.spark { position: absolute; top: 10px; left: 20%; color: #f9bf45; animation: twinkle 1.5s infinite; }
.heart { position: absolute; bottom: 10px; right: 20%; color: #ff6b6b; animation: twinkle 1.2s infinite reverse; }
.bar { height: 10px; border-radius: 10px; background: #eee; margin: 10px 0; overflow: hidden; }
.bar span { display: block; height: 100%; border-radius: 10px; background: linear-gradient(90deg, #68c986, #4ecdc4); transition: width .3s; }
button { margin-top: 12px; padding: 10px 18px; border-radius: 14px; background: #ff6b6b; color: #fff; font-weight: 700; box-shadow: 0 4px 0 #e95749; }
button:disabled { opacity: .5; }
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
@keyframes twinkle { 0%, 100% { opacity: .4; transform: scale(.9); } 50% { opacity: 1; transform: scale(1.1); } }
</style>
