<script setup lang="ts">
withDefaults(defineProps<{ type?: 'primary' | 'secondary'; size?: 'small' | 'medium' | 'large'; disabled?: boolean }>(), { type: 'primary', size: 'medium' })
</script>

<template>
  <button class="app-button" :class="[type, size]" :disabled="disabled"><slot /></button>
</template>

<style scoped>
.app-button { border: none; border-radius: 16px; font-weight: 700; cursor: pointer; transition: transform .15s; }
.app-button:disabled { opacity: .6; cursor: not-allowed; }
.app-button:not(:disabled):hover { transform: translateY(-2px); }
.primary { background: #ff6b6b; color: #fff; box-shadow: 0 5px 0 #e95749; }
.secondary { background: #fff; color: #ff6b6b; border: 2px solid #ff6b6b; }
.small { padding: 8px 14px; font-size: 14px; }
.medium { padding: 12px 20px; font-size: 16px; }
.large { padding: 16px 28px; font-size: 20px; }
</style>
