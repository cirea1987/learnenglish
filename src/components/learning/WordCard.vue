<script setup lang="ts">
import type { Word } from '@/data/words'
import AudioButton from './AudioButton.vue'
import { recognize } from '@/utils/recognize'
import { useRewardStore } from '@/stores/reward'
import { useDailyStore } from '@/stores/daily'
import { ref } from 'vue'
const props = defineProps<{ word: Word }>()
const reward = useRewardStore()
const daily = useDailyStore()
const result = ref('')
const listening = ref(false)

function listen() {
  listening.value = true
  result.value = ''
  const started = recognize(props.word.word, (score, said) => {
    listening.value = false
    result.value = score >= 2 ? '太棒了，跟读成功！' : `我听到的是 "${said}"，再试一次`
    if (score >= 2) {
      reward.addStars(1)
      daily.record('readAloud')
    }
  })
  if (!started) {
    listening.value = false
    result.value = '当前浏览器不支持语音识别，请点击听音后自评。'
  }
}
</script>

<template>
  <div class="word-card">
    <div class="image">{{ word.word }}</div>
    <div class="word">{{ word.word }}</div>
    <div class="cn">{{ word.cn }}</div>
    <AudioButton :text="word.sentence" :label="'听句子'" />
    <button class="speak-btn" :disabled="listening" @click="listen">{{ listening ? '听你说…' : '跟读' }}</button>
    <p v-if="result" class="result">{{ result }}</p>
  </div>
</template>

<style scoped>
.word-card { display: grid; justify-items: center; gap: 10px; padding: 20px; border-radius: 20px; background: #fff; box-shadow: 0 6px 0 #eee4d2; }
.image { display: grid; place-items: center; width: 120px; height: 120px; border-radius: 20px; background: #fff8e8; font-family: 'Baloo 2', sans-serif; font-size: 28px; color: #ff705d; }
.word { font-family: 'Baloo 2', sans-serif; font-size: 36px; font-weight: 800; color: #263b54; }
.cn { color: #718093; }
.speak-btn { padding: 12px 24px; border-radius: 30px; background: #ffe66d; color: #8a6d00; font-weight: 700; box-shadow: 0 4px 0 #e5cf5a; }
.result { color: #69b978; font-weight: 700; }
</style>
