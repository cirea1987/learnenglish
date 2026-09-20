import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/letter/:id?', name: 'LetterLearn', component: () => import('@/views/LetterLearn.vue') },
  { path: '/sound/:id?', name: 'LetterSound', component: () => import('@/views/LetterSound.vue') },
  { path: '/phonics/:id?', name: 'Phonics', component: () => import('@/views/Phonics.vue') },
  { path: '/syllable/:id?', name: 'Syllable', component: () => import('@/views/Syllable.vue') },
  { path: '/word/:id?', name: 'Word', component: () => import('@/views/Word.vue') },
  { path: '/profile', name: 'Profile', component: () => import('@/views/Profile.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
