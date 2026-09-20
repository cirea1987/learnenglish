<script setup lang="ts">
import type { Syllable } from '@/data/syllables'
import { speak } from '@/utils/speak'
const props = defineProps<{ syllable: Syllable }>()
function playPart(part: { text: string }) { speak(part.text) }
function playWhole() { speak(props.syllable.word) }
</script>

<template>
  <div class="syllable">
    <div class="parts">
      <button v-for="(part, i) in syllable.parts" :key="i" class="part" @click="playPart(part)">
        {{ part.text }}
      </button>
    </div>
    <button class="whole" @click="playWhole">👏 一起拼</button>
    <div class="info">{{ syllable.word }} · {{ syllable.cn }} · {{ syllable.count }} 个音节</div>
  </div>
</template>

<style scoped>
.syllable { display: grid; gap: 16px; justify-items: center; }
.parts { display: flex; gap: 10px; }
.part { padding: 14px 22px; border-radius: 14px; background: #e0f5e8; color: #2f7a5e; font-family: 'Baloo 2', sans-serif; font-size: 26px; font-weight: 700; box-shadow: 0 4px 0 #c3e5d4; }
.whole { padding: 12px 24px; border-radius: 30px; background: #4ecdc4; color: #fff; font-size: 16px; font-weight: 700; box-shadow: 0 5px 0 #3bb3ab; }
.info { font-size: 15px; color: #596b81; }
</style>
