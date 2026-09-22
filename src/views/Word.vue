<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TopBar from '@/components/common/TopBar.vue'
import WordCard from '@/components/learning/WordCard.vue'
import { words } from '@/data/words'
import { levels } from '@/data/levels'
import { useProgressStore } from '@/stores/progress'
import { useRewardStore } from '@/stores/reward'
import { useDailyStore } from '@/stores/daily'

const route = useRoute()
const router = useRouter()
const progress = useProgressStore()
const reward = useRewardStore()
const daily = useDailyStore()
const level = computed(() => levels.find((l) => l.id === route.params.id) || levels.find((l) => l.type === 'word')!)
const list = computed(() => words.filter((w) => level.value.words?.includes(w.id)))
const finished = ref(false)

function finish() {
  list.value.forEach((item) => progress.learnWord(item.word))
  if (progress.completeLevel(level.value.id, 3)) {
    reward.addStars(3)
    reward.addCoins(10)
    daily.record('words', list.value.length)
  }
  progress.unlockNextLevel(level.value.id)
  finished.value = true
}

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="page">
    <TopBar :title="level.title" show-back />
    <section class="stage">
      <template v-if="!finished">
        <WordCard v-for="item in list" :key="item.id" :word="item" />
        <button class="finish-btn" @click="finish">我学会了！获得 3 星 + 10 金币</button>
      </template>
      <div v-else class="done-panel">
        <div class="trophy">🏆</div>
        <h2>关卡完成！</h2>
        <p>你学会了 {{ list.length }} 个单词</p>
        <button class="finish-btn" @click="goHome">返回地图</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page { min-height: 100vh; background: #fff8e8; }
.stage { padding: 24px 20px; display: grid; gap: 20px; }
.finish-btn { width: 100%; padding: 16px; border-radius: 18px; background: #68c986; color: #fff; font-size: 17px; font-weight: 700; box-shadow: 0 5px 0 #48ad69; }
.done-panel { display: grid; justify-items: center; gap: 14px; padding: 40px 24px; border-radius: 24px; background: #fff; box-shadow: 0 6px 0 #eee4d2; }
.trophy { font-size: 72px; }
.done-panel h2 { margin: 0; color: #263b54; font-size: 24px; }
.done-panel p { color: #718093; }
</style>
