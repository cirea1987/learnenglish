<script setup lang="ts">
import type { LetterSound } from '@/data/letterSounds'
import { speak } from '@/utils/speak'
const props = defineProps<{ data: LetterSound }>()
const emojiMap: Record<string, string> = {
  apple: '🍎', ant: '🐜', ax: '🪓', bee: '🐝', bird: '🐦', ball: '⚽',
  cat: '🐱', car: '🚗', cow: '🐮', dog: '🐶', duck: '🦆', doll: '🪆',
  egg: '🥚', elephant: '🐘', elf: '🧝', fish: '🐟', fan: '🪭', frog: '🐸',
  goat: '🐐', gift: '🎁', gum: '🍬', hat: '🎩', hen: '🐔', hill: '⛰️',
  ice: '🧊', igloo: '🧊', ink: '🖋️', jam: '🍓', jet: '✈️', jug: '🍶',
  kite: '🪁', king: '👑', key: '🔑', lion: '🦁', lamp: '🛋️', leaf: '🍃',
  moon: '🌙', mouse: '🐭', map: '🗺️', nest: '🪹', net: '🕸️', nose: '👃',
  octopus: '🐙', owl: '🦉', orange: '🍊', pig: '🐷', pen: '🖊️', panda: '🐼',
  queen: '👸', quilt: '🛏️', question: '❓', rain: '🌧️', rat: '🐀', ring: '💍',
  sun: '☀️', snake: '🐍', sock: '🧦', tiger: '🐯', tent: '⛺', toy: '🧸',
  umbrella: '☂️', uncle: '👨', up: '⬆️', van: '🚐', vest: '🦺', violin: '🎻',
  whale: '🐋', worm: '🐛', watch: '⌚', fox: '🦊', box: '📦', xylophone: '🎹',
  'yo-yo': '🪀', yak: '🦬', yarn: '🧶', zebra: '🦓', zip: '🤐', zoo: '🦁'
}
const emoji = emojiMap[props.data.examples[0]] || props.data.letter
function playSentence() {
  speak(props.data.sentence)
}
function playSound() {
  speak(props.data.sound)
}
</script>

<template>
  <div class="sound-card" @click="playSentence">
    <div class="letter">{{ props.data.letter }}</div>
    <button class="sound-btn" @click.stop="playSound">🔊 字母音</button>
    <p class="sentence">{{ props.data.sentence }}</p>
    <div class="example">
      <span class="emoji">{{ emoji }}</span>
      <span class="word">{{ props.data.examples[0] }}</span>
    </div>
  </div>
</template>

<style scoped>
.sound-card { display: grid; justify-items: center; gap: 14px; padding: 28px 24px; border-radius: 24px; background: #fff; box-shadow: 0 6px 0 #eee4d2; cursor: pointer; }
.letter { font-family: 'Baloo 2', sans-serif; font-size: 80px; font-weight: 800; color: #ff705d; line-height: 1; }
.sound-btn { padding: 10px 20px; border-radius: 30px; background: #4ecdc4; color: #fff; font-weight: 700; box-shadow: 0 4px 0 #3bb3ab; }
.sentence { font-family: 'Baloo 2', sans-serif; font-size: 22px; color: #263b54; text-align: center; }
.example { display: flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 16px; background: #fff8e8; }
.example .emoji { font-size: 32px; }
.example .word { font-family: 'Baloo 2', sans-serif; font-size: 20px; color: #536980; }
</style>
