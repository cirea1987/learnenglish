<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ value: number; max: number; color?: string }>()
const pct = computed(() => Math.min(100, Math.max(0, (props.value / props.max) * 100)))
</script>

<template>
  <div class="progress-track">
    <div class="progress-fill" :style="{ width: pct + '%', background: color || '#68c986' }"></div>
  </div>
</template>

<style scoped>
.progress-track { height: 10px; border-radius: 10px; background: #eee; overflow: hidden; }
.progress-fill { height: 100%; border-radius: 10px; transition: width .4s; }
</style>
