<script setup lang="ts">
import { computed } from 'vue'
import TopBar from '@/components/common/TopBar.vue'
import PetAvatar from '@/components/reward/PetAvatar.vue'
import { useRewardStore } from '@/stores/reward'
import { useProgressStore } from '@/stores/progress'
import { useUserStore } from '@/stores/user'
import { avatarOptions, useSettingsStore } from '@/stores/settings'
import { useAuthStore } from '@/stores/auth'
import { storage } from '@/utils/storage'
import { levels } from '@/data/levels'
import { dailyTasks, useDailyStore } from '@/stores/daily'

const reward = useRewardStore()
const progress = useProgressStore()
const user = useUserStore()
const settings = useSettingsStore()
const auth = useAuthStore()
const daily = useDailyStore()

reward.syncBadges(
  progress.learnedLetters,
  Object.keys(progress.levels).length,
  levels.some((level) => level.type === 'phonics' && progress.levels[level.id]?.completed),
)

const badgeList = computed(() => [
  { id: 'first', icon: '🌱', name: '第一次尝试' },
  { id: 'sound', icon: '🔊', name: '听音小达人' },
  { id: 'star', icon: '🌟', name: '星星收藏家' },
  { id: 'letter', icon: '🔤', name: '字母大王' },
  { id: 'phonics', icon: '🧩', name: '拼读小能手' },
  { id: 'champion', icon: '🏆', name: '拼读冠军' },
])

async function resetAll() {
  if (!confirm('确定要清空所有学习进度吗？重新开始哦～')) return
  storage.clear()
  await storage.flush()
  location.reload()
}

function saveSettings() {
  settings.save()
}

function claimTask(task: typeof dailyTasks[number]) {
  const rewardCoins = daily.claim(task)
  if (rewardCoins) reward.addCoins(rewardCoins)
}
</script>

