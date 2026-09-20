<script setup lang="ts">
import { useRewardStore } from '@/stores/reward'
const reward = useRewardStore()
function feed() { reward.feedPet() }
</script>

<template>
  <div class="pet-card">
    <div class="scene">
      <span class="spark">✦</span>
      <span class="pet">🦊</span>
      <span class="heart">♥</span>
    </div>
    <h3>小火狐 · Lv.{{ reward.pet.level }}</h3>
    <div class="bar"><span :style="{ width: (reward.pet.exp / reward.pet.nextExp * 100) + '%' }"></span></div>
    <small>{{ reward.pet.exp }} / {{ reward.pet.nextExp }} 经验</small>
    <button :disabled="reward.coins < 10" @click="feed">喂一喂 (-10金币)</button>
  </div>
</template>

<style scoped>
.pet-card { padding: 18px; border-radius: 20px; background: #fff; box-shadow: 0 6px 0 #eee4d2; text-align: center; }
.scene { position: relative; height: 110px; display: grid; place-items: center; }
.pet { font-size: 72px; }
.spark { position: absolute; top: 10px; left: 20%; color: #f9bf45; }
.heart { position: absolute; bottom: 10px; right: 20%; color: #ff6b6b; }
.bar { height: 10px; border-radius: 10px; background: #eee; margin: 10px 0; }
.bar span { display: block; height: 100%; border-radius: 10px; background: #68c986; transition: width .3s; }
button { margin-top: 12px; padding: 10px 18px; border-radius: 14px; background: #ff6b6b; color: #fff; font-weight: 700; }
button:disabled { opacity: .5; }
</style>
