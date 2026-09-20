<script setup lang="ts">
import TopBar from '@/components/common/TopBar.vue'
import PetAvatar from '@/components/reward/PetAvatar.vue'
import { useRewardStore } from '@/stores/reward'
import { useProgressStore } from '@/stores/progress'
import { useUserStore } from '@/stores/user'
const reward = useRewardStore()
const progress = useProgressStore()
const user = useUserStore()
</script>

<template>
  <div class="page">
    <TopBar title="我的" show-back />
    <section class="profile-head">
      <div class="avatar">🐻</div>
      <div><strong>{{ user.nickname }}</strong><small>已经认识 {{ progress.learnedLetters.length }} 个字母</small></div>
    </section>
    <section class="stats">
      <div class="stat"><span>★</span><strong>{{ reward.stars }}</strong><small>星星</small></div>
      <div class="stat"><span>🪙</span><strong>{{ reward.coins }}</strong><small>金币</small></div>
      <div class="stat"><span>🏅</span><strong>{{ reward.badges.length }}</strong><small>勋章</small></div>
    </section>
    <PetAvatar />
    <section class="badges">
      <h3>我的小勋章</h3>
      <div class="badge-list">
        <div class="badge earned">🌱<small>第一次尝试</small></div>
        <div class="badge earned">🔊<small>听音小达人</small></div>
        <div :class="['badge', reward.stars >= 20 ? 'earned' : '']">🌟<small>星星收藏家</small></div>
        <div class="badge">🏆<small>拼读冠军</small></div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page { min-height: 100vh; background: #fff8e8; padding-bottom: 30px; }
.profile-head { display: flex; align-items: center; gap: 14px; padding: 20px; }
.avatar { width: 64px; height: 64px; border-radius: 20px; background: #ffc64c; display: grid; place-items: center; font-size: 36px; }
.profile-head strong { display: block; color: #263b54; font-size: 18px; }
.profile-head small { color: #718093; }
.stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; padding: 0 20px 20px; }
.stat { padding: 14px; border-radius: 16px; background: #fff; box-shadow: 0 5px 0 #eee4d2; text-align: center; }
.stat span { font-size: 24px; }
.stat strong { display: block; color: #263b54; font-size: 20px; }
.stat small { color: #8390a0; font-size: 11px; }
.badges { padding: 20px; }
.badges h3 { margin: 0 0 12px; color: #263b54; }
.badge-list { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.badge { display: grid; justify-items: center; gap: 5px; padding: 12px 6px; border-radius: 14px; background: #f0f1ed; color: #9ca6af; font-size: 22px; }
.badge.earned { background: #fff6cd; color: #263b54; }
.badge small { font-size: 10px; text-align: center; }
</style>
