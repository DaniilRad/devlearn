import { useCallback, useEffect, useRef, useState } from 'react'

export interface OutputLine {
  type: 'log' | 'error' | 'warn' | 'info'
  text: string
}

// Injected into the sandboxed iframe — captures console output and runs code via postMessage
const RUNNER_HTML = `<!DOCTYPE html><html><body><script>
const captured = [];

function serialize(v) {
  if (v === undefined) return 'undefined';
  if (v === null) return 'null';
  if (typeof v === 'function') return '[Function: ' + (v.name || 'anonymous') + ']';
  if (typeof v === 'string') return v;
  try { return JSON.stringify(v, null, 2); } catch(e) { return String(v); }
}

['log','error','warn','info'].forEach(m => {
  const orig = console[m];
  console[m] = (...args) => {
    captured.push({ type: m, text: args.map(serialize).join(' ') });
  };
});

window.addEventListener('message', ({ data }) => {
  if (data.type !== 'run') return;
  captured.length = 0;
  let error = null;
  try {
    const fn = new Function(data.code);
    const result = fn();
    // support async top-level
    if (result && typeof result.then === 'function') {
      result
        .then(() => parent.postMessage({ type: 'done', output: [...captured], error: null }, '*'))
        .catch(e => parent.postMessage({ type: 'done', output: [...captured], error: e.message }, '*'));
      return;
    }
  } catch(e) {
    error = e.message;
  }
  parent.postMessage({ type: 'done', output: [...captured], error }, '*');
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
      if (e.data?.type !== 'done') return
      setOutput(e.data.output ?? [])
      setError(e.data.error ?? null)
      setRunning(false)
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
