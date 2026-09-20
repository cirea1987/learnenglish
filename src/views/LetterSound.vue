<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TopBar from '@/components/common/TopBar.vue'
import ListenPickGame from '@/components/learning/ListenPickGame.vue'
import { levels } from '@/data/levels'
import { letters } from '@/data/letters'
import { shuffle } from '@/utils/shuffle'
import { useProgressStore } from '@/stores/progress'

const route = useRoute()
const router = useRouter()
const progress = useProgressStore()
const level = computed(() => levels.find((l) => l.id === route.params.id) || levels.find((l) => l.type === 'letterSound')!)
const targets = computed(() => letters.filter((l) => level.value.letters?.includes(l.upper)))
const index = ref(0)
const correctCount = ref(0)

const current = computed(() => targets.value[index.value])
const options = computed(() => {
  const pool = letters.map((l) => l.upper).filter((l) => l !== current.value.upper)
  return shuffle([current.value.upper, ...shuffle(pool).slice(0, 2)])
})

function next() {
  correctCount.value++
  if (index.value < targets.value.length - 1) {
    index.value++
  } else {
    progress.completeLevel(level.value.id, Math.min(3, correctCount.value))
    router.push('/')
  }
}
</script>

<template>
  <div class="page">
    <TopBar :title="level.title" show-back />
    <section class="stage">
      <p class="count">第 {{ index + 1 }} / {{ targets.length }} 题</p>
      <ListenPickGame v-if="current" :target="current.upper" :options="options" @correct="next" />
    </section>
  </div>
</template>

<style scoped>
.page { min-height: 100vh; background: #fff8e8; }
.stage { padding: 30px 20px; }
.count { text-align: center; color: #8b98a8; font-size: 13px; margin-bottom: 18px; }
</style>
