<script setup lang="ts">
defineProps<{ visible: boolean; title?: string }>()
const emit = defineEmits<{ (e: 'close'): void }>()
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="dialog-mask" @click.self="emit('close')">
      <div class="dialog">
        <h3 v-if="title" class="dialog-title">{{ title }}</h3>
        <div class="dialog-body"><slot /></div>
        <div class="dialog-footer"><slot name="footer" /></div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.dialog-mask { position: fixed; inset: 0; display: grid; place-items: center; background: rgba(0,0,0,.35); z-index: 100; }
.dialog { width: min(86vw, 360px); padding: 22px; border-radius: 22px; background: #fff; text-align: center; }
.dialog-title { margin: 0 0 12px; color: #263b54; }
.dialog-body { color: #596b81; font-size: 15px; }
.dialog-footer { margin-top: 18px; display: flex; gap: 10px; justify-content: center; }
</style>
