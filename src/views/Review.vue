<script setup lang="ts">
import { computed } from 'vue'
import { useProgressStore } from '@/stores/progress'
import { letters } from '@/data/letters'
import { words } from '@/data/words'
import TopBar from '@/components/common/TopBar.vue'
import { speak } from '@/utils/speak'

const progress = useProgressStore()
const learnedLetters = computed(() => letters.filter((letter) => progress.learnedLetters.includes(letter.upper)))
const learnedWords = computed(() => words.filter((word) => progress.learnedWords.includes(word.word)))

function reviewLetter(letter: (typeof letters)[number]) {
  speak(`${letter.upper}, ${letter.example.word}`)
}

function reviewWord(word: (typeof words)[number]) {
  speak(`${word.word}. ${word.sentence}`)
}
</script>

<template>
  <div class="page">
    <TopBar title="复习" show-back />
    <section class="intro">
      <h1>再听一遍，记得更牢</h1>
      <p>复习不会消耗星星，也不会重复领取奖励。</p>
    </section>

    <section class="review-section">
      <h2>已学字母 · {{ learnedLetters.length }}</h2>
      <div v-if="learnedLetters.length" class="letter-grid">
        <button v-for="letter in learnedLetters" :key="letter.id" class="letter-card" @click="reviewLetter(letter)">
          <strong>{{ letter.upper }}</strong>
          <span>{{ letter.lower }}</span>
          <small>{{ letter.example.word }}</small>
        </button>
      </div>
      <p v-else class="empty">完成字母关卡后，就可以在这里复习。</p>
    </section>

    <section class="review-section">
      <h2>已学单词 · {{ learnedWords.length }}</h2>
      <div v-if="learnedWords.length" class="word-list">
        <button v-for="word in learnedWords" :key="word.id" class="word-card" @click="reviewWord(word)">
          <strong>{{ word.word }}</strong>
          <span>{{ word.cn }}</span>
          <small>{{ word.sentence }}</small>
        </button>
      </div>
      <p v-else class="empty">完成单词或音节关卡后，就可以在这里复习。</p>
    </section>
  </div>
</template>

<style scoped>
.page { min-height: 100vh; padding-bottom: 30px; background: #fff8e8; }
.intro { padding: 22px 20px 8px; }
.intro h1 { margin: 0 0 6px; color: #263b54; font-size: 24px; }
.intro p { margin: 0; color: #718093; font-size: 14px; }
.review-section { padding: 18px 20px 0; }
.review-section h2 { margin: 0 0 12px; color: #263b54; font-size: 17px; }
.letter-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.letter-card, .word-card { border-radius: 16px; background: #fff; box-shadow: 0 4px 0 #eee4d2; }
.letter-card { display: grid; justify-items: center; gap: 2px; padding: 12px 6px; }
.letter-card strong { color: #ff705d; font-size: 30px; }
.letter-card span { color: #718093; }
.letter-card small { color: #9aa4ae; font-size: 11px; }
.word-list { display: grid; gap: 10px; }
.word-card { display: grid; grid-template-columns: 1fr auto; gap: 4px 12px; padding: 14px; text-align: left; }
.word-card strong { color: #263b54; font-size: 22px; }
.word-card span { align-self: center; color: #ff705d; font-weight: 700; }
.word-card small { grid-column: 1 / -1; color: #718093; }
.empty { margin: 0; padding: 18px; border-radius: 14px; background: #fff; color: #8b98a8; text-align: center; }
button { border: 0; font: inherit; cursor: pointer; }
</style>