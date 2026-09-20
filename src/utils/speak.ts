export function speak(text: string, rate = 0.75, pitch = 1.2) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  u.rate = rate
  u.pitch = pitch
  window.speechSynthesis.speak(u)
}
