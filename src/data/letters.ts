export interface Letter {
  id: string
  upper: string
  lower: string
  nameAudio: string
  soundAudio: string
  soundIpa: string
  example: {
    word: string
    cn: string
    image: string
    audio: string
  }
  order: number
}

const soundIpas: Record<string, string> = {
  A: '/æ/', B: '/b/', C: '/k/', D: '/d/', E: '/e/',
  F: '/f/', G: '/g/', H: '/h/', I: '/ɪ/', J: '/dʒ/',
  K: '/k/', L: '/l/', M: '/m/', N: '/n/', O: '/ɒ/',
  P: '/p/', Q: '/kw/', R: '/r/', S: '/s/', T: '/t/',
  U: '/ʌ/', V: '/v/', W: '/w/', X: '/ks/', Y: '/j/',
  Z: '/z/',
}

export const letters: Letter[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((char, index) => {
  const examples: Record<string, { word: string; cn: string }> = {
    A: { word: 'apple', cn: '苹果' }, B: { word: 'bee', cn: '蜜蜂' }, C: { word: 'cat', cn: '猫' },
    D: { word: 'dog', cn: '狗' }, E: { word: 'egg', cn: '鸡蛋' }, F: { word: 'fish', cn: '鱼' },
    G: { word: 'goat', cn: '山羊' }, H: { word: 'hat', cn: '帽子' }, I: { word: 'ice', cn: '冰' },
    J: { word: 'jam', cn: '果酱' }, K: { word: 'kite', cn: '风筝' }, L: { word: 'lion', cn: '狮子' },
    M: { word: 'moon', cn: '月亮' }, N: { word: 'nest', cn: '鸟巢' }, O: { word: 'octopus', cn: '章鱼' },
    P: { word: 'pig', cn: '猪' }, Q: { word: 'queen', cn: '女王' }, R: { word: 'rain', cn: '雨' },
    S: { word: 'sun', cn: '太阳' }, T: { word: 'tiger', cn: '老虎' }, U: { word: 'umbrella', cn: '雨伞' },
    V: { word: 'van', cn: '面包车' }, W: { word: 'whale', cn: '鲸鱼' }, X: { word: 'fox', cn: '狐狸' },
    Y: { word: 'yo-yo', cn: '悠悠球' }, Z: { word: 'zebra', cn: '斑马' },
  }
  const ex = examples[char]
  return {
    id: char,
    upper: char,
    lower: char.toLowerCase(),
    nameAudio: `/audio/letters/${char.toLowerCase()}_name.mp3`,
    soundAudio: `/audio/letters/${char.toLowerCase()}_sound.mp3`,
    soundIpa: soundIpas[char] ?? '',
    example: {
      word: ex.word,
      cn: ex.cn,
      image: `/images/words/${ex.word}.png`,
      audio: `/audio/words/${ex.word}.mp3`,
    },
    order: index + 1,
  }
})
