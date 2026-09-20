<script setup lang="ts">
const props = defineProps<{ count: number }>()
</script>

<template>
  <div class="star-reward"><span>★</span><strong>{{ count }}</strong></div>
</template>

<style scoped>
.star-reward { display: flex; align-items: center; gap: 4px; color: #f6b62c; font-weight: 800; }
.star-reward span { font-size: 22px; }
</style>
