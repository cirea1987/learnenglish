<script setup lang="ts">
import type { Letter } from '@/data/letters'
import { speak } from '@/utils/speak'
const props = defineProps<{ letter: Letter }>()
function playName() {
  speak(`${props.letter.upper}, ${props.letter.example.word}`)
}
function playSound() {
  speak(`${props.letter.upper} says ${props.letter.soundIpa}, ${props.letter.example.word}`)
}
</script>

<template>
  <div class="letter-card" @click="playName">
    <div class="upper">{{ letter.upper }}</div>
    <div class="lower">{{ letter.lower }}</div>
    <div class="example">{{ letter.example.word }}</div>
    <button class="sound-btn" @click.stop="playSound">🔊</button>
  </div>
</template>

<style scoped>
.letter-card { position: relative; display: grid; justify-items: center; gap: 6px; padding: 20px 12px; border-radius: 20px; background: #fff6cd; box-shadow: 0 6px 0 #f0dcb5; cursor: pointer; }
.upper { font-family: 'Baloo 2', sans-serif; font-size: 56px; font-weight: 800; color: #ff705d; line-height: 1; }
.lower { font-size: 20px; color: #718093; }
.example { font-family: 'Baloo 2', sans-serif; color: #536980; font-size: 15px; }
.sound-btn { position: absolute; top: 10px; right: 10px; width: 30px; height: 30px; border-radius: 50%; background: #6ac488; color: #fff; font-size: 14px; }
</style>
