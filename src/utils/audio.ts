const cache: Record<string, HTMLAudioElement> = {}

export function playAudio(src: string, volume = 0.8) {
  if (!cache[src]) {
    cache[src] = new Audio(src)
    cache[src].volume = volume
  }
  cache[src].currentTime = 0
  cache[src].play().catch(() => {})
}

export function preloadAudio(list: string[]) {
  list.forEach((src) => {
    if (!cache[src]) {
      cache[src] = new Audio(src)
      cache[src].preload = 'auto'
    }
  })
}
