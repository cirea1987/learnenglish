<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TopBar from '@/components/common/TopBar.vue'
import SyllableSplit from '@/components/learning/SyllableSplit.vue'
import { syllables } from '@/data/syllables'
import { levels } from '@/data/levels'

const route = useRoute()
const level = computed(() => levels.find((l) => l.id === route.params.id) || levels.find((l) => l.type === 'syllable')!)
const list = computed(() => syllables.filter((s) => level.value.words?.includes(s.word)))
</script>

<template>
  <div class="page">
    <TopBar :title="level.title" show-back />
    <section class="stage">
      <SyllableSplit v-for="item in list" :key="item.word" :syllable="item" />
    </section>
  </div>
</template>

<style scoped>
.page { min-height: 100vh; background: #fff8e8; }
.stage { padding: 24px 20px; display: grid; gap: 24px; }
</style>
