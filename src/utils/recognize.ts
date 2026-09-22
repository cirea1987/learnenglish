import { calcScore } from './score'

export function recognize(target: string, onResult: (score: number, said: string) => void) {
  const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!Ctor) {
    return false
  }
  const rec = new Ctor()
  rec.lang = 'en-US'
  rec.interimResults = false
  rec.maxAlternatives = 1
  rec.onresult = (e: SpeechRecognitionEvent) => {
    const said = e.results[0][0].transcript.toLowerCase().trim()
    const score = calcScore(said, target)
    onResult(score, said)
  }
  rec.onerror = () => onResult(0, '')
  rec.start()
  return true
}
