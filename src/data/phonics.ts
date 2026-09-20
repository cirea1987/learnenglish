export interface Phonic {
  id: string
  family: string
  word: string
  letters: { char: string; sound: string; audio: string }[]
  wordAudio: string
  image: string
  cn: string
}

export const phonics: Phonic[] = [
  {
    id: 'cvc-at-1',
    family: '-at',
    word: 'cat',
    letters: [
      { char: 'c', sound: '/k/', audio: '/audio/phonics/c.mp3' },
      { char: 'a', sound: '/æ/', audio: '/audio/phonics/a.mp3' },
      { char: 't', sound: '/t/', audio: '/audio/phonics/t.mp3' },
    ],
    wordAudio: '/audio/words/cat.mp3',
    image: '/images/words/cat.png',
    cn: '猫',
  },
  {
    id: 'cvc-an-1',
    family: '-an',
    word: 'fan',
    letters: [
      { char: 'f', sound: '/f/', audio: '/audio/phonics/f.mp3' },
      { char: 'a', sound: '/æ/', audio: '/audio/phonics/a.mp3' },
      { char: 'n', sound: '/n/', audio: '/audio/phonics/n.mp3' },
    ],
    wordAudio: '/audio/words/fan.mp3',
    image: '/images/words/fan.png',
    cn: '风扇',
  },
  {
    id: 'cvc-ap-1',
    family: '-ap',
    word: 'map',
    letters: [
      { char: 'm', sound: '/m/', audio: '/audio/phonics/m.mp3' },
      { char: 'a', sound: '/æ/', audio: '/audio/phonics/a.mp3' },
      { char: 'p', sound: '/p/', audio: '/audio/phonics/p.mp3' },
    ],
    wordAudio: '/audio/words/map.mp3',
    image: '/images/words/map.png',
    cn: '地图',
  },
]
