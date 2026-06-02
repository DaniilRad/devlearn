import { useCallback, useEffect, useMemo, useState } from 'react'
import { Code2, Layers, Moon, Sun, Terminal } from 'lucide-react'
import FilterBar from './components/FilterBar'
import FlashCard from './components/FlashCard'
import Sidebar from './components/Sidebar'
import { allQuestions } from './data'
import type { Difficulty, Topic } from './types'

type Mode = 'flashcards' | 'sandbox'

export default function App() {
  const [dark, setDark] = useState(true)
  const [mode, setMode] = useState<Mode>('flashcards')
  const [topic, setTopic] = useState<Topic | 'all'>('all')
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all')
  const [index, setIndex] = useState(0)

  // Apply dark class to <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const filtered = useMemo(() =>
    allQuestions.filter(q => {
      const topicMatch = topic === 'all' || q.topic === topic
      const diffMatch  = difficulty === 'all' || q.difficulty === difficulty
      return topicMatch && diffMatch
    }),
    [topic, difficulty]
  )

  useEffect(() => { setIndex(0) }, [topic, difficulty])

  const goNext = useCallback(() => setIndex(i => Math.min(i + 1, filtered.length - 1)), [filtered.length])
  const goPrev = useCallback(() => setIndex(i => Math.max(i - 1, 0)), [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft')  goPrev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [goNext, goPrev])

  const currentQuestion = filtered[index]

  return (
    <div className="min-h-screen bg-neutral-950 dark:bg-neutral-950 bg-stone-50 text-neutral-200 dark:text-neutral-200 text-neutral-900 flex flex-col">
      {/* Header */}
      <header className="
        border-b border-neutral-800 dark:border-neutral-800 border-neutral-200
        bg-neutral-900 dark:bg-neutral-900 bg-white
        px-6 py-3 flex items-center justify-between sticky top-0 z-10
      ">
        {/* Logo */}
        <div className="flex items-center gap-2 text-sm font-medium text-green-400 dark:text-green-400 text-green-600">
          <Terminal size={16} />
          devlearn
        </div>

        {/* Mode tabs */}
        <nav className="flex items-center gap-1">
          <button
            onClick={() => setMode('flashcards')}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 text-xs border transition-colors
              ${mode === 'flashcards'
                ? 'border-green-800 dark:border-green-800 border-green-300 text-green-400 dark:text-green-400 text-green-700 bg-green-500/5 dark:bg-green-500/5 bg-green-50'
                : 'border-transparent text-neutral-500 dark:text-neutral-500 text-neutral-400 hover:text-neutral-300 dark:hover:text-neutral-300 hover:text-neutral-600'
              }
            `}
          >
            <Layers size={13} />
            flashcards
          </button>
          <button
            onClick={() => setMode('sandbox')}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 text-xs border transition-colors
              ${mode === 'sandbox'
                ? 'border-green-800 dark:border-green-800 border-green-300 text-green-400 dark:text-green-400 text-green-700 bg-green-500/5 dark:bg-green-500/5 bg-green-50'
                : 'border-transparent text-neutral-500 dark:text-neutral-500 text-neutral-400 hover:text-neutral-300 dark:hover:text-neutral-300 hover:text-neutral-600'
              }
            `}
          >
            <Code2 size={13} />
            sandbox
            <span className="text-amber-500 text-[10px]">~soon</span>
          </button>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-700 dark:text-neutral-700 text-neutral-400">
            {allQuestions.length} cards
          </span>
          <button
            onClick={() => setDark(d => !d)}
            className="text-neutral-500 dark:text-neutral-500 text-neutral-400 hover:text-neutral-200 dark:hover:text-neutral-200 hover:text-neutral-700 transition-colors"
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 max-w-4xl mx-auto w-full px-6 py-8 gap-8">
        {mode === 'flashcards' ? (
          <>
            <Sidebar
              activeTopic={topic}
              difficulty={difficulty}
              onTopicSelect={setTopic}
            />

            <main className="flex-1 flex flex-col gap-5 min-w-0">
              <FilterBar
                topic={topic}
                difficulty={difficulty}
                onTopicChange={setTopic}
                onDifficultyChange={setDifficulty}
                totalCount={filtered.length}
              />

              {currentQuestion ? (
                <FlashCard
                  question={currentQuestion}
                  index={index}
                  total={filtered.length}
                  onNext={goNext}
                  onPrev={goPrev}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center text-xs text-neutral-600 dark:text-neutral-600 text-neutral-400">
                  // no cards match filters
                </div>
              )}
            </main>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <Code2 size={32} className="text-neutral-700 dark:text-neutral-700 text-neutral-300" />
            <p className="text-sm text-neutral-400 dark:text-neutral-400 text-neutral-500">
              // code sandbox — coming in phase 2
            </p>
            <p className="text-xs text-neutral-700 dark:text-neutral-700 text-neutral-400 max-w-xs">
              Monaco editor + in-browser JS runner.
              Run code directly without leaving the app.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
