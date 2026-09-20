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
]
