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
  // 字母认读
  { id: 'L1-1', chapter: '字母认读', title: 'A B C D E', type: 'letterLearn', letters: ['A', 'B', 'C', 'D', 'E'], stars: 3, unlocked: true, next: 'L1-2' },
  { id: 'L1-2', chapter: '字母认读', title: 'F G H I J', type: 'letterLearn', letters: ['F', 'G', 'H', 'I', 'J'], stars: 3, unlocked: false, next: 'L1-3' },
  { id: 'L1-3', chapter: '字母认读', title: 'K L M N O', type: 'letterLearn', letters: ['K', 'L', 'M', 'N', 'O'], stars: 3, unlocked: false, next: 'L1-4' },
  { id: 'L1-4', chapter: '字母认读', title: 'P Q R S T', type: 'letterLearn', letters: ['P', 'Q', 'R', 'S', 'T'], stars: 3, unlocked: false, next: 'L1-5' },
  { id: 'L1-5', chapter: '字母认读', title: 'U V W X Y Z', type: 'letterLearn', letters: ['U', 'V', 'W', 'X', 'Y', 'Z'], stars: 3, unlocked: false, next: 'L2-1' },
  // 字母音
  { id: 'L2-1', chapter: '字母音', title: 'A B C D E 的发音', type: 'letterSound', letters: ['A', 'B', 'C', 'D', 'E'], stars: 3, unlocked: false, next: 'L2-2' },
  { id: 'L2-2', chapter: '字母音', title: 'F G H I J 的发音', type: 'letterSound', letters: ['F', 'G', 'H', 'I', 'J'], stars: 3, unlocked: false, next: 'L2-3' },
  { id: 'L2-3', chapter: '字母音', title: 'K L M N O 的发音', type: 'letterSound', letters: ['K', 'L', 'M', 'N', 'O'], stars: 3, unlocked: false, next: 'L2-4' },
  { id: 'L2-4', chapter: '字母音', title: '听音选字母', type: 'letterSound', letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'], stars: 3, unlocked: false, next: 'L3-1' },
  // 自然拼读 CVC
  { id: 'L3-1', chapter: '自然拼读', title: '-at / -an / -ap', type: 'phonics', phonics: ['cvc-at-1', 'cvc-at-2', 'cvc-at-3', 'cvc-an-1', 'cvc-an-2', 'cvc-an-3', 'cvc-ap-1', 'cvc-ap-2', 'cvc-ap-3'], stars: 3, unlocked: false, next: 'L3-2' },
  { id: 'L3-2', chapter: '自然拼读', title: '-ed / -en / -et', type: 'phonics', phonics: ['cvc-ed-1', 'cvc-ed-2', 'cvc-ed-3', 'cvc-en-1', 'cvc-en-2', 'cvc-en-3', 'cvc-et-1', 'cvc-et-2', 'cvc-et-3'], stars: 3, unlocked: false, next: 'L3-3' },
  { id: 'L3-3', chapter: '自然拼读', title: '-ig / -in / -it', type: 'phonics', phonics: ['cvc-ig-1', 'cvc-ig-2', 'cvc-ig-3', 'cvc-in-1', 'cvc-in-2', 'cvc-in-3', 'cvc-it-1', 'cvc-it-2', 'cvc-it-3'], stars: 3, unlocked: false, next: 'L3-4' },
  { id: 'L3-4', chapter: '自然拼读', title: '-og / -ot / -op', type: 'phonics', phonics: ['cvc-og-1', 'cvc-og-2', 'cvc-og-3', 'cvc-ot-1', 'cvc-ot-2', 'cvc-ot-3', 'cvc-op-1', 'cvc-op-2', 'cvc-op-3'], stars: 3, unlocked: false, next: 'L3-5' },
  { id: 'L3-5', chapter: '自然拼读', title: '-ug / -un / -ut', type: 'phonics', phonics: ['cvc-ug-1', 'cvc-ug-2', 'cvc-ug-3', 'cvc-un-1', 'cvc-un-2', 'cvc-un-3', 'cvc-ut-1', 'cvc-ut-2', 'cvc-ut-3'], stars: 3, unlocked: false, next: 'L4-1' },
  // 音节拼读
  { id: 'L4-1', chapter: '音节拼读', title: '拍手数音节', type: 'syllable', words: ['rabbit'], stars: 3, unlocked: false, next: 'L5-1' },
  // 单词与短句
  { id: 'L5-1', chapter: '单词与短句', title: '我会说句子', type: 'word', words: ['word-cat', 'word-sun'], stars: 3, unlocked: false },
]
