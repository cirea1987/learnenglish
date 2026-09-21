<script setup lang="ts">
import { computed } from 'vue'
import TopBar from '@/components/common/TopBar.vue'
import PetAvatar from '@/components/reward/PetAvatar.vue'
import { useRewardStore } from '@/stores/reward'
import { useProgressStore } from '@/stores/progress'
import { useUserStore } from '@/stores/user'
import { storage } from '@/utils/storage'
import { levels } from '@/data/levels'

const reward = useRewardStore()
const progress = useProgressStore()
const user = useUserStore()

const badgeList = computed(() => [
  { id: 'first', icon: '🌱', name: '第一次尝试', earned: reward.stars > 0 },
  { id: 'sound', icon: '🔊', name: '听音小达人', earned: progress.learnedLetters.length >= 5 },
  { id: 'star', icon: '🌟', name: '星星收藏家', earned: reward.stars >= 20 },
  { id: 'letter', icon: '🔤', name: '字母大王', earned: progress.learnedLetters.length >= 26 },
  { id: 'phonics', icon: '🧩', name: '拼读小能手', earned: levels.some(l => l.type === 'phonics' && progress.levels[l.id]?.completed) },
  { id: 'champion', icon: '🏆', name: '拼读冠军', earned: Object.keys(progress.levels).length >= 5 },
])

function resetAll() {
  if (!confirm('确定要清空所有学习进度吗？重新开始哦～')) return
  storage.clear()
  localStorage.removeItem('eng_version')
  location.reload()
}
</script>

<template>
  <div class="page">
    <TopBar title="我的" show-back />
    <section class="profile-head">
      <div class="avatar">🐻</div>
      <div>
        <strong>{{ user.nickname }}</strong>
        <small>已经认识 {{ progress.learnedLetters.length }} 个字母，学会 {{ progress.learnedWords.length }} 个单词</small>
      </div>
    </section>
    <section class="stats">
      <div class="stat"><span>★</span><strong>{{ reward.stars }}</strong><small>星星</small></div>
      <div class="stat"><span>🪙</span><strong>{{ reward.coins }}</strong><small>金币</small></div>
      <div class="stat"><span>🏅</span><strong>{{ badgeList.filter(b => b.earned).length }}</strong><small>勋章</small></div>
    </section>
    <PetAvatar />
    <section class="learned">
      <h3>已学字母</h3>
      <div class="chip-list">
        <span v-for="l in progress.learnedLetters" :key="l" class="chip">{{ l }}</span>
        <span v-if="!progress.learnedLetters.length" class="empty">还没有学字母，快去闯关吧！</span>
      </div>
    </section>
    <section class="badges">
      <h3>我的小勋章</h3>
      <div class="badge-list">
        <div v-for="b in badgeList" :key="b.id" :class="['badge', b.earned ? 'earned' : '']">
          {{ b.icon }}<small>{{ b.name }}</small>
        </div>
      </div>
    </section>
    <section class="danger">
      <button class="reset-btn" @click="resetAll">🗑️ 清空进度（重新开始）</button>
    </section>
    <nav class="bottom-nav">
      <RouterLink to="/">🏠 首页</RouterLink>
      <RouterLink to="/letter">🔤 字母</RouterLink>
      <RouterLink to="/profile" class="active">🎁 我的</RouterLink>
    </nav>
  </div>
</template>

<style scoped>
.page { min-height: 100vh; background: #fff8e8; padding-bottom: 90px; }
.profile-head { display: flex; align-items: center; gap: 14px; padding: 20px; }
.avatar { width: 64px; height: 64px; border-radius: 20px; background: #ffc64c; display: grid; place-items: center; font-size: 36px; }
.profile-head strong { display: block; color: #263b54; font-size: 18px; }
.profile-head small { color: #718093; font-size: 12px; }
.stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; padding: 0 20px 20px; }
.stat { padding: 14px; border-radius: 16px; background: #fff; box-shadow: 0 5px 0 #eee4d2; text-align: center; }
.stat span { font-size: 24px; }
.stat strong { display: block; color: #263b54; font-size: 20px; }
.stat small { color: #8390a0; font-size: 11px; }
.learned, .badges, .danger { padding: 0 20px 20px; }
.learned h3, .badges h3 { margin: 0 0 12px; color: #263b54; font-size: 16px; }
.chip-list { display: flex; flex-wrap: wrap; gap: 8px; }
.chip { padding: 8px 14px; border-radius: 12px; background: #fff; color: #ff705d; font-family: 'Baloo 2', sans-serif; font-weight: 700; box-shadow: 0 3px 0 #eee4d2; }
.empty { color: #8390a0; font-size: 13px; }
.badge-list { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.badge { display: grid; justify-items: center; gap: 5px; padding: 12px 6px; border-radius: 14px; background: #f0f1ed; color: #9ca6af; font-size: 22px; }
.badge.earned { background: #fff6cd; color: #263b54; }
.badge small { font-size: 10px; text-align: center; }
.reset-btn { width: 100%; padding: 12px; border-radius: 14px; background: #f0f1ed; color: #8b98a8; font-size: 13px; }
.bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; display: flex; justify-content: space-around; padding: 10px 0 calc(10px + env(safe-area-inset-bottom)); background: #fff; box-shadow: 0 -3px 12px rgba(0,0,0,.06); }
.bottom-nav a { color: #8b98a8; text-decoration: none; font-size: 12px; font-weight: 700; }
.bottom-nav a.active { color: #ff6b6b; }
</style>
