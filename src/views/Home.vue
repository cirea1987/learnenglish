<script setup lang="ts">
import { computed, inject, ref, type ComputedRef } from 'vue'
import TopBar from '@/components/common/TopBar.vue'
import PetAvatar from '@/components/reward/PetAvatar.vue'
import { levels } from '@/data/levels'
import { useProgressStore } from '@/stores/progress'
import { useRewardStore } from '@/stores/reward'
import { useSettingsStore } from '@/stores/settings'

const progress = useProgressStore()
const reward = useRewardStore()
const settings = useSettingsStore()
const welcomeBack = inject<ComputedRef<boolean>>('welcomeBack', computed(() => false))
const mapExpanded = ref(false)

const nextLevel = computed(() => {
  const current = levels.find((level) => level.id === progress.currentLevel)
  if (current && progress.isLevelUnlocked(current.id) && !progress.levels[current.id]?.completed) return current
  return levels.find((level) => progress.isLevelUnlocked(level.id) && !progress.levels[level.id]?.completed)
    ?? levels.find((level) => progress.isLevelUnlocked(level.id))
    ?? levels[0]
})

const nextRoute = computed(() => {
  const routes: Record<string, string> = {
    letterLearn: 'letter',
    letterSound: 'sound',
    phonics: 'phonics',
    syllable: 'syllable',
    word: 'word',
  }
  return `/${routes[nextLevel.value.type]}/${nextLevel.value.id}`
})

const themeName = computed(() => settings.theme === 'cat' ? '猫咪' : '公主')
</script>

<template>
  <div class="home">
    <TopBar />
    <main class="dashboard">
      <section class="welcome-row">
        <div>
          <p class="eyebrow">{{ welcomeBack ? '好久不见，欢迎回来' : '欢迎来到声音小冒险' }}</p>
          <h1>{{ progress.learnedLetters.length ? '拼读小达人' : '今天想玩什么？' }}</h1>
          <p class="subtitle">{{ welcomeBack ? '你的伙伴一直在等你，一起玩一关吧！' : '和你的伙伴一起，发现英语声音的秘密。' }}</p>
        </div>
        <div class="streak" aria-label="连续学习天数">
          <span>✨</span><strong>{{ progress.streakDays }}<small>天</small></strong>
        </div>
      </section>

      <section class="theme-picker" aria-label="选择喜欢的主题">
        <span>今天的世界</span>
        <div class="theme-options">
          <button :class="{ selected: settings.theme === 'cat' }" :aria-pressed="settings.theme === 'cat'" @click="settings.setTheme('cat')">🐱 猫咪</button>
          <button :class="{ selected: settings.theme === 'princess' }" :aria-pressed="settings.theme === 'princess'" @click="settings.setTheme('princess')">👑 公主</button>
        </div>
      </section>

      <section class="adventure">
        <div class="adventure-copy">
          <span class="mission-label">TODAY'S MINI QUEST · 3 MIN</span>
          <h2>{{ settings.theme === 'cat' ? '陪小猫' : '和小公主' }}完成<br />{{ nextLevel.title }}</h2>
          <p>做完这一小关，就能获得星星和伙伴经验！</p>
          <RouterLink :to="nextRoute" class="start-button"><span>开始冒险</span><b aria-hidden="true">→</b></RouterLink>
        </div>
        <div class="partner-scene" :class="settings.theme">
          <span class="scene-spark spark-one">✦</span>
          <span class="scene-spark spark-two">✧</span>
          <span class="scene-partner">{{ settings.theme === 'cat' ? '🐱' : '👸' }}</span>
          <span class="scene-ground"></span>
          <span class="scene-caption">{{ themeName }}伙伴</span>
        </div>
        <div class="quest-foot"><span>⭐ {{ reward.stars }} 颗星星</span><span>🪙 {{ reward.coins }} 枚金币</span></div>
      </section>

      <section class="buddy-section">
        <div class="section-heading">
          <div><p class="eyebrow">一起成长</p><h2>你的专属伙伴</h2></div>
          <RouterLink to="/profile" aria-label="查看伙伴和收藏">看看我的 →</RouterLink>
        </div>
        <PetAvatar />
      </section>

      <section class="map-section">
        <button class="map-toggle" :aria-expanded="mapExpanded" @click="mapExpanded = !mapExpanded">
          <span><small>MY LEARNING WORLD</small><strong>学习地图</strong></span>
          <span class="map-progress">{{ Object.values(progress.levels).filter((item) => item.completed).length }} / {{ levels.length }} 关 <b>{{ mapExpanded ? '收起 −' : '打开 +' }}</b></span>
        </button>
        <div v-if="mapExpanded" class="level-list">
          <component
            :is="progress.isLevelUnlocked(level.id) ? 'RouterLink' : 'div'"
            v-for="level in levels"
            :key="level.id"
            :to="progress.isLevelUnlocked(level.id) ? `/${level.type === 'letterLearn' ? 'letter' : level.type === 'letterSound' ? 'sound' : level.type}/${level.id}` : undefined"
            class="level-card"
            :class="{ locked: !progress.isLevelUnlocked(level.id), completed: progress.levels[level.id]?.completed }"
          >
            <div class="badge">{{ level.type === 'letterLearn' ? '🔤' : level.type === 'letterSound' ? '🔊' : level.type === 'phonics' ? '🧩' : level.type === 'syllable' ? '👏' : '📖' }}</div>
            <div class="info"><strong>{{ level.chapter }}</strong><span>{{ level.title }}</span></div>
            <div class="stars">{{ progress.levels[level.id]?.completed ? '✓ 完成' : progress.isLevelUnlocked(level.id) ? '去挑战 →' : '🔒' }}</div>
          </component>
        </div>
      </section>

      <RouterLink to="/review" class="review-link">🔁 去复习学过的内容</RouterLink>
    </main>
    <nav class="bottom-nav">
      <RouterLink to="/" class="active"><span>🏠</span>首页</RouterLink>
      <RouterLink to="/letter"><span>🔤</span>字母</RouterLink>
      <RouterLink to="/profile"><span>🎁</span>我的</RouterLink>
    </nav>
  </div>
