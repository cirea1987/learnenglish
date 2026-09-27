export interface Word {
  id: string
  word: string
  cn: string
  image: string
  audio: string
  sentence: string
  sentenceAudio: string
  emoji: string
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
    emoji: '🐱',
  },
  {
    id: 'word-sun',
    word: 'sun',
    cn: '太阳',
    image: '/images/words/sun.png',
    audio: '/audio/words/sun.mp3',
    sentence: 'I see the sun.',
    sentenceAudio: '/audio/sentences/i_see_the_sun.mp3',
    emoji: '☀️',
  },
  {
    id: 'word-dog', word: 'dog', cn: '狗', image: '/images/words/dog.png', audio: '/audio/words/dog.mp3',
    sentence: 'I like the dog.', sentenceAudio: '/audio/sentences/i_like_the_dog.mp3', emoji: '🐶',
  },
  {
    id: 'word-apple', word: 'apple', cn: '苹果', image: '/images/words/apple.png', audio: '/audio/words/apple.mp3',
    sentence: 'This is an apple.', sentenceAudio: '/audio/sentences/this_is_an_apple.mp3', emoji: '🍎',
  },
  {
    id: 'word-fish', word: 'fish', cn: '鱼', image: '/images/words/fish.png', audio: '/audio/words/fish.mp3',
    sentence: 'The fish can swim.', sentenceAudio: '/audio/sentences/the_fish_can_swim.mp3', emoji: '🐟',
  },
  {
    id: 'word-red', word: 'red', cn: '红色', image: '/images/words/red.png', audio: '/audio/words/red.mp3',
    sentence: 'It is red.', sentenceAudio: '/audio/sentences/it_is_red.mp3', emoji: '🔴',
  },
  {
    id: 'word-big', word: 'big', cn: '大的', image: '/images/words/big.png', audio: '/audio/words/big.mp3',
    sentence: 'The bag is big.', sentenceAudio: '/audio/sentences/the_bag_is_big.mp3', emoji: '🎒',
  },
  {
    id: 'word-run', word: 'run', cn: '跑步', image: '/images/words/run.png', audio: '/audio/words/run.mp3',
    sentence: 'I can run.', sentenceAudio: '/audio/sentences/i_can_run.mp3', emoji: '🏃',
  },
  {
    id: 'word-book', word: 'book', cn: '书', image: '/images/words/book.png', audio: '/audio/words/book.mp3',
    sentence: 'This is my book.', sentenceAudio: '/audio/sentences/this_is_my_book.mp3', emoji: '📚',
  },
  {
    id: 'word-happy', word: 'happy', cn: '开心的', image: '/images/words/happy.png', audio: '/audio/words/happy.mp3',
    sentence: 'I am happy.', sentenceAudio: '/audio/sentences/i_am_happy.mp3', emoji: '😊',
  },
]
