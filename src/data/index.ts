import type { Question } from '../types'
import jsCore from './js-core.json'
import typescript from './typescript.json'
import react from './react.json'
import reactHooks from './react-hooks.json'
import reactNative from './react-native.json'
import architecture from './architecture.json'

export const allQuestions: Question[] = [
  ...jsCore,
  ...typescript,
  ...react,
  ...reactHooks,
  ...reactNative,
  ...architecture,
] as Question[]
