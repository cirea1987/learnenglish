<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TopBar from '@/components/common/TopBar.vue'
import LetterSoundCard from '@/components/learning/LetterSoundCard.vue'
import ListenPickGame from '@/components/learning/ListenPickGame.vue'
import { levels } from '@/data/levels'
import { letterSounds } from '@/data/letterSounds'
import { letters } from '@/data/letters'
import { shuffle } from '@/utils/shuffle'
import { speak } from '@/utils/speak'
import { useProgressStore } from '@/stores/progress'
import { useRewardStore } from '@/stores/reward'

const route = useRoute()
const router = useRouter()
const progress = useProgressStore()
const reward = useRewardStore()
const level = computed(() => levels.find((l) => l.id === route.params.id) || levels.find((l) => l.type === 'letterSound')!)
const targets = computed(() => letterSounds.filter((s) => level.value.letters?.includes(s.letter)))
const phase = ref<'learn' | 'game' | 'done'>('learn')
const index = ref(0)
const correctCount = ref(0)

const current = computed(() => targets.value[index.value])
const currentLetter = computed(() => letters.find((l) => l.upper === current.value.letter)!)
const options = computed(() => {
  const pool = letters.map((l) => l.upper).filter((l) => l !== current.value.letter)
  return shuffle([current.value.letter, ...shuffle(pool).slice(0, 2)])
})

function startGame() {
  phase.value = 'game'
  index.value = 0
  correctCount.value = 0
}

function next() {
  correctCount.value++
  if (index.value < targets.value.length - 1) {
    index.value++
  } else {
    const stars = Math.min(3, Math.max(1, correctCount.value))
    progress.completeLevel(level.value.id, stars)
    reward.addStars(stars)
    reward.addCoins(10)
    progress.unlockNextLevel(level.value.id)
    phase.value = 'done'
    speak('Great job! You finished this level!')
  }
}

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="page">
    <TopBar :title="level.title" show-back />
    <section class="stage">
      <!-- 学习阶段 -->
      <template v-if="phase === 'learn'">
        <p class="tip">先听一听，记住每个字母的发音</p>
        <div class="learn-list">
          <LetterSoundCard v-for="item in targets" :key="item.letter" :data="item" />
        </div>
        <button class="primary-btn" @click="startGame">我记住了，开始闯关！</button>
      </template>

      <!-- 游戏阶段 -->
      <template v-if="phase === 'game'">
        <p class="count">第 {{ index + 1 }} / {{ targets.length }} 题</p>
        <ListenPickGame v-if="current" :target="current.letter" :options="options" @correct="next" />
      </template>

      <!-- 完成阶段 -->
      <template v-if="phase === 'done'">
        <div class="done-panel">
          <div class="trophy">🏆</div>
          <h2>关卡完成！</h2>
          <p>获得 {{ Math.min(3, Math.max(1, correctCount.value)) }} 颗星星 + 10 金币</p>
          <button class="primary-btn" @click="goHome">返回地图</button>
        </div>
      </template>
    </section>
  </div>
</template>

<style scoped>
.page { min-height: 100vh; background: #fff8e8; }
.stage { padding: 30px 20px; display: grid; gap: 18px; }
.tip { text-align: center; color: #8b98a8; font-size: 14px; }
.learn-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 14px; }
.count { text-align: center; color: #8b98a8; font-size: 13px; }
.primary-btn { display: block; width: 100%; padding: 16px; border-radius: 18px; background: #68c986; color: #fff; font-size: 18px; font-weight: 700; box-shadow: 0 5px 0 #48ad69; }
.done-panel { display: grid; justify-items: center; gap: 14px; padding: 40px 24px; border-radius: 24px; background: #fff; box-shadow: 0 6px 0 #eee4d2; }
.trophy { font-size: 72px; }
.done-panel h2 { margin: 0; color: #263b54; font-size: 24px; }
.done-panel p { color: #718093; }
</style>
