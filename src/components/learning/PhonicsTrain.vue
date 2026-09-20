<script setup lang="ts">
import type { Phonic } from '@/data/phonics'
import { speak } from '@/utils/speak'
const props = defineProps<{ phonic: Phonic }>()

function playLetter(index: number) {
  const l = props.phonic.letters[index]
  speak(`${l.char} says ${l.sound}`)
}
function playWhole() {
  props.phonic.letters.forEach((l, i) => {
    setTimeout(() => speak(`${l.sound}`), i * 600)
  })
  setTimeout(() => speak(props.phonic.word), props.phonic.letters.length * 600 + 300)
}
</script>

<template>
  <div class="train">
    <div class="carriages">
      <button v-for="(l, i) in phonic.letters" :key="i" class="carriage" @click="playLetter(i)">
        <b>{{ l.char }}</b><small>{{ l.sound }}</small>
      </button>
    </div>
    <button class="connect" @click="playWhole">🚂 拼读小火车出发</button>
    <div class="word-result">{{ phonic.word }} · {{ phonic.cn }}</div>
  </div>
</template>

<style scoped>
.train { display: grid; gap: 16px; justify-items: center; }
.carriages { display: flex; gap: 10px; }
.carriage { display: grid; justify-items: center; width: 76px; padding: 14px 8px; border-radius: 14px; background: #fff; box-shadow: 0 5px 0 #e9e9e2; }
.carriage b { font-family: 'Baloo 2', sans-serif; font-size: 36px; color: #ff705d; }
.carriage small { color: #718093; font-size: 12px; }
.connect { padding: 14px 24px; border-radius: 30px; background: #ff6b6b; color: #fff; font-size: 16px; font-weight: 700; box-shadow: 0 5px 0 #e95749; }
.word-result { font-family: 'Baloo 2', sans-serif; font-size: 24px; color: #263b54; }
</style>
