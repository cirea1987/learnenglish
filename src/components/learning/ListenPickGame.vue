<script setup lang="ts">
import { ref, computed } from 'vue'
import { speak } from '@/utils/speak'
import { shuffle } from '@/utils/shuffle'
import { useRewardStore } from '@/stores/reward'
import { playCorrect, playWrong } from '@/utils/sfx'
import Confetti from '@/components/reward/Confetti.vue'

const props = defineProps<{ target: string; options: string[] }>()
const emit = defineEmits<{ (e: 'correct'): void; (e: 'wrong'): void }>()
const reward = useRewardStore()

const shuffled = computed(() => shuffle(props.options))
const chosen = ref('')
const feedback = ref('')
const showConfetti = ref(false)
const praiseList = ['Great job!', 'Well done!', 'Awesome!', 'You got it!', 'Perfect!']

function playPrompt() {
  speak(`${props.target} says ${props.target.toLowerCase()}`)
}

function pick(option: string) {
  if (chosen.value) return
  chosen.value = option
  if (option === props.target) {
    const praise = praiseList[Math.floor(Math.random() * praiseList.length)]
    feedback.value = '答对啦！'
    playCorrect()
    showConfetti.value = true
    speak(praise)
    emit('correct')
    setTimeout(() => { showConfetti.value = false }, 1500)
  } else {
    feedback.value = '再听一次，慢慢找'
    playWrong()
    speak('Try again!')
    emit('wrong')
    setTimeout(() => { chosen.value = ''; feedback.value = '' }, 900)
  }
}
</script>

<template>
  <div class="listen-game">
    <Confetti :show="showConfetti" />
    <button class="big-play" @click="playPrompt">🔊 再听一遍</button>
    <div class="options">
      <button v-for="opt in shuffled" :key="opt" class="option" :class="{ correct: chosen === opt && opt === target, wrong: chosen === opt && opt !== target }" @click="pick(opt)">{{ opt }}</button>
    </div>
    <p v-if="feedback" class="feedback" :class="{ wrong: chosen && chosen !== target }">{{ feedback }}</p>
  </div>
</template>

<style scoped>
.listen-game { display: grid; gap: 18px; justify-items: center; }
.big-play { padding: 14px 28px; border-radius: 30px; background: #6ac488; color: #fff; font-size: 18px; font-weight: 700; box-shadow: 0 5px 0 #48ad69; }
.options { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; width: 100%; }
.option { min-height: 72px; border-radius: 16px; border: 2px solid #e7e8e3; background: #fff; font-family: 'Baloo 2', sans-serif; font-size: 32px; font-weight: 700; color: #50657b; box-shadow: 0 4px 0 #dfe1dc; }
.option.correct { background: #68c986; color: #fff; border-color: #68c986; }
.option.wrong { animation: shake .35s; border-color: #ffb7a3; }
.feedback { color: #69b978; font-weight: 700; font-size: 18px; }
.feedback.wrong { color: #ff8a65; }
@keyframes shake { 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
</style>