</template>

<style scoped>
.home { min-height: 100vh; padding-bottom: 90px; color: #413344; }
.dashboard { width: min(100% - 32px, 760px); margin: 0 auto; }
.welcome-row { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 15px 4px 20px; }
.eyebrow { margin: 0 0 5px; color: var(--theme-deep); font-size: 12px; font-weight: 800; }
h1, h2, p { margin-top: 0; }
h1 { margin-bottom: 5px; font-size: 25px; line-height: 1.25; }
.subtitle { margin: 0; color: #837483; font-size: 13px; }
.streak { display: grid; justify-items: center; gap: 1px; flex: 0 0 58px; padding: 10px 4px; border-radius: 18px; background: #fff; box-shadow: 0 3px 0 var(--theme-shadow); color: var(--theme-deep); }
.streak span { font-size: 20px; }
.streak strong { font-size: 15px; }
.streak small { margin-left: 2px; font-size: 10px; }
.theme-picker { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 14px; padding: 9px 12px; border-radius: 14px; background: rgba(255,255,255,.72); color: #766979; font-size: 12px; }
.theme-options { display: flex; gap: 6px; }
.theme-options button { padding: 7px 11px; border: 1px solid transparent; border-radius: 11px; background: transparent; color: #736879; font-size: 12px; font-weight: 700; }
.theme-options button.selected { border-color: var(--theme-shadow); background: var(--theme-soft); color: var(--theme-deep); }
.adventure { position: relative; display: grid; grid-template-columns: minmax(0, 1fr) 132px; overflow: hidden; min-height: 236px; padding: 20px 18px 0; border-radius: 20px; background: linear-gradient(130deg, #fff 0%, #fff 55%, var(--theme-soft) 100%); box-shadow: 0 5px 0 var(--theme-shadow); }
.adventure-copy { z-index: 1; padding-bottom: 44px; }
.mission-label { color: var(--theme-deep); font-size: 9px; font-weight: 900; letter-spacing: 0; }
.adventure h2 { margin: 8px 0 6px; color: #493447; font-size: 21px; line-height: 1.3; }
.adventure-copy p { max-width: 290px; margin-bottom: 14px; color: #827482; font-size: 12px; line-height: 1.5; }
.start-button { display: inline-flex; align-items: center; gap: 13px; min-height: 42px; padding: 0 15px; border-radius: 13px; background: var(--theme-primary); box-shadow: 0 4px 0 var(--theme-deep); color: #fff; text-decoration: none; font-size: 14px; font-weight: 800; }
.start-button b { font-size: 19px; line-height: 1; }
.partner-scene { position: relative; align-self: stretch; display: grid; place-items: center; min-width: 0; }
.scene-partner { z-index: 1; margin-top: -12px; font-size: 78px; filter: drop-shadow(0 6px 2px rgba(110,65,90,.12)); animation: bob 2.8s ease-in-out infinite; }
.scene-ground { position: absolute; right: -14px; bottom: 31px; left: -4px; height: 44px; border-radius: 50% 50% 0 0; background: rgba(255,255,255,.76); }
.scene-spark { position: absolute; z-index: 1; color: #e8ac4c; }
.spark-one { top: 31px; left: 14px; font-size: 22px; }
.spark-two { top: 60px; right: 8px; font-size: 17px; }
.scene-caption { position: absolute; z-index: 2; bottom: 37px; padding: 4px 9px; border-radius: 99px; background: white; color: var(--theme-deep); font-size: 10px; font-weight: 800; }
.quest-foot { position: absolute; right: 0; bottom: 0; left: 0; display: flex; gap: 20px; padding: 11px 16px; border-top: 1px solid rgba(230,190,208,.35); background: rgba(255,255,255,.7); color: #796b79; font-size: 11px; font-weight: 700; }
.buddy-section, .map-section { margin-top: 27px; }
.section-heading { display: flex; justify-content: space-between; align-items: end; margin-bottom: 11px; }
.section-heading h2 { margin: 0; color: #493447; font-size: 18px; }
.section-heading a { color: var(--theme-deep); text-decoration: none; font-size: 12px; font-weight: 700; }
.buddy-section :deep(.pet-card) { border-radius: 16px; box-shadow: 0 3px 0 var(--theme-shadow); }
.map-toggle { display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 15px; border-radius: 16px; background: white; box-shadow: 0 3px 0 var(--theme-shadow); text-align: left; }
.map-toggle > span:first-child { display: grid; gap: 2px; }
.map-toggle small { color: var(--theme-deep); font-size: 9px; font-weight: 900; }
.map-toggle strong { color: #493447; font-size: 17px; }
.map-progress { color: #857788; font-size: 11px; }
.map-progress b { display: block; margin-top: 4px; color: var(--theme-deep); text-align: right; }
.level-list { display: grid; gap: 9px; padding-top: 12px; }
.level-card { display: flex; align-items: center; gap: 11px; padding: 11px; border-radius: 14px; background: #fff; color: inherit; text-decoration: none; box-shadow: 0 2px 0 rgba(224,194,207,.65); }
.level-card.locked { opacity: .58; }
.level-card.completed { background: #fff9e9; }
.badge { display: grid; place-items: center; flex: 0 0 42px; width: 42px; height: 42px; border-radius: 12px; background: var(--theme-soft); font-size: 22px; }
.info { display: grid; flex: 1; gap: 2px; min-width: 0; }
.info strong { color: #493447; font-size: 13px; }
.info span { overflow: hidden; color: #827482; font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
.stars { color: var(--theme-deep); font-size: 11px; font-weight: 800; }
.review-link { display: block; margin: 17px 0; padding: 13px; border-radius: 14px; background: #e8f6f0; color: #397b66; text-align: center; text-decoration: none; font-size: 13px; font-weight: 700; }
.bottom-nav { position: fixed; z-index: 5; right: 0; bottom: 0; left: 0; display: flex; justify-content: space-around; padding: 8px 0 calc(8px + env(safe-area-inset-bottom)); border-top: 1px solid #f2e4e9; background: rgba(255,255,255,.96); }
.bottom-nav a { display: grid; justify-items: center; gap: 1px; min-width: 64px; color: #958995; text-decoration: none; font-size: 10px; font-weight: 700; }
.bottom-nav a span { font-size: 19px; }
.bottom-nav a.active { color: var(--theme-deep); }
@keyframes bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
@media (min-width: 640px) {
  .dashboard { width: min(100% - 48px, 760px); }
  .welcome-row { padding-top: 22px; }
  .adventure { grid-template-columns: minmax(0, 1fr) 190px; min-height: 260px; padding: 26px 26px 0; }
  .scene-partner { font-size: 104px; }
}
@media (prefers-reduced-motion: reduce) {
  .scene-partner { animation: none; }
}
</style>
