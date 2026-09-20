import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import { migrate } from './utils/storage'
import { useProgressStore } from './stores/progress'
import { useRewardStore } from './stores/reward'
import { useSettingsStore } from './stores/settings'
import { useUserStore } from './stores/user'

migrate()
const app = createApp(App)
app.use(createPinia())
app.use(router)

useProgressStore().load()
useRewardStore().load()
useSettingsStore().load()
useUserStore().load()

app.mount('#app')
