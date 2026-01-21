import { useState } from 'react'

function App() {
  const [prompt, setPrompt] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    setCopied(false)
    try {
      const response = await fetch('http://localhost:3000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })
      if (!response.ok) {
        throw new Error('Failed to generate')
      }
      const data = await response.json()
      setGeneratedCode(data.code)
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to generate. Make sure backend is running.')
    }
    setLoading(false)
  }

  const handleCopy = async () => {
    if (!generatedCode) return
    try {
      await navigator.clipboard.writeText(generatedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col">
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-purple-500 to-pink-500 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>

      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-3xl py-32 sm:py-48 lg:py-56">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black text-white mb-3">
              Component<span className="text-purple-400">Lab</span>
            </h1>
            <p className="text-lg font-semibold text-gray-300 mb-8">
              Build UI components from plain English
            </p>

            <div className="mx-auto max-w-xl">
              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 shadow-2xl backdrop-blur-sm">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., A glassmorphism card with blur effect..."
                  className="w-full h-32 bg-gray-800 text-white placeholder-gray-400 rounded-xl p-4 text-base resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 border-0"
                />
                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-purple-300">
                    ✨ Be specific for best results
                  </p>
                  <button
                    onClick={handleGenerate}
                    disabled={loading || !prompt.trim()}
                    className="rounded-lg bg-purple-400 px-6 py-3 text-base font-bold text-gray-900 shadow-lg hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Generating...' : 'Generate'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-purple-500 to-pink-500 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>
      </div>

      {generatedCode && (
        <div className="px-6 pb-24 lg:px-8">
          <div className="mx-auto max-w-5xl space-y-8">
            <div className="rounded-2xl bg-gray-950/60 p-6 shadow-2xl ring-1 ring-white/10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Generated Code</h2>
                <button
                  onClick={handleCopy}
                  className="rounded-lg bg-purple-400 px-4 py-2 text-sm font-bold text-gray-900 hover:bg-purple-500 transition-colors"
                >
                  {copied ? '✓ Copied!' : '📋 Copy'}
                </button>
              </div>
              <div className="overflow-hidden rounded-xl border border-white/10 bg-gray-900">
                <pre className="max-h-80 overflow-auto p-4 text-sm leading-6">
                  <code className="text-green-400">{generatedCode}</code>
                </pre>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Live Preview</h2>
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <iframe
                  srcDoc={generatedCode}
                  title="Preview"
                  className="w-full h-96"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App