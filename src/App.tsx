import { useCallback, useEffect, useMemo, useState } from 'react'
import FilterBar from './components/FilterBar'
import FlashCard from './components/FlashCard'
import Sidebar from './components/Sidebar'
import { allQuestions } from './data'
import type { Difficulty, Topic } from './types'

type Mode = 'flashcards' | 'sandbox'

export default function App() {
  const [mode, setMode] = useState<Mode>('flashcards')
  const [topic, setTopic] = useState<Topic | 'all'>('all')
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all')
  const [index, setIndex] = useState(0)

  const filtered = useMemo(() =>
    allQuestions.filter(q => {
      const topicMatch = topic === 'all' || q.topic === topic
      const diffMatch = difficulty === 'all' || q.difficulty === difficulty
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
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [goNext, goPrev])

  const currentQuestion = filtered[index]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <span className="font-bold text-gray-900 tracking-tight text-lg">devlearn</span>

        {/* Mode tabs */}
        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {(['flashcards', 'sandbox'] as Mode[]).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
                mode === m
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {m}
              {m === 'sandbox' && (
                <span className="ml-1.5 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">soon</span>
              )}
            </button>
          ))}
        </nav>

        <span className="text-xs text-gray-400">{allQuestions.length} questions</span>
      </header>

      {/* Body */}
      <div className="flex flex-1 max-w-5xl mx-auto w-full px-6 py-8 gap-8">
        {mode === 'flashcards' ? (
          <>
            {/* Sidebar */}
            <Sidebar
              activeTopic={topic}
              difficulty={difficulty}
              onTopicSelect={setTopic}
            />

            {/* Main */}
            <main className="flex-1 flex flex-col gap-6 min-w-0">
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
                <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                  No cards match the current filters.
                </div>
              )}
            </main>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <div className="text-5xl">🧪</div>
            <h2 className="text-xl font-semibold text-gray-800">Code Sandbox</h2>
            <p className="text-gray-500 max-w-sm">
              Monaco editor + in-browser JS runner coming in Phase 2.
              You'll be able to run code directly in the browser for hands-on practice.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
