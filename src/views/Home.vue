<script setup lang="ts">
import TopBar from '@/components/common/TopBar.vue'
import { levels } from '@/data/levels'
import { useProgressStore } from '@/stores/progress'
const progress = useProgressStore()
</script>

<template>
  <div class="home">
    <TopBar />
    <section class="hero">
      <p class="eyebrow">今天的拼读小任务 · 3分钟</p>
      <h1>嗨，{{ progress.learnedLetters.length ? '拼读小达人' : '小小拼读家' }}！<br /><em>今天也来收集声音吧</em></h1>
      <div class="streak"><span>♨</span><div><strong>3 天</strong><small>连续学习</small></div></div>
    </section>
    <section class="level-list">
      <h2>我的拼读地图</h2>
      <RouterLink v-for="level in levels" :key="level.id" :to="`/${level.type === 'letterLearn' ? 'letter' : level.type === 'letterSound' ? 'sound' : level.type}/${level.id}`" class="level-card" :class="{ locked: !level.unlocked }">
        <div class="badge">{{ level.type === 'letterLearn' ? '🔤' : level.type === 'letterSound' ? '🔊' : level.type === 'phonics' ? '🧩' : level.type === 'syllable' ? '👏' : '📖' }}</div>
        <div class="info"><strong>{{ level.chapter }}</strong><span>{{ level.title }}</span></div>
        <div class="stars">{{ (progress.levels[level.id]?.stars ?? 0) }} / {{ level.stars }} ★</div>
      </RouterLink>
    </section>
    <nav class="bottom-nav">
      <RouterLink to="/" class="active">🏠 首页</RouterLink>
      <RouterLink to="/letter">🔤 字母</RouterLink>
      <RouterLink to="/profile">🎁 我的</RouterLink>
    </nav>
  </div>
</template>

<style scoped>
.home { min-height: 100vh; background: #fff8e8; padding-bottom: 80px; }
.hero { padding: 20px 20px 30px; }
.eyebrow { margin: 0 0 8px; color: #ee7662; font-size: 13px; font-weight: 700; }
h1 { margin: 0; color: #263b54; font-size: 28px; line-height: 1.3; }
h1 em { color: #59728b; font-size: .7em; font-style: normal; font-weight: 500; }
.streak { display: inline-flex; align-items: center; gap: 8px; margin-top: 14px; padding: 8px 14px; border-radius: 14px; background: #fffaf0; }
.streak span { color: #ff765e; font-size: 22px; }
.streak strong { display: block; color: #ee765d; font-size: 15px; }
.streak small { color: #8390a0; font-size: 10px; }
.level-list { padding: 0 20px; }
.level-list h2 { margin: 0 0 14px; color: #263b54; font-size: 18px; }
.level-card { display: flex; align-items: center; gap: 14px; padding: 16px; margin-bottom: 12px; border-radius: 18px; background: #fff; box-shadow: 0 5px 0 #eee4d2; text-decoration: none; color: inherit; }
.level-card.locked { opacity: .55; pointer-events: none; }
.badge { display: grid; place-items: center; width: 46px; height: 46px; border-radius: 14px; background: #fff6cd; font-size: 24px; }
.info { flex: 1; display: grid; gap: 3px; }
.info strong { color: #263b54; font-size: 15px; }
.info span { color: #718093; font-size: 12px; }
.stars { color: #f6b62c; font-weight: 700; font-size: 13px; }
.bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; display: flex; justify-content: space-around; padding: 10px 0 calc(10px + env(safe-area-inset-bottom)); background: #fff; box-shadow: 0 -3px 12px rgba(0,0,0,.06); }
.bottom-nav a { color: #8b98a8; text-decoration: none; font-size: 12px; font-weight: 700; }
.bottom-nav a.active { color: #ff6b6b; }
</style>
