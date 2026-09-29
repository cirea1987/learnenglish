<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRewardStore } from '@/stores/reward'
import { useSettingsStore } from '@/stores/settings'
import { playComplete, playCorrect } from '@/utils/sfx'
import Confetti from '@/components/reward/Confetti.vue'

const reward = useRewardStore()
const settings = useSettingsStore()
const showConfetti = ref(false)
const isEating = ref(false)
const feedback = ref('')

const petStages = computed(() => settings.theme === 'cat'
  ? ['🐱', '😺', '😻', '🐈‍⬛', '🐯']
  : ['👸', '🐱', '🦄', '🐉', '👑'])
const petName = computed(() => {
  const names = settings.theme === 'cat'
    ? ['奶糖猫', '星星猫', '月亮猫', '黑曜猫', '猫咪女王']
    : ['小公主', '猫咪侍卫', '独角兽伙伴', '星光飞龙', '皇冠公主']
  return names[Math.min(reward.pet.level - 1, names.length - 1)]
})
const petEmoji = computed(() => {
  return petStages.value[Math.min(reward.pet.level - 1, petStages.value.length - 1)]
})

function feed() {
  const prevLevel = reward.pet.level
  if (!reward.feedPet()) {
    feedback.value = `还差 ${10 - reward.coins} 枚金币，完成一关就能获得金币。`
    return
  }

  isEating.value = true
  feedback.value = '好开心！伙伴获得了 20 点经验。'
  setTimeout(() => { isEating.value = false }, 650)
  if (reward.pet.level > prevLevel) {
    feedback.value = `${petName.value}升级啦！伙伴又长大了一点。`
    showConfetti.value = true
    playComplete()
    setTimeout(() => { showConfetti.value = false }, 2000)
  } else {
    playCorrect()
  }
}
</script>

<template>
  <div class="pet-card">
    <Confetti :show="showConfetti" />
    <div class="scene" :class="settings.theme">
      <span class="scene-glow"></span>
      <span class="spark">✦</span>
      <span class="accessory">{{ settings.theme === 'cat' ? '🎀' : '👑' }}</span>
      <span :class="['pet', { eating: isEating }]">{{ petEmoji }}</span>
      <span class="cheek cheek-left"></span>
      <span class="cheek cheek-right"></span>
      <span class="heart">♥</span>
      <span class="scene-caption">{{ settings.theme === 'cat' ? '软乎乎的猫咪伙伴' : '闪闪发光的小公主' }}</span>
    </div>
    <h3>{{ petName }} · Lv.{{ reward.pet.level }}</h3>
    <div class="bar"><span :style="{ width: Math.min(reward.pet.exp / reward.pet.nextExp * 100, 100) + '%' }"></span></div>
    <small>{{ reward.pet.exp }} / {{ reward.pet.nextExp }} 经验 · 🪙 {{ reward.coins }}</small>
    <button :disabled="reward.coins < 10" @click="feed">
      {{ reward.coins >= 10 ? '🍓 喂一喂 · 10 金币' : `🔒 还差 ${10 - reward.coins} 金币` }}
    </button>
    <p class="feedback" role="status" aria-live="polite">{{ feedback || (reward.coins < 10 ? `再赚 ${10 - reward.coins} 枚金币就能喂伙伴啦` : '伙伴饿了，给它一份小点心吧！') }}</p>
  </div>
</template>

<style scoped>
.pet-card { padding: 16px; border-radius: 18px; background: #fff; box-shadow: 0 4px 0 var(--theme-shadow, #f2c4d2); text-align: center; }
.scene { position: relative; display: grid; place-items: center; height: 150px; overflow: hidden; border-radius: 15px; background: radial-gradient(circle at 50% 46%, #fff 0 35%, transparent 36%), linear-gradient(145deg, #fff4f8, #ffe0ed); }
.scene.princess { background: radial-gradient(circle at 50% 46%, #fff 0 35%, transparent 36%), linear-gradient(145deg, #fff1f7, #ffd8e9); }
.scene-glow { position: absolute; bottom: 16px; width: 118px; height: 24px; border-radius: 50%; background: rgba(234, 143, 177, .22); }
.pet { z-index: 1; font-size: 82px; filter: drop-shadow(0 5px 2px rgba(118, 70, 96, .13)); animation: float 2.5s ease-in-out infinite; }
.pet.eating { animation: munch .65s ease-in-out; }
.accessory { position: absolute; z-index: 2; top: 21px; left: calc(50% + 19px); font-size: 29px; transform: rotate(13deg); }
.scene.princess .accessory { top: 8px; left: calc(50% - 16px); font-size: 32px; transform: rotate(-7deg); }
.spark { position: absolute; top: 21px; left: 21%; color: #f3b84f; font-size: 23px; animation: twinkle 1.5s infinite; }
.scene::after { position: absolute; top: 37px; right: 19%; color: #f09ab7; content: '✦'; font-size: 17px; animation: twinkle 1.2s infinite reverse; }
.cheek { position: absolute; z-index: 2; top: 83px; width: 9px; height: 6px; border-radius: 50%; background: #f39ab3; opacity: .8; }
.cheek-left { left: calc(50% - 25px); }
.cheek-right { right: calc(50% - 25px); }
.scene-caption { position: absolute; bottom: 9px; color: var(--theme-deep, #d94f78); font-size: 10px; font-weight: 800; }
.heart { position: absolute; right: 20%; bottom: 26px; color: var(--theme-primary, #f0648e); animation: twinkle 1.2s infinite reverse; }
.scene.princess .heart { right: 17%; bottom: 28px; }
.pet-card h3 { margin: 11px 0 7px; color: #493447; font-size: 16px; }
.bar { height: 10px; border-radius: 10px; background: #eee; margin: 10px 0; overflow: hidden; }
.bar span { display: block; height: 100%; border-radius: 10px; background: linear-gradient(90deg, #68c986, #4ecdc4); transition: width .3s; }
button { display: block; width: 100%; min-height: 50px; margin-top: 12px; padding: 11px 16px; border: 2px solid rgba(255,255,255,.86); border-radius: 15px; background: linear-gradient(135deg, #ff8fb3, var(--theme-primary, #f0648e)); color: #fff; font-size: 15px; font-weight: 900; box-shadow: 0 5px 0 var(--theme-deep, #d94f78), 0 8px 16px rgba(217,79,120,.16); transition: transform .15s ease, box-shadow .15s ease, filter .15s ease; }
button:not(:disabled):hover { filter: brightness(1.04); transform: translateY(-1px); }
button:not(:disabled):active { box-shadow: 0 2px 0 var(--theme-deep, #d94f78); transform: translateY(3px); }
button:focus-visible { outline: 3px solid #8e5a9e; outline-offset: 3px; }
button:disabled { border-color: #f4edf1; background: #e9e1e6; color: #756b73; box-shadow: 0 4px 0 #d2c8cf; cursor: not-allowed; }
.feedback { min-height: 16px; margin: 10px 0 0; color: #857483; font-size: 11px; }
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
@keyframes twinkle { 0%, 100% { opacity: .4; transform: scale(.9); } 50% { opacity: 1; transform: scale(1.1); } }
@keyframes munch { 0%, 100% { transform: scale(1) rotate(0); } 35% { transform: scale(1.13) rotate(-8deg); } 70% { transform: scale(1.08) rotate(8deg); } }
</style>
