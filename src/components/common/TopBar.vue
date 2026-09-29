<script setup lang="ts">
import { computed } from 'vue'
import { useRewardStore } from '@/stores/reward'
import { avatarOptions, useSettingsStore } from '@/stores/settings'

defineProps<{ title?: string; showBack?: boolean }>()
const reward = useRewardStore()
const settings = useSettingsStore()
const avatarEmoji = computed(() => avatarOptions.find((option) => option.id === settings.avatar)?.emoji ?? '🐱')
</script>

<template>
  <header class="topbar">
    <div class="left">
      <button v-if="showBack" class="back" @click="$router.back()">←</button>
      <span v-if="title" class="title">{{ title }}</span>
    </div>
    <div class="right">
      <div class="pill"><span class="icon">★</span><strong>{{ reward.stars }}</strong></div>
      <RouterLink to="/profile" class="avatar">{{ avatarEmoji }}</RouterLink>
    </div>
  </header>
</template>

<style scoped>
.topbar { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; }
.left { display: flex; align-items: center; gap: 10px; }
.back { width: 34px; height: 34px; border-radius: 50%; background: #fff; color: #555; font-size: 18px; }
.title { font-weight: 800; color: #493447; }
.right { display: flex; align-items: center; gap: 10px; }
.pill { display: flex; align-items: center; gap: 5px; padding: 7px 12px; border-radius: 20px; background: #fff; box-shadow: 0 3px 0 #eee4d2; font-size: 13px; }
.pill .icon { color: #f6b62c; }
.avatar { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 50%; background: var(--theme-soft, #ffe3ec); font-size: 22px; text-decoration: none; box-shadow: 0 3px 0 var(--theme-shadow, #f2c4d2); }
</style>
