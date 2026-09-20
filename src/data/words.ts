export interface Word {
  id: string
  word: string
  cn: string
  image: string
  audio: string
  sentence: string
  sentenceAudio: string
}

export const words: Word[] = [
  {
    id: 'word-cat',
    word: 'cat',
    cn: '猫',
    image: '/images/words/cat.png',
    audio: '/audio/words/cat.mp3',
    sentence: 'This is a cat.',
    sentenceAudio: '/audio/sentences/this_is_a_cat.mp3',
  },
  {
    id: 'word-sun',
    word: 'sun',
    cn: '太阳',
    image: '/images/words/sun.png',
    audio: '/audio/words/sun.mp3',
    sentence: 'I see the sun.',
    sentenceAudio: '/audio/sentences/i_see_the_sun.mp3',
  },
]
