import { useCallback, useEffect, useMemo, useState } from 'react'
import FilterBar from './components/FilterBar'
import FlashCard from './components/FlashCard'
import { allQuestions } from './data'
import type { Difficulty, Topic } from './types'

export default function App() {
  const [topic, setTopic] = useState<Topic | 'all'>('all')
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all')
  const [index, setIndex] = useState(0)

  const filtered = useMemo(() => {
    return allQuestions.filter(q => {
      const topicMatch = topic === 'all' || q.topic === topic
      const diffMatch = difficulty === 'all' || q.difficulty === difficulty
      return topicMatch && diffMatch
    })
  }, [topic, difficulty])

  // Reset to first card when filters change
  useEffect(() => {
    setIndex(0)
  }, [topic, difficulty])

  const goNext = useCallback(() => {
    setIndex(i => Math.min(i + 1, filtered.length - 1))
  }, [filtered.length])

  const goPrev = useCallback(() => {
    setIndex(i => Math.max(i - 1, 0))
  }, [])

  // Keyboard navigation
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
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <span className="font-semibold text-gray-900 tracking-tight">devlearn</span>
          <span className="text-xs text-gray-400">{allQuestions.length} total questions</span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center px-6 py-10 gap-8 max-w-2xl mx-auto w-full">
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
    </div>
  )
}
