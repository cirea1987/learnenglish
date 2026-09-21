<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TopBar from '@/components/common/TopBar.vue'
import PhonicsTrain from '@/components/learning/PhonicsTrain.vue'
import Confetti from '@/components/reward/Confetti.vue'
import { phonics, getPhonicEmoji } from '@/data/phonics'
import { levels } from '@/data/levels'
import { useProgressStore } from '@/stores/progress'
import { useRewardStore } from '@/stores/reward'
import { speak } from '@/utils/speak'
import { playComplete } from '@/utils/sfx'

const route = useRoute()
const router = useRouter()
const progress = useProgressStore()
const reward = useRewardStore()
const level = computed(() => levels.find((l) => l.id === route.params.id) || levels.find((l) => l.type === 'phonics')!)
const list = computed(() => phonics.filter((p) => level.value.phonics?.includes(p.id)))
const index = ref(0)
const showConfetti = ref(false)
const finished = ref(false)

const current = computed(() => list.value[index.value])
const emoji = computed(() => current.value ? getPhonicEmoji(current.value.word) : '📖')

function next() {
  if (index.value < list.value.length - 1) {
    index.value++
  } else {
    finish()
  }
}

function prev() {
  if (index.value > 0) index.value--
}

function finish() {
  finished.value = true
  showConfetti.value = true
  const stars = Math.min(3, Math.max(1, list.value.length))
  progress.completeLevel(level.value.id, stars)
  reward.addStars(stars)
  reward.addCoins(10)
  progress.unlockNextLevel(level.value.id)
  playComplete()
  speak('Great job! You finished this level!')
  setTimeout(() => { showConfetti.value = false }, 2500)
}

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="page">
    <Confetti :show="showConfetti" />
    <TopBar :title="level.title" show-back />
    <section class="stage">
      <template v-if="!finished">
        <div class="progress-bar">
          <div class="fill" :style="{ width: ((index + 1) / list.length * 100) + '%' }" />
          <span class="count">{{ index + 1 }} / {{ list.length }}</span>
        </div>
        <div class="word-emoji">{{ emoji }}</div>
        <PhonicsTrain v-if="current" :phonic="current" />
        <div class="nav-btns">
          <button class="nav-btn" :disabled="index === 0" @click="prev">← 上一个</button>
          <button class="nav-btn primary" @click="next">{{ index < list.length - 1 ? '下一个 →' : '完成关卡 🏆' }}</button>
        </div>
      </template>

      <template v-else>
        <div class="done-panel">
          <div class="trophy">🏆</div>
          <h2>关卡完成！</h2>
          <p>你学会了 {{ list.length }} 个单词</p>
          <p class="reward">获得 3 颗星星 + 10 金币</p>
          <button class="primary-btn" @click="goHome">返回地图</button>
        </div>
      </template>
    </section>
  </div>
</template>

<style scoped>
.page { min-height: 100vh; background: #fff8e8; }
.stage { padding: 24px 20px; display: grid; gap: 20px; }
.progress-bar { position: relative; height: 18px; border-radius: 10px; background: #eee4d2; overflow: hidden; }
.progress-bar .fill { height: 100%; border-radius: 10px; background: linear-gradient(90deg, #ffe66d, #68c986); transition: width 0.4s ease; }
.progress-bar .count { position: absolute; inset: 0; display: grid; place-items: center; font-size: 11px; color: #5c4b32; font-weight: 700; }
.word-emoji { text-align: center; font-size: 64px; margin: 4px 0; }
.nav-btns { display: flex; gap: 12px; }
.nav-btn { flex: 1; padding: 14px; border-radius: 16px; background: #fff; color: #50657b; font-weight: 700; box-shadow: 0 4px 0 #e9e9e2; }
.nav-btn:disabled { opacity: 0.5; }
.nav-btn.primary { background: #ff6b6b; color: #fff; box-shadow: 0 4px 0 #e95749; }
.done-panel { display: grid; justify-items: center; gap: 14px; padding: 40px 24px; border-radius: 24px; background: #fff; box-shadow: 0 6px 0 #eee4d2; }
.trophy { font-size: 72px; }
.done-panel h2 { margin: 0; color: #263b54; font-size: 24px; }
.done-panel p { color: #718093; margin: 0; }
.done-panel .reward { color: #f6b62c; font-weight: 800; font-size: 18px; }
.primary-btn { display: block; width: 100%; padding: 16px; border-radius: 18px; background: #68c986; color: #fff; font-size: 18px; font-weight: 700; box-shadow: 0 5px 0 #48ad69; }
</style>
