// 用 Web Audio API 生成简单音效，无需外部音频文件
function getAudioCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const Ctor = window.AudioContext || (window as any).webkitAudioContext
  if (!Ctor) return null
  return new Ctor()
}

function beep(freq: number, duration: number, type: OscillatorType = 'sine', delay = 0) {
  const audioCtx = getAudioCtx()
  if (!audioCtx) return
  if (audioCtx.state === 'suspended') audioCtx.resume()
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay)
  gain.gain.setValueAtTime(0.3, audioCtx.currentTime + delay)
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + delay + duration)
  osc.connect(gain)
  gain.connect(audioCtx.destination)
  osc.start(audioCtx.currentTime + delay)
  osc.stop(audioCtx.currentTime + delay + duration)
}

export function playCorrect() {
  beep(523, 0.12, 'sine')
  beep(659, 0.12, 'sine', 0.1)
  beep(784, 0.18, 'sine', 0.2)
}

export function playWrong() {
  beep(220, 0.25, 'triangle')
  beep(196, 0.35, 'triangle', 0.15)
}

export function playComplete() {
  beep(523, 0.15, 'sine')
  beep(659, 0.15, 'sine', 0.12)
  beep(784, 0.15, 'sine', 0.24)
  beep(1047, 0.35, 'sine', 0.36)
}

export function playClick() {
  beep(880, 0.05, 'sine')
}
