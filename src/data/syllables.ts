export interface Syllable {
  word: string
  cn: string
  image: string
  parts: { text: string; audio: string }[]
  count: number
  audio: string
}

export const syllables: Syllable[] = [
  {
    word: 'rabbit',
    cn: '兔子',
    image: '/images/words/rabbit.png',
    parts: [
      { text: 'rab', audio: '/audio/syllables/rab.mp3' },
      { text: 'bit', audio: '/audio/syllables/bit.mp3' },
    ],
    count: 2,
    audio: '/audio/words/rabbit.mp3',
  },
  {
    word: 'elephant',
    cn: '大象',
    image: '/images/words/elephant.png',
    parts: [
      { text: 'e', audio: '/audio/syllables/e.mp3' },
      { text: 'le', audio: '/audio/syllables/le.mp3' },
      { text: 'phant', audio: '/audio/syllables/phant.mp3' },
    ],
    count: 3,
    audio: '/audio/words/elephant.mp3',
  },
  {
    word: 'sunset',
    cn: '日落',
    image: '/images/words/sunset.png',
    parts: [
      { text: 'sun', audio: '/audio/syllables/sun.mp3' },
      { text: 'set', audio: '/audio/syllables/set.mp3' },
    ],
    count: 2,
    audio: '/audio/words/sunset.mp3',
  },
  {
    word: 'picnic',
    cn: '野餐',
    image: '/images/words/picnic.png',
    parts: [
      { text: 'pic', audio: '/audio/syllables/pic.mp3' },
      { text: 'nic', audio: '/audio/syllables/nic.mp3' },
    ],
    count: 2,
    audio: '/audio/words/picnic.mp3',
  },
  {
    word: 'tiger',
    cn: '老虎',
    image: '/images/words/tiger.png',
    parts: [
      { text: 'ti', audio: '/audio/syllables/ti.mp3' },
      { text: 'ger', audio: '/audio/syllables/ger.mp3' },
    ],
    count: 2,
    audio: '/audio/words/tiger.mp3',
  },
  {
    word: 'banana',
    cn: '香蕉',
    image: '/images/words/banana.png',
    parts: [
      { text: 'ba', audio: '/audio/syllables/ba.mp3' },
      { text: 'na', audio: '/audio/syllables/na.mp3' },
      { text: 'na', audio: '/audio/syllables/na.mp3' },
    ],
    count: 3,
    audio: '/audio/words/banana.mp3',
  },
  {
    word: 'tomato',
    cn: '番茄',
    image: '/images/words/tomato.png',
    parts: [
      { text: 'to', audio: '/audio/syllables/to.mp3' },
      { text: 'ma', audio: '/audio/syllables/ma.mp3' },
      { text: 'to', audio: '/audio/syllables/to.mp3' },
    ],
    count: 3,
    audio: '/audio/words/tomato.mp3',
  },
]
