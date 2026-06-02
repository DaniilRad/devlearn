import { useEffect, useState } from 'react'
import type { Question } from '../types'

interface Props {
  question: Question
  index: number
  total: number
  onNext: () => void
  onPrev: () => void
}

const DIFFICULTY_COLORS = {
  junior: 'bg-emerald-100 text-emerald-800',
  mid: 'bg-amber-100 text-amber-800',
  senior: 'bg-rose-100 text-rose-800',
}

const TOPIC_LABELS: Record<string, string> = {
  'js-core': 'JS Core',
  typescript: 'TypeScript',
  react: 'React',
  'react-hooks': 'React Hooks',
  'react-native': 'React Native',
  architecture: 'Architecture',
}

export default function FlashCard({ question, index, total, onNext, onPrev }: Props) {
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    setFlipped(false)
  }, [question.id])

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
      {/* Meta row */}
      <div className="w-full flex items-center justify-between text-sm text-gray-500">
        <span>{index + 1} / {total}</span>
        <div className="flex gap-2">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${DIFFICULTY_COLORS[question.difficulty]}`}>
            {question.difficulty}
          </span>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {TOPIC_LABELS[question.topic]}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200 rounded-full">
        <div
          className="h-1 bg-indigo-500 rounded-full transition-all duration-300"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      {/* Flip card */}
      <div
        className="w-full cursor-pointer select-none"
        style={{ perspective: '1000px' }}
        onClick={() => setFlipped(f => !f)}
      >
        <div
          className="relative w-full transition-transform duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            minHeight: '320px',
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col items-center justify-center p-8 gap-4"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="text-xs font-semibold text-indigo-500 uppercase tracking-widest">Question</div>
            <p className="text-xl font-medium text-gray-900 text-center leading-relaxed">
              {question.question}
            </p>
            <div className="text-sm text-gray-400 mt-4">click to reveal answer</div>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm flex flex-col p-8 gap-4 overflow-auto"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="text-xs font-semibold text-emerald-600 uppercase tracking-widest">Answer</div>
            <p className="text-base text-gray-800 leading-relaxed">{question.answer}</p>
            {question.codeExample && (
              <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 text-sm overflow-x-auto whitespace-pre-wrap mt-2 font-mono">
                <code>{question.codeExample}</code>
              </pre>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={onPrev}
          disabled={index === 0}
          className="px-5 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
        >
          ← Prev
        </button>
        <button
          onClick={() => setFlipped(f => !f)}
          className="px-5 py-2 rounded-xl border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors text-sm"
        >
          Flip
        </button>
        <button
          onClick={onNext}
          disabled={index === total - 1}
          className="px-5 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
        >
          Next →
        </button>
      </div>

      <p className="text-xs text-gray-400">space to flip · ← → to navigate</p>
    </div>
  )
}
