import { useCallback, useEffect, useRef, useState } from 'react'

export interface OutputLine {
  type: 'log' | 'error' | 'warn' | 'info'
  text: string
}

// Each console.log is streamed immediately as a 'line' message.
// After the async IIFE settles, we wait ASYNC_BUFFER_MS for any remaining
// setTimeout/Promise callbacks before sending 'done'.
const ASYNC_BUFFER_MS = 600

const RUNNER_HTML = `<!DOCTYPE html><html><body><script>
function serialize(v) {
  if (v === undefined) return 'undefined';
  if (v === null) return 'null';
  if (typeof v === 'function') return '[Function: ' + (v.name || 'anonymous') + ']';
  if (typeof v === 'string') return v;
  try { return JSON.stringify(v, null, 2); } catch(e) { return String(v); }
}

function sendLine(type, args) {
  parent.postMessage({ type: 'line', line: { type, text: args.map(serialize).join(' ') } }, '*');
}

['log','error','warn','info'].forEach(m => {
  console[m] = (...args) => sendLine(m, args);
});

window.addEventListener('message', ({ data }) => {
  if (data.type !== 'run') return;

  const done = (error) => parent.postMessage({ type: 'done', error: error ?? null }, '*');

  try {
    // Wrap in async IIFE so top-level await works and we can detect when sync+microtask work is done.
    const fn = new Function('return (async () => { ' + data.code + ' })()');
    fn()
      .then(() => setTimeout(() => done(null), ${ASYNC_BUFFER_MS}))
      .catch(e  => setTimeout(() => done(e.message), ${ASYNC_BUFFER_MS}));
  } catch(e) {
    done(e.message);
  }
});
<\/script></body></html>`

export function useRunner() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const [output, setOutput] = useState<OutputLine[]>([])
  const [error, setError] = useState<string | null>(null)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    const iframe = document.createElement('iframe')
    iframe.style.cssText = 'display:none'
    iframe.setAttribute('sandbox', 'allow-scripts')
    iframe.srcdoc = RUNNER_HTML
    document.body.appendChild(iframe)
    iframeRef.current = iframe

    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'line') {
        // Stream each line immediately as it's logged
        setOutput(prev => [...prev, e.data.line as OutputLine])
      } else if (e.data?.type === 'done') {
        setError(e.data.error ?? null)
        setRunning(false)
      }
    }
    window.addEventListener('message', handler)
    return () => {
      window.removeEventListener('message', handler)
      iframe.remove()
    }
  }, [])

  const run = useCallback((code: string) => {
    if (!iframeRef.current?.contentWindow) return
    setRunning(true)
    setOutput([])
    setError(null)
    iframeRef.current.contentWindow.postMessage({ type: 'run', code }, '*')
  }, [])

  const clear = useCallback(() => {
    setOutput([])
    setError(null)
  }, [])

  return { run, clear, output, error, running }
}
