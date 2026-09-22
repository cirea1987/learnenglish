<script setup lang="ts">
import type { Letter } from '@/data/letters'
import { playAudio } from '@/utils/audio'
const props = defineProps<{ letter: Letter }>()
const emojiMap: Record<string, string> = {
  apple: '🍎', bee: '🐝', cat: '🐱', dog: '🐶', egg: '🥚',
  fish: '🐟', goat: '🐐', hat: '🎩', ice: '🧊', jam: '🍓',
  kite: '🪁', lion: '🦁', moon: '🌙', nest: '🪹', octopus: '🐙',
  pig: '🐷', queen: '👸', rain: '🌧️', sun: '☀️', tiger: '🐯',
  umbrella: '☂️', van: '🚐', whale: '🐋', fox: '🦊', 'yo-yo': '🪀', zebra: '🦓'
}
const emoji = emojiMap[props.letter.example.word] || props.letter.example.word[0]?.toUpperCase()
function playName() {
  playAudio(props.letter.nameAudio, 0.8, props.letter.upper)
}
function playSound() {
  playAudio(props.letter.soundAudio, 0.8, `${props.letter.upper} says ${props.letter.soundIpa}`)
}
</script>

<template>
  <div class="letter-card" @click="playName">
    <div class="upper">{{ letter.upper }}</div>
    <div class="lower">{{ letter.lower }}</div>
    <div class="example-img">
      <span class="emoji">{{ emoji }}</span>
    </div>
    <div class="example">{{ letter.example.word }}</div>
    <button class="sound-btn" @click.stop="playSound">🔊</button>
  </div>
</template>

<style scoped>
.letter-card { position: relative; display: grid; justify-items: center; gap: 6px; padding: 20px 12px; border-radius: 20px; background: #fff6cd; box-shadow: 0 6px 0 #f0dcb5; cursor: pointer; }
.upper { font-family: 'Baloo 2', sans-serif; font-size: 56px; font-weight: 800; color: #ff705d; line-height: 1; }
.lower { font-size: 20px; color: #718093; }
.example-img { display: grid; place-items: center; width: 80px; height: 80px; border-radius: 16px; background: #fff; overflow: hidden; }
.example-img img { width: 100%; height: 100%; object-fit: cover; }
.example-img .emoji { font-size: 36px; }
.example { font-family: 'Baloo 2', sans-serif; color: #536980; font-size: 15px; }
.sound-btn { position: absolute; top: 10px; right: 10px; width: 30px; height: 30px; border-radius: 50%; background: #6ac488; color: #fff; font-size: 14px; }
</style>
