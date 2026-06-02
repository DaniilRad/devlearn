import type { SandboxChallenge } from '../../types'

const DIFFICULTY_COLOR = {
  junior: 'text-green-500',
  mid:    'text-amber-500',
  senior: 'text-red-500',
}

interface Props {
  challenges: SandboxChallenge[]
  activeId: string
  onSelect: (id: string) => void
}

export default function ChallengeList({ challenges, activeId, onSelect }: Props) {
  return (
    <aside className="w-56 shrink-0 flex flex-col gap-1">
      <p className="text-xs text-neutral-600 dark:text-neutral-600 text-neutral-400 px-3 mb-2 tracking-widest">
        // challenges
      </p>
      {challenges.map((c, i) => {
        const active = c.id === activeId
        return (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`
              w-full text-left px-3 py-2 text-xs border-l-2 transition-colors
              ${active
                ? 'border-green-500 text-green-400 dark:text-green-400 text-green-600 bg-green-500/5 dark:bg-green-500/5 bg-green-50'
                : 'border-transparent text-neutral-500 dark:text-neutral-500 text-neutral-400 hover:text-neutral-200 dark:hover:text-neutral-200 hover:text-neutral-700 hover:border-neutral-700 dark:hover:border-neutral-700 hover:border-neutral-300'
              }
            `}
          >
            <span className="flex items-center justify-between gap-2">
              <span className="truncate">
                <span className="text-neutral-700 dark:text-neutral-700 text-neutral-400 mr-1.5">
                  {String(i + 1).padStart(2, '0')}.
                </span>
                {c.title}
              </span>
              <span className={`shrink-0 ${DIFFICULTY_COLOR[c.difficulty]}`}>·</span>
            </span>
          </button>
        )
      })}
    </aside>
  )
}