<template>
  <div class="page">
    <TopBar title="我的" show-back />
    <section class="profile-head">
      <div class="avatar">{{ avatarOptions.find((option) => option.id === settings.avatar)?.emoji ?? '🐱' }}</div>
      <div>
        <strong>{{ user.nickname }}</strong>
        <small>已经认识 {{ progress.learnedLetters.length }} 个字母，学会 {{ progress.learnedWords.length }} 个单词</small>
      </div>
    </section>
    <section class="avatar-picker" aria-label="选择头像">
      <div class="avatar-picker-heading"><strong>挑一个喜欢的头像</strong><small>点一下就换好啦</small></div>
      <div class="avatar-options">
        <button
          v-for="avatar in avatarOptions"
          :key="avatar.id"
          :class="['avatar-option', { selected: settings.avatar === avatar.id }]"
          :aria-label="avatar.name"
          :aria-pressed="settings.avatar === avatar.id"
          @click="settings.setAvatar(avatar.id)"
        >
          <span>{{ avatar.emoji }}</span>
          <small>{{ avatar.name }}</small>
        </button>
      </div>
    </section>
    <section class="stats">
      <div class="stat"><span>★</span><strong>{{ reward.stars }}</strong><small>星星</small></div>
      <div class="stat"><span>🪙</span><strong>{{ reward.coins }}</strong><small>金币</small></div>
      <div class="stat"><span>🏅</span><strong>{{ reward.badges.length }}</strong><small>勋章</small></div>
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
        <div v-for="b in badgeList" :key="b.id" :class="['badge', reward.badges.includes(b.id) ? 'earned' : '']">
          {{ b.icon }}<small>{{ b.name }}</small>
        </div>
      </div>
    </section>
    <section class="settings">
      <h3>家长设置</h3>
      <div class="setting-row theme-row">
        <span>学习主题</span>
        <div class="theme-options">
          <button :class="{ selected: settings.theme === 'cat' }" :aria-pressed="settings.theme === 'cat'" @click="settings.setTheme('cat')">🐱 猫咪</button>
          <button :class="{ selected: settings.theme === 'princess' }" :aria-pressed="settings.theme === 'princess'" @click="settings.setTheme('princess')">👑 公主</button>
        </div>
      </div>
      <label class="setting-row">
        <span>每日学习时长</span>
        <select v-model.number="settings.dailyLimit" @change="saveSettings">
          <option :value="10">10 分钟</option>
          <option :value="20">20 分钟</option>
          <option :value="30">30 分钟</option>
          <option :value="45">45 分钟</option>
        </select>
      </label>
      <label class="setting-row volume-row">
        <span>语音音量</span>
        <input v-model.number="settings.volume" type="range" min="0" max="1" step="0.1" @change="saveSettings" />
        <strong>{{ Math.round(settings.volume * 100) }}%</strong>
      </label>
      <label class="setting-row">
        <span>音效</span>
        <input v-model="settings.soundEnabled" type="checkbox" @change="saveSettings" />
      </label>
      <label class="setting-row">
        <span>背景音乐</span>
        <input v-model="settings.musicEnabled" type="checkbox" @change="saveSettings" />
      </label>
    </section>
    <section class="daily">
      <h3>今日任务</h3>
      <div v-for="task in dailyTasks" :key="task.id" class="task-row">
        <div class="task-info">
          <strong>{{ task.desc }}</strong>
          <small>{{ Math.min(daily.progressFor(task.id), task.target) }} / {{ task.target }}</small>
        </div>
        <button :disabled="daily.progressFor(task.id) < task.target || daily.claimed.includes(task.id)" @click="claimTask(task)">
          {{ daily.claimed.includes(task.id) ? '已领取' : `+${task.reward} 金币` }}
        </button>
      </div>
    </section>
    <section class="danger">
      <button class="logout-btn" :disabled="auth.busy" @click="auth.logout">退出家长账号</button>
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
.avatar { width: 64px; height: 64px; border-radius: 20px; background: var(--theme-soft); display: grid; place-items: center; font-size: 36px; box-shadow: 0 4px 0 var(--theme-shadow); }
.profile-head strong { display: block; color: #263b54; font-size: 18px; }
.profile-head small { color: #718093; font-size: 12px; }
.avatar-picker { margin: 0 20px 20px; padding: 14px; border-radius: 16px; background: rgba(255,255,255,.82); box-shadow: 0 3px 0 var(--theme-shadow); }
.avatar-picker-heading { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; margin-bottom: 10px; }
.avatar-picker-heading strong { color: #493447; font-size: 14px; }
.avatar-picker-heading small { color: #958995; font-size: 10px; }
.avatar-options { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 7px; }
.avatar-option { display: grid; justify-items: center; gap: 4px; min-width: 0; padding: 7px 2px; border: 2px solid transparent; border-radius: 12px; background: #fff7fa; color: #766979; }
.avatar-option span { font-size: 25px; line-height: 1.2; }
.avatar-option small { font-size: 9px; }
.avatar-option.selected { border-color: var(--theme-primary); background: var(--theme-soft); color: var(--theme-deep); box-shadow: 0 2px 0 var(--theme-shadow); }
.avatar-option:focus-visible { outline: 2px solid #8e5a9e; outline-offset: 2px; }
.stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; padding: 0 20px 20px; }
.stat { padding: 14px; border-radius: 16px; background: #fff; box-shadow: 0 5px 0 #eee4d2; text-align: center; }
.stat span { font-size: 24px; }
.stat strong { display: block; color: #263b54; font-size: 20px; }
.stat small { color: #8390a0; font-size: 11px; }
.learned, .badges, .settings, .daily, .danger { padding: 0 20px 20px; }
.learned h3, .badges h3, .settings h3, .daily h3 { margin: 0 0 12px; color: #263b54; font-size: 16px; }
.chip-list { display: flex; flex-wrap: wrap; gap: 8px; }
.chip { padding: 8px 14px; border-radius: 12px; background: #fff; color: #ff705d; font-family: 'Baloo 2', sans-serif; font-weight: 700; box-shadow: 0 3px 0 #eee4d2; }
.empty { color: #8390a0; font-size: 13px; }
.badge-list { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.badge { display: grid; justify-items: center; gap: 5px; padding: 12px 6px; border-radius: 14px; background: #f0f1ed; color: #9ca6af; font-size: 22px; }
.badge.earned { background: #fff6cd; color: #263b54; }
.badge small { font-size: 10px; text-align: center; }
.settings { display: grid; gap: 10px; }
.setting-row { display: flex; align-items: center; gap: 12px; min-height: 44px; padding: 10px 12px; border-radius: 14px; background: #fff; color: #536980; font-size: 14px; }
.setting-row > span { flex: 1; }
.setting-row select { padding: 6px 8px; border: 1px solid #e3e6df; border-radius: 8px; color: #536980; background: #fff; }
.setting-row input[type='range'] { width: 120px; accent-color: var(--theme-primary); }
.setting-row strong { width: 38px; color: var(--theme-deep); font-size: 12px; text-align: right; }
.setting-row input[type='checkbox'] { width: 20px; height: 20px; accent-color: #68c986; }
.theme-options { display: flex; gap: 6px; }
.theme-options button { padding: 7px 9px; border: 1px solid transparent; border-radius: 10px; background: #fff7fa; color: #766979; font-size: 12px; white-space: nowrap; }
.theme-options button.selected { border-color: var(--theme-shadow); background: var(--theme-soft); color: var(--theme-deep); }
.daily { display: grid; gap: 10px; }
.task-row { display: flex; align-items: center; gap: 10px; padding: 12px; border-radius: 14px; background: #fff; }
.task-info { flex: 1; display: grid; gap: 4px; color: #536980; }
.task-info small { color: #8b98a8; }
.task-row button { min-width: 82px; padding: 8px 10px; border-radius: 10px; background: #ffe66d; color: #8a6d00; font-size: 12px; font-weight: 700; }
.task-row button:disabled { opacity: .5; }
.logout-btn { width: 100%; margin-bottom: 10px; padding: 12px; border: 1px solid #edcfda; border-radius: 14px; background: #fff; color: var(--theme-deep); font-size: 13px; font-weight: 800; }
.logout-btn:disabled { opacity: .6; }
.reset-btn { width: 100%; padding: 12px; border-radius: 14px; background: #f0f1ed; color: #8b98a8; font-size: 13px; }
.bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; display: flex; justify-content: space-around; padding: 10px 0 calc(10px + env(safe-area-inset-bottom)); background: #fff; box-shadow: 0 -3px 12px rgba(0,0,0,.06); }
.bottom-nav a { color: #8b98a8; text-decoration: none; font-size: 12px; font-weight: 700; }
.bottom-nav a.active { color: var(--theme-deep); }
</style>
