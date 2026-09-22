import { useSettingsStore } from '@/stores/settings'

export function speak(text: string, rate = 0.75, pitch = 1.2) {
  if (!('speechSynthesis' in window)) return
  const settings = useSettingsStore()
  if (!settings.soundEnabled) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  u.rate = rate
  u.pitch = pitch
  u.volume = settings.volume
  window.speechSynthesis.speak(u)
}
