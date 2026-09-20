<script setup lang="ts">
import { ref, computed } from 'vue'
import { speak } from '@/utils/speak'
import { shuffle } from '@/utils/shuffle'
import { useRewardStore } from '@/stores/reward'

const props = defineProps<{ target: string; options: string[] }>()
const emit = defineEmits<{ (e: 'correct'): void; (e: 'wrong'): void }>()
const reward = useRewardStore()

const shuffled = computed(() => shuffle(props.options))
const chosen = ref('')
const feedback = ref('')

function pick(option: string) {
  if (chosen.value) return
  chosen.value = option
  if (option === props.target) {
    feedback.value = '答对啦！+3 星星'
    reward.addStars(3)
    speak('Great job!')
    emit('correct')
  } else {
    feedback.value = '再听一次，慢慢找'
    speak('Try again!')
    emit('wrong')
    setTimeout(() => { chosen.value = ''; feedback.value = '' }, 700)
  }
}
</script>

<template>
  <div class="listen-game">
    <button class="big-play" @click="speak(target + ', ' + target.toLowerCase())">🔊 再听一遍</button>
    <div class="options">
      <button v-for="opt in shuffled" :key="opt" class="option" :class="{ correct: chosen === opt && opt === target, wrong: chosen === opt && opt !== target }" @click="pick(opt)">{{ opt }}</button>
    </div>
    <p v-if="feedback" class="feedback">{{ feedback }}</p>
  </div>
</template>

<style scoped>
.listen-game { display: grid; gap: 18px; justify-items: center; }
.big-play { padding: 14px 28px; border-radius: 30px; background: #6ac488; color: #fff; font-size: 18px; font-weight: 700; box-shadow: 0 5px 0 #48ad69; }
.options { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; width: 100%; }
.option { min-height: 72px; border-radius: 16px; border: 2px solid #e7e8e3; background: #fff; font-family: 'Baloo 2', sans-serif; font-size: 32px; font-weight: 700; color: #50657b; box-shadow: 0 4px 0 #dfe1dc; }
.option.correct { background: #68c986; color: #fff; border-color: #68c986; }
.option.wrong { animation: shake .35s; border-color: #ffb7a3; }
.feedback { color: #69b978; font-weight: 700; }
@keyframes shake { 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
</style>
