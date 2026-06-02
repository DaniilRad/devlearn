import type { Difficulty, Topic } from '../types'

const DIFFICULTIES: { value: Difficulty | 'all'; label: string }[] = [
  { value: 'all',    label: 'all' },
  { value: 'junior', label: 'junior' },
  { value: 'mid',    label: 'mid' },
  { value: 'senior', label: 'senior' },
]

interface Props {
  topic: Topic | 'all'
  difficulty: Difficulty | 'all'
  onTopicChange: (t: Topic | 'all') => void
  onDifficultyChange: (d: Difficulty | 'all') => void
  totalCount: number
}

export default function FilterBar({ difficulty, onDifficultyChange, totalCount }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1">
        <span className="text-xs text-neutral-600 dark:text-neutral-600 text-neutral-400 mr-2">
          // level
        </span>
        {DIFFICULTIES.map(d => (
          <button
            key={d.value}
            onClick={() => onDifficultyChange(d.value)}
            className={`
              px-3 py-1 text-xs border transition-colors
              ${difficulty === d.value
                ? 'border-green-800 dark:border-green-800 border-green-300 text-green-400 dark:text-green-400 text-green-700 bg-green-500/5 dark:bg-green-500/5 bg-green-50'
                : 'border-transparent text-neutral-500 dark:text-neutral-500 text-neutral-400 hover:text-neutral-200 dark:hover:text-neutral-200 hover:text-neutral-700'
              }
            `}
          >
            [{d.label}]
          </button>
        ))}
      </div>
      <span className="text-xs text-neutral-700 dark:text-neutral-700 text-neutral-400">
        {totalCount} cards
      </span>
    </div>
  )
}
