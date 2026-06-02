import { Loader2 } from 'lucide-react'
import type { OutputLine } from '../../hooks/useRunner'

const LINE_COLOR: Record<OutputLine['type'], string> = {
  log:   'text-neutral-300 dark:text-neutral-300 text-neutral-700',
  info:  'text-blue-400 dark:text-blue-400 text-blue-600',
  warn:  'text-amber-400 dark:text-amber-400 text-amber-600',
  error: 'text-red-400 dark:text-red-400 text-red-600',
}

interface Props {
  output: OutputLine[]
  error: string | null
  running: boolean
}

export default function OutputPane({ output, error, running }: Props) {
  const empty = !running && output.length === 0 && !error

  return (
    <div className="
      border border-neutral-800 dark:border-neutral-800 border-neutral-200
      bg-black dark:bg-black bg-neutral-950
      flex flex-col min-h-36 max-h-64 overflow-y-auto
    ">
      <div className="
        px-4 py-2 border-b border-neutral-800 dark:border-neutral-800 border-neutral-200
        flex items-center justify-between shrink-0
      ">
        <span className="text-xs text-neutral-600 dark:text-neutral-600 text-neutral-400">// output</span>
        {running && <Loader2 size={12} className="animate-spin text-green-500" />}
      </div>

      <div className="p-4 flex flex-col gap-1 font-mono text-xs flex-1">
        {empty && (
          <span className="text-neutral-700 dark:text-neutral-700 text-neutral-400">
            run code to see output...
          </span>
        )}

        {output.map((line, i) => (
          <div key={i} className={`flex gap-2 ${LINE_COLOR[line.type]}`}>
            <span className="text-neutral-700 dark:text-neutral-700 text-neutral-500 shrink-0">&gt;</span>
            <span className="whitespace-pre-wrap break-all">{line.text}</span>
          </div>
        ))}

        {error && (
          <div className="flex gap-2 text-red-400 dark:text-red-400 text-red-600 mt-1">
            <span className="shrink-0">✖</span>
            <span className="whitespace-pre-wrap break-all">{error}</span>
          </div>
        )}
      </div>
    </div>
  )
}
