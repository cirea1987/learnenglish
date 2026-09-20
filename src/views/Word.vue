<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TopBar from '@/components/common/TopBar.vue'
import WordCard from '@/components/learning/WordCard.vue'
import { words } from '@/data/words'
import { levels } from '@/data/levels'

const route = useRoute()
const level = computed(() => levels.find((l) => l.id === route.params.id) || levels.find((l) => l.type === 'word')!)
const list = computed(() => words.filter((w) => level.value.words?.includes(w.id)))
</script>

<template>
  <div class="page">
    <TopBar :title="level.title" show-back />
    <section class="stage">
      <WordCard v-for="item in list" :key="item.id" :word="item" />
    </section>
  </div>
</template>

<style scoped>
.page { min-height: 100vh; background: #fff8e8; }
.stage { padding: 24px 20px; display: grid; gap: 20px; }
</style>
