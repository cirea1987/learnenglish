<script setup lang="ts">
import { speak } from '@/utils/speak'
const props = defineProps<{ text: string; label?: string }>()
function play() { speak(props.text) }
</script>

<template>
  <button class="audio-button" @click="play">
    <span class="wave">🔊</span>
    <span class="label">{{ label || text }}</span>
  </button>
</template>

<style scoped>
.audio-button { display: inline-flex; align-items: center; gap: 8px; padding: 10px 16px; border-radius: 30px; background: #4ecdc4; color: #fff; font-weight: 700; box-shadow: 0 4px 0 #3bb3ab; }
.wave { font-size: 18px; }
</style>
