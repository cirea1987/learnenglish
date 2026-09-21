<script setup lang="ts">
const props = defineProps<{ count: number }>()
</script>

<template>
  <div class="star-reward" :key="count">
    <span class="star">★</span>
    <strong>{{ count }}</strong>
  </div>
</template>

<style scoped>
.star-reward { display: flex; align-items: center; gap: 4px; color: #f6b62c; font-weight: 800; }
.star { font-size: 22px; display: inline-block; animation: pop 0.35s ease; }
@keyframes pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.45); }
  100% { transform: scale(1); }
}
</style>
