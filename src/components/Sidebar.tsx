import { allQuestions } from '../data'
import type { Difficulty, Topic } from '../types'

const TOPICS: { value: Topic; label: string; emoji: string }[] = [
  { value: 'js-core', label: 'JS Core', emoji: '🟨' },
  { value: 'typescript', label: 'TypeScript', emoji: '🔷' },
  { value: 'react', label: 'React', emoji: '⚛️' },
  { value: 'react-hooks', label: 'React Hooks', emoji: '🪝' },
  { value: 'react-native', label: 'React Native', emoji: '📱' },
  { value: 'architecture', label: 'Architecture', emoji: '🏗️' },
]

const countByTopic = (topic: Topic, difficulty: Difficulty | 'all') =>
  allQuestions.filter(
    q => q.topic === topic && (difficulty === 'all' || q.difficulty === difficulty)
  ).length

interface Props {
  activeTopic: Topic | 'all'
  difficulty: Difficulty | 'all'
  onTopicSelect: (t: Topic | 'all') => void
}

export default function Sidebar({ activeTopic, difficulty, onTopicSelect }: Props) {
  const total = allQuestions.filter(
    q => difficulty === 'all' || q.difficulty === difficulty
  ).length

  return (
    <aside className="w-52 shrink-0 flex flex-col gap-1">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2">Topics</p>

      <button
        onClick={() => onTopicSelect('all')}
        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
          activeTopic === 'all'
            ? 'bg-indigo-50 text-indigo-700 font-medium'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <span>All topics</span>
        <span className="text-xs text-gray-400 tabular-nums">{total}</span>
      </button>

      {TOPICS.map(t => {
        const count = countByTopic(t.value, difficulty)
        if (count === 0) return null
        return (
          <button
            key={t.value}
            onClick={() => onTopicSelect(t.value)}
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
              activeTopic === t.value
                ? 'bg-indigo-50 text-indigo-700 font-medium'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="flex items-center gap-2">
              <span>{t.emoji}</span>
              {t.label}
            </span>
            <span className="text-xs text-gray-400 tabular-nums">{count}</span>
          </button>
        )
      })}
    </aside>
  )
}
