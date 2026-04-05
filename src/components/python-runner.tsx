'use client';

import { useMemo, useState } from 'react';

type PyodideApi = {
  runPythonAsync: (code: string) => Promise<unknown>;
  loadPackage: (packages: string | string[]) => Promise<void>;
};

declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<PyodideApi>;
    __pyodidePromise__?: Promise<PyodideApi>;
  }
}

const PYODIDE_VERSION = '0.27.7';

function createPyodideScriptTag() {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[data-pyodide-version="${PYODIDE_VERSION}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/pyodide.js`;
    script.async = true;
    script.dataset.pyodideVersion = PYODIDE_VERSION;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Pyodide runtime.'));
    document.head.appendChild(script);
  });
}

async function getPyodide() {
  if (typeof window === 'undefined') {
    throw new Error('Python runtime can only be loaded in the browser.');
  }

  if (!window.__pyodidePromise__) {
    window.__pyodidePromise__ = (async () => {
      await createPyodideScriptTag();

      if (!window.loadPyodide) {
        throw new Error('Pyodide loader is unavailable.');
      }

      return window.loadPyodide({
        indexURL: `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`,
      });
    })();
  }

  return window.__pyodidePromise__;
}

export function PythonRunner({ code, packages = [] }: { code: string; packages?: string[] }) {
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'running' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  const normalizedCode = useMemo(() => code.trim(), [code]);
  const normalizedPackages = useMemo(
    () => packages.map((pkg) => pkg.trim()).filter(Boolean),
    [packages],
  );

  async function runPython() {
    setStatus('loading');
    setOutput('');
    setError('');

    try {
      const pyodide = await getPyodide();

      if (normalizedPackages.length > 0) {
        await pyodide.loadPackage(normalizedPackages);
      }

      setStatus('running');

      const escapedCode = JSON.stringify(normalizedCode);
      const result = await pyodide.runPythonAsync(`
import io
import sys
import traceback

_code = ${escapedCode}
_stdout = io.StringIO()
_stderr = io.StringIO()
_old_stdout = sys.stdout
_old_stderr = sys.stderr

try:
    sys.stdout = _stdout
    sys.stderr = _stderr
    exec(_code, {})
except Exception:
    traceback.print_exc()
finally:
    sys.stdout = _old_stdout
    sys.stderr = _old_stderr

_stdout.getvalue() + _stderr.getvalue()
`);

      setOutput(String(result ?? ''));
      setStatus('done');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unknown Python execution error.');
      setStatus('error');
    }
  }

  return (
    <div className="my-6 rounded-xl border border-[#2C2C2E] bg-[#111111] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2C2C2E] bg-black/30">
        <div>
          <strong className="text-sm text-[#e8e8e8]">Python snippet</strong>
          {normalizedPackages.length > 0 ? (
            <p className="text-xs text-[#8baec0] mt-1">Preloaded: {normalizedPackages.join(', ')}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={runPython}
          disabled={status === 'loading' || status === 'running'}
          className="rounded-md border border-[#3d5960] px-3 py-1 text-xs text-[#95bdc9] hover:text-white hover:border-[#95bdc9] disabled:opacity-50"
        >
          {status === 'loading' || status === 'running' ? 'Running…' : 'Run code'}
        </button>
      </div>

      <pre className="m-0 p-4 overflow-x-auto text-sm text-[#d3d3d3] bg-[#0a0a0a]">
        <code>{normalizedCode}</code>
      </pre>

      <div className="px-4 py-3 border-t border-[#2C2C2E]">
        <p className="text-xs uppercase tracking-wider text-[#7f7f82] mb-2">Output</p>
        {error ? (
          <pre className="text-xs whitespace-pre-wrap text-red-300">{error}</pre>
        ) : output ? (
          <pre className="text-xs whitespace-pre-wrap text-[#a6d6a6]">{output}</pre>
        ) : (
          <p className="text-xs text-[#888888]">No output yet. Click “Run code” to execute this snippet.</p>
        )}
      </div>
    </div>
  );
}
