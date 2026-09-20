export interface Level {
  id: string
  chapter: string
  title: string
  type: 'letterLearn' | 'letterSound' | 'phonics' | 'syllable' | 'word'
  letters?: string[]
  phonics?: string[]
  words?: string[]
  stars: number
  unlocked: boolean
  next?: string
}

export const levels: Level[] = [
  { id: 'L1-1', chapter: '字母认读', title: 'A B C D E', type: 'letterLearn', letters: ['A', 'B', 'C', 'D', 'E'], stars: 3, unlocked: true, next: 'L1-2' },
  { id: 'L1-2', chapter: '字母认读', title: 'F G H I J', type: 'letterLearn', letters: ['F', 'G', 'H', 'I', 'J'], stars: 3, unlocked: false, next: 'L2-1' },
  { id: 'L2-1', chapter: '字母音', title: 'A B C D E 的发音', type: 'letterSound', letters: ['A', 'B', 'C', 'D', 'E'], stars: 3, unlocked: false, next: 'L2-2' },
  { id: 'L2-2', chapter: '字母音', title: '听音选字母', type: 'letterSound', letters: ['A', 'B', 'C', 'D', 'E'], stars: 3, unlocked: false, next: 'L3-1' },
  { id: 'L3-1', chapter: '自然拼读', title: 'CVC 小火车', type: 'phonics', phonics: ['cvc-at-1', 'cvc-an-1'], stars: 3, unlocked: false, next: 'L4-1' },
  { id: 'L4-1', chapter: '音节拼读', title: '拍手数音节', type: 'syllable', words: ['rabbit'], stars: 3, unlocked: false, next: 'L5-1' },
  { id: 'L5-1', chapter: '单词与短句', title: '我会说句子', type: 'word', words: ['word-cat', 'word-sun'], stars: 3, unlocked: false },
]
