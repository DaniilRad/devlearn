export type Topic =
  | 'js-core'
  | 'typescript'
  | 'react'
  | 'react-hooks'
  | 'react-native'
  | 'architecture'

export type Difficulty = 'junior' | 'mid' | 'senior'

export interface Question {
  id: string
  topic: Topic
  difficulty: Difficulty
  question: string
  answer: string
  codeExample?: string
}

export interface SandboxChallenge {
  id: string
  topic: Topic
  difficulty: Difficulty
  title: string
  description: string
  starterCode: string
  hints?: string[]
}
