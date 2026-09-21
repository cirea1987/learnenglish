<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ show: boolean }>()
const pieces = ref<{ id: number; x: number; color: string; delay: number; duration: number }[]>([])
const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#68c986', '#ff8a65', '#6ac488']

watch(() => props.show, (val) => {
  if (!val) {
    pieces.value = []
    return
  }
  pieces.value = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: colors[Math.floor(Math.random() * colors.length)],
    delay: Math.random() * 0.4,
    duration: 0.8 + Math.random() * 0.7,
  }))
})
</script>

<template>
  <div v-if="show" class="confetti-layer" aria-hidden="true">
    <div
      v-for="p in pieces"
      :key="p.id"
      class="piece"
      :style="{
        left: p.x + '%',
        background: p.color,
        animationDelay: p.delay + 's',
        animationDuration: p.duration + 's',
      }"
    />
  </div>
</template>

<style scoped>
.confetti-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  overflow: hidden;
}
.piece {
  position: absolute;
  top: -12px;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  animation-name: fall;
  animation-timing-function: ease-in;
  animation-fill-mode: forwards;
}
@keyframes fall {
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
}
</style>
