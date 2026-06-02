import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, RotateCw } from 'lucide-react'
import type { Question } from '../types'

interface Props {
  question: Question
  index: number
  total: number
  onNext: () => void
  onPrev: () => void
}

const FLIP_MS = 400

const DIFFICULTY_STYLES = {
  junior: 'text-green-400 dark:text-green-400 text-green-600',
  mid:    'text-amber-400 dark:text-amber-400 text-amber-600',
  senior: 'text-red-400 dark:text-red-400 text-red-500',
}

export default function FlashCard({ question, index, total, onNext, onPrev }: Props) {
  const [flipped, setFlipped] = useState(false)
  // Displayed content lags behind `question` when navigating away from the back face,
  // so the answer text is never visible during the flip-back animation.
  const [displayed, setDisplayed] = useState(question)
  const flippedRef = useRef(flipped)
  flippedRef.current = flipped

  useEffect(() => {
    if (flippedRef.current) {
      // Currently showing answer — flip to front first, swap content after animation.
      setFlipped(false)
      const t = setTimeout(() => setDisplayed(question), FLIP_MS + 50)
      return () => clearTimeout(t)
    } else {
      // Already on front — swap immediately, no visible change.
      setDisplayed(question)
    }
  }, [question.id]) // intentionally not including `flipped` — only react to card changes

  // Space to flip
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === ' ') {
        e.preventDefault()
        setFlipped(f => !f)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const pct = ((index + 1) / total) * 100

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Status line */}
      <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-600">
        <span className="text-neutral-400 dark:text-neutral-500">
          [{index + 1}/{total}]
        </span>
        <div className="flex items-center gap-3">
          <span className={DIFFICULTY_STYLES[displayed.difficulty]}>
            {displayed.difficulty}
          </span>
          <span className="text-neutral-500 dark:text-neutral-600">
            {displayed.topic}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-px bg-neutral-800 dark:bg-neutral-800 bg-neutral-200">
        <div
          className="h-px bg-green-500 dark:bg-green-500 bg-green-600 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Flip card */}
      <div
        className="w-full cursor-pointer select-none"
        style={{ perspective: '1200px' }}
        onClick={() => setFlipped(f => !f)}
      >
        <div
          style={{
            display: 'grid',
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transition: `transform ${FLIP_MS}ms ease`,
          }}
        >
          {/* Front */}
          <div
            className="
              border border-neutral-800 dark:border-neutral-800 border-neutral-200
              bg-neutral-900 dark:bg-neutral-900 bg-white
              p-8 flex flex-col gap-6 min-h-56
            "
            style={{ gridArea: '1/1', backfaceVisibility: 'hidden' }}
          >
            <div className="text-xs text-green-500 dark:text-green-500 text-green-600 tracking-widest">
              &gt;_ question
            </div>
            <p className="text-lg text-neutral-100 dark:text-neutral-100 text-neutral-900 leading-relaxed flex-1">
              {displayed.question}
            </p>
            <div className="text-xs text-neutral-600 dark:text-neutral-600 text-neutral-400">
              // click or press space to reveal
            </div>
          </div>

          {/* Back */}
          <div
            className="
              border border-neutral-800 dark:border-neutral-800 border-neutral-200
              bg-neutral-950 dark:bg-neutral-950 bg-stone-50
              p-8 flex flex-col gap-5 min-h-56
            "
            style={{
              gridArea: '1/1',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="text-xs text-green-500 dark:text-green-500 text-green-600 tracking-widest">
              &gt;_ answer
            </div>
            <p className="text-sm text-neutral-300 dark:text-neutral-300 text-neutral-700 leading-relaxed">
              {displayed.answer}
            </p>
            {displayed.codeExample && (
              <div className="border border-neutral-800 dark:border-neutral-800 border-neutral-200">
                <div className="px-4 py-2 border-b border-neutral-800 dark:border-neutral-800 border-neutral-200 text-xs text-neutral-600 dark:text-neutral-600 text-neutral-400">
                  // code
                </div>
                <pre className="
                  bg-black dark:bg-black bg-neutral-950
                  text-green-400 dark:text-green-400 text-green-700
                  p-4 text-xs overflow-x-auto leading-relaxed
                ">
                  <code>{displayed.codeExample}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={(e) => { e.stopPropagation(); onPrev() }}
          disabled={index === 0}
          className="
            flex items-center gap-1.5 px-4 py-2 text-xs
            border border-neutral-800 dark:border-neutral-800 border-neutral-200
            text-neutral-400 dark:text-neutral-400 text-neutral-500
            hover:border-neutral-600 dark:hover:border-neutral-600 hover:border-neutral-400
            hover:text-neutral-200 dark:hover:text-neutral-200 hover:text-neutral-700
            disabled:opacity-20 disabled:cursor-not-allowed
            transition-colors
          "
        >
          <ChevronLeft size={14} />
          prev
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); setFlipped(f => !f) }}
          className="
            flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-xs
            border border-green-800 dark:border-green-800 border-green-300
            text-green-500 dark:text-green-500 text-green-700
            hover:bg-green-500/10 dark:hover:bg-green-500/10 hover:bg-green-50
            transition-colors
          "
        >
          <RotateCw size={14} />
          {flipped ? 'hide' : 'reveal'}
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); onNext() }}
          disabled={index === total - 1}
          className="
            flex items-center gap-1.5 px-4 py-2 text-xs
            border border-neutral-800 dark:border-neutral-800 border-neutral-200
            text-neutral-400 dark:text-neutral-400 text-neutral-500
            hover:border-neutral-600 dark:hover:border-neutral-600 hover:border-neutral-400
            hover:text-neutral-200 dark:hover:text-neutral-200 hover:text-neutral-700
            disabled:opacity-20 disabled:cursor-not-allowed
            transition-colors
          "
        >
          next
          <ChevronRight size={14} />
        </button>
      </div>

      <p className="text-xs text-neutral-700 dark:text-neutral-700 text-neutral-400 text-center">
        ← → navigate &nbsp;·&nbsp; space flip
      </p>
    </div>
  )
}
