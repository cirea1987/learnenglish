export interface LetterSound {
  letter: string
  sound: string
  audio: string
  sentence: string
  sentenceAudio: string
  examples: string[]
}

import { letters } from './letters'

export const letterSounds: LetterSound[] = letters.map((letter) => ({
  letter: letter.upper,
  sound: letter.soundIpa,
  audio: letter.soundAudio,
  sentence: `${letter.upper} says ${letter.soundIpa}, ${letter.example.word}!`,
  sentenceAudio: `/audio/sentences/${letter.lower}_says.mp3`,
  examples: [letter.example.word],
}))
