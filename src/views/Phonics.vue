<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TopBar from '@/components/common/TopBar.vue'
import PhonicsTrain from '@/components/learning/PhonicsTrain.vue'
import { phonics } from '@/data/phonics'
import { levels } from '@/data/levels'

const route = useRoute()
const level = computed(() => levels.find((l) => l.id === route.params.id) || levels.find((l) => l.type === 'phonics')!)
const list = computed(() => phonics.filter((p) => level.value.phonics?.includes(p.id)))
</script>

<template>
  <div class="page">
    <TopBar :title="level.title" show-back />
    <section class="stage">
      <PhonicsTrain v-for="item in list" :key="item.id" :phonic="item" />
    </section>
  </div>
</template>

<style scoped>
.page { min-height: 100vh; background: #fff8e8; }
.stage { padding: 24px 20px; display: grid; gap: 24px; }
</style>
