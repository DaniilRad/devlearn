import Editor, { useMonaco } from '@monaco-editor/react'
import { ChevronDown, ChevronRight, Play, RotateCcw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useRunner } from '../../hooks/useRunner'
import type { SandboxChallenge } from '../../types'
import challenges from '../../data/sandbox.json'
import ChallengeList from './ChallengeList'
import OutputPane from './OutputPane'

const DIFFICULTY_COLOR = {
  junior: 'text-green-400 dark:text-green-400 text-green-600',
  mid:    'text-amber-400 dark:text-amber-400 text-amber-600',
  senior: 'text-red-400 dark:text-red-400 text-red-500',
}

export default function SandboxView({ dark }: { dark: boolean }) {
  const all = challenges as SandboxChallenge[]
  const [activeId, setActiveId] = useState(all[0].id)
  const [code, setCode] = useState(all[0].starterCode)
  const [hintsOpen, setHintsOpen] = useState(false)
  const { run, clear, output, error, running } = useRunner()
  const monaco = useMonaco()
  const editorRef = useRef<Parameters<NonNullable<Parameters<typeof Editor>[0]['onMount']>>[0] | null>(null)

  const active = all.find(c => c.id === activeId)!

  // When switching challenges reset editor + output
  useEffect(() => {
    setCode(active.starterCode)
    setHintsOpen(false)
    clear()
  }, [activeId])

  // Register Ctrl+Enter keybinding once Monaco and editor are both ready
  useEffect(() => {
    if (!monaco || !editorRef.current) return
    editorRef.current.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      () => run(code)
    )
  }, [monaco, code])

  const handleRun = () => run(code)

  const handleReset = () => {
    setCode(active.starterCode)
    clear()
  }

  return (
    <div className="flex flex-1 gap-8 min-h-0">
      <ChallengeList
        challenges={all}
        activeId={activeId}
        onSelect={setActiveId}
      />

      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-medium text-neutral-100 dark:text-neutral-100 text-neutral-900">
              {active.title}
            </h2>
            <span className={`text-xs ${DIFFICULTY_COLOR[active.difficulty]}`}>
              {active.difficulty} · {active.topic}
            </span>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={handleReset}
              className="
                flex items-center gap-1.5 px-3 py-1.5 text-xs
                border border-neutral-800 dark:border-neutral-800 border-neutral-200
                text-neutral-500 dark:text-neutral-500 text-neutral-400
                hover:border-neutral-600 dark:hover:border-neutral-600 hover:border-neutral-400
                hover:text-neutral-200 dark:hover:text-neutral-200 hover:text-neutral-700
                transition-colors
              "
            >
              <RotateCcw size={12} />
              reset
            </button>
            <button
              onClick={handleRun}
              disabled={running}
              className="
                flex items-center gap-1.5 px-4 py-1.5 text-xs
                border border-green-800 dark:border-green-800 border-green-300
                text-green-400 dark:text-green-400 text-green-700
                hover:bg-green-500/10 dark:hover:bg-green-500/10 hover:bg-green-50
                disabled:opacity-40 disabled:cursor-not-allowed
                transition-colors font-medium
              "
            >
              <Play size={12} />
              run
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="
          border border-neutral-800 dark:border-neutral-800 border-neutral-200
          bg-neutral-900 dark:bg-neutral-900 bg-white
          p-4
        ">
          <p className="text-xs text-neutral-400 dark:text-neutral-400 text-neutral-600 leading-relaxed whitespace-pre-line">
            {active.description}
          </p>

          {active.hints && active.hints.length > 0 && (
            <div className="mt-3 border-t border-neutral-800 dark:border-neutral-800 border-neutral-200 pt-3">
              <button
                onClick={() => setHintsOpen(h => !h)}
                className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-600 text-neutral-400 hover:text-neutral-300 dark:hover:text-neutral-300 hover:text-neutral-600 transition-colors"
              >
                {hintsOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                {hintsOpen ? 'hide hints' : `show hints (${active.hints.length})`}
              </button>
              {hintsOpen && (
                <ul className="mt-2 flex flex-col gap-1.5">
                  {active.hints.map((h, i) => (
                    <li key={i} className="flex gap-2 text-xs text-neutral-500 dark:text-neutral-500 text-neutral-500">
                      <span className="text-green-600 dark:text-green-600 text-green-500 shrink-0">{i + 1}.</span>
                      {h}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Editor */}
        <div className="border border-neutral-800 dark:border-neutral-800 border-neutral-200 overflow-hidden">
          <div className="
            px-4 py-2 border-b border-neutral-800 dark:border-neutral-800 border-neutral-200
            text-xs text-neutral-600 dark:text-neutral-600 text-neutral-400
            flex items-center justify-between
          ">
            <span>// editor</span>
            <span className="text-neutral-700 dark:text-neutral-700 text-neutral-400">ctrl+enter to run</span>
          </div>
          <Editor
            height="300px"
            language="javascript"
            value={code}
            onChange={v => setCode(v ?? '')}
            theme={dark ? 'vs-dark' : 'light'}
            onMount={(editor) => { editorRef.current = editor }}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              fontFamily: "'JetBrains Mono', 'Cascadia Code', ui-monospace, monospace",
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              padding: { top: 12, bottom: 12 },
              overviewRulerLanes: 0,
              renderLineHighlight: 'line',
              tabSize: 2,
            }}
          />
        </div>

        {/* Output */}
        <OutputPane output={output} error={error} running={running} />
      </div>
    </div>
  )
}
