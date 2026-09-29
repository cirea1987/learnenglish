<script setup lang="ts">
import { computed, provide } from 'vue'
import { RouterView } from 'vue-router'
import AuthGate from '@/components/common/AuthGate.vue'
import { useAuthStore } from '@/stores/auth'
import { useSettingsStore } from '@/stores/settings'

const auth = useAuthStore()
const settings = useSettingsStore()
provide('welcomeBack', computed(() => auth.welcomeBack))
</script>

<template>
  <div class="app-shell" :data-theme="settings.theme">
    <AuthGate v-if="auth.status !== 'authenticated'" />
    <RouterView v-else />
  </div>
</template>
