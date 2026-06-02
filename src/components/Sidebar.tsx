import { Braces, Cpu, FileCode, Layers, Smartphone, Workflow } from 'lucide-react'
import { allQuestions } from '../data'
import type { Difficulty, Topic } from '../types'

const TOPICS: { value: Topic; label: string; icon: React.ReactNode }[] = [
  { value: 'js-core',       label: 'js-core',       icon: <Braces size={13} /> },
  { value: 'typescript',    label: 'typescript',    icon: <FileCode size={13} /> },
  { value: 'react',         label: 'react',         icon: <Layers size={13} /> },
  { value: 'react-hooks',   label: 'react-hooks',   icon: <Workflow size={13} /> },
  { value: 'react-native',  label: 'react-native',  icon: <Smartphone size={13} /> },
  { value: 'architecture',  label: 'architecture',  icon: <Cpu size={13} /> },
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
  const total = allQuestions.filter(q => difficulty === 'all' || q.difficulty === difficulty).length

  const row = (
    value: Topic | 'all',
    label: string,
    count: number,
    icon?: React.ReactNode
  ) => {
    const active = activeTopic === value
    return (
      <button
        key={value}
        onClick={() => onTopicSelect(value)}
        className={`
          w-full flex items-center justify-between px-3 py-1.5 text-xs text-left
          border-l-2 transition-colors
          ${active
            ? 'border-green-500 text-green-400 dark:text-green-400 text-green-600 bg-green-500/5 dark:bg-green-500/5 bg-green-50'
            : 'border-transparent text-neutral-500 dark:text-neutral-500 text-neutral-400 hover:text-neutral-200 dark:hover:text-neutral-200 hover:text-neutral-700 hover:border-neutral-700 dark:hover:border-neutral-700 hover:border-neutral-300'
          }
        `}
      >
        <span className="flex items-center gap-2">
          {icon}
          {label}
        </span>
        <span className={active ? 'text-green-500' : 'text-neutral-700 dark:text-neutral-700 text-neutral-400'}>
          {count}
        </span>
      </button>
    )
  }

  return (
    <aside className="w-48 shrink-0 flex flex-col gap-1">
      <p className="text-xs text-neutral-700 dark:text-neutral-700 text-neutral-400 px-3 mb-2 tracking-widest">
        // topics
      </p>
      {row('all', 'all', total)}
      <div className="my-1 border-t border-neutral-800 dark:border-neutral-800 border-neutral-200" />
      {TOPICS.map(t => row(t.value, t.label, countByTopic(t.value, difficulty), t.icon))}
    </aside>
  )
}
