<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import TopBar from '@/components/common/TopBar.vue'
import LetterCard from '@/components/learning/LetterCard.vue'
import Confetti from '@/components/reward/Confetti.vue'
import { letters } from '@/data/letters'
import { levels } from '@/data/levels'
import { useProgressStore } from '@/stores/progress'
import { useRewardStore } from '@/stores/reward'
import { speak } from '@/utils/speak'
import { playComplete } from '@/utils/sfx'

const route = useRoute()
const progress = useProgressStore()
const reward = useRewardStore()
const level = computed(() => levels.find((l) => l.id === route.params.id) || levels[0])
const levelLetters = computed(() => letters.filter((l) => level.value.letters?.includes(l.upper)))
const praise = ref('')
const showConfetti = ref(false)
const praises = ['Great job!', 'Well done!', 'You are awesome!', 'Fantastic!', 'Super star!']

function done() {
  const alreadyCompleted = progress.levels[level.value.id]?.completed === true
  levelLetters.value.forEach((l) => progress.learnLetter(l.upper))
  progress.completeLevel(level.value.id, 3)
  if (!alreadyCompleted) {
    reward.addStars(3)
    reward.addCoins(10)
  }
  progress.unlockNextLevel(level.value.id)
  praise.value = praises[Math.floor(Math.random() * praises.length)]
  showConfetti.value = true
  playComplete()
  speak(praise.value)
  setTimeout(() => { showConfetti.value = false }, 2500)
}
</script>

<template>
  <div class="page">
    <Confetti :show="showConfetti" />
    <TopBar :title="level.title" show-back />
    <section class="intro"><p>认一认这些字母，点卡片听名字，长按或点小喇叭听字母音。</p></section>
    <div class="grid">
      <LetterCard v-for="letter in levelLetters" :key="letter.id" :letter="letter" />
    </div>
    <button class="done-btn" @click="done">我学会了！+3 星星</button>
    <p v-if="praise" class="praise">{{ praise }}</p>
  </div>
</template>

<style scoped>
.page { min-height: 100vh; background: #fff8e8; padding-bottom: 30px; }
.intro { padding: 10px 20px 20px; color: #596b81; font-size: 14px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 14px; padding: 0 20px; }
.done-btn { display: block; width: calc(100% - 40px); margin: 24px 20px 0; padding: 16px; border-radius: 18px; background: #68c986; color: #fff; font-size: 18px; font-weight: 700; box-shadow: 0 5px 0 #48ad69; }
.praise { margin-top: 16px; text-align: center; font-family: 'Baloo 2', sans-serif; font-size: 24px; color: #ff705d; font-weight: 800; }
</style>
