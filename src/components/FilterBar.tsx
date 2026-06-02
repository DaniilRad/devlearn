import type { Difficulty, Topic } from '../types'

const TOPICS: { value: Topic | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'js-core', label: 'JS Core' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'react', label: 'React' },
  { value: 'react-hooks', label: 'Hooks' },
  { value: 'react-native', label: 'React Native' },
  { value: 'architecture', label: 'Architecture' },
]

const DIFFICULTIES: { value: Difficulty | 'all'; label: string }[] = [
  { value: 'all', label: 'All levels' },
  { value: 'junior', label: 'Junior' },
  { value: 'mid', label: 'Mid' },
  { value: 'senior', label: 'Senior' },
]

interface Props {
  topic: Topic | 'all'
  difficulty: Difficulty | 'all'
  onTopicChange: (t: Topic | 'all') => void
  onDifficultyChange: (d: Difficulty | 'all') => void
  totalCount: number
}

export default function FilterBar({ topic, difficulty, onTopicChange, onDifficultyChange, totalCount }: Props) {
  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Topic pills */}
      <div className="flex flex-wrap gap-2">
        {TOPICS.map(t => (
          <button
            key={t.value}
            onClick={() => onTopicChange(t.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              topic === t.value
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Difficulty + count row */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {DIFFICULTIES.map(d => (
            <button
              key={d.value}
              onClick={() => onDifficultyChange(d.value)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                difficulty === d.value
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
        <span className="text-xs text-gray-400">{totalCount} cards</span>
      </div>
    </div>
  )
}
