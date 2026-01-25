import { useState } from 'react'
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";

function App() {
  const [prompt, setPrompt] = useState('')
  const [conversation, setConversation] = useState([])
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    
    try {
      // Get the last generated code (if exists)
      const lastCode = conversation.length > 0 
        ? conversation[conversation.length - 1].code 
        : null

      // Build the full prompt with context
      const fullPrompt = lastCode
        ? `Previous code:\n${lastCode}\n\nUser request: ${prompt}`
        : prompt

      const response = await fetch('http://localhost:3000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt })
      })
      
      if (!response.ok) throw new Error('Failed to generate')
      
      const data = await response.json()
      console.log(data.code)
      // Add to conversation history
      setConversation([...conversation, {
        userPrompt: prompt,
        code: data.code,
        timestamp: Date.now()
      }])
      
      setPrompt('') // Clear input for next message
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to generate. Make sure backend is running.')
    }
    setLoading(false)
  }

  const handleNewComponent = () => {
    setConversation([])
    setPrompt('')
    setCopied(false)
  }

  const handleCopy = async () => {
    if (conversation.length === 0) return
    const latestCode = conversation[conversation.length - 1].code
    try {
      await navigator.clipboard.writeText(latestCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  // Get the latest generated code
  const latestCode = conversation.length > 0 
    ? conversation[conversation.length - 1].code 
    : null

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col relative">
      <div className="absolute inset-x-0 -top-40 -z-[100] transform-gpu overflow-hidden blur-3xl sm:-top-80">
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
                  placeholder={conversation.length === 0 
                    ? "e.g., A glassmorphism card with blur effect..." 
                    : "e.g., make it bigger, add a shadow..."}
                  className="w-full h-32 bg-gray-800 text-white placeholder-gray-400 rounded-xl p-4 text-base resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 border-0"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      handleGenerate()
                    }
                  }}
                />
                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-purple-300">
                    ✨ {conversation.length === 0 ? 'Be specific for best results' : 'Describe your changes'}
                  </p>
                  
                  {conversation.length === 0 ? (
                    <button
                      onClick={handleGenerate}
                      disabled={loading || !prompt.trim()}
                      className="rounded-lg bg-purple-400 px-6 py-3 text-base font-bold text-gray-900 shadow-lg hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? 'Generating...' : 'Generate'}
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={handleGenerate}
                        disabled={loading || !prompt.trim()}
                        className="rounded-lg bg-purple-400 px-6 py-3 text-base font-bold text-gray-900 shadow-lg hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {loading ? 'Updating...' : 'Keep Editing'}
                      </button>
                      <button
                        onClick={handleNewComponent}
                        className="rounded-lg bg-gray-700 px-6 py-3 text-base font-bold text-white hover:bg-gray-600 transition-colors"
                      >
                        Start New
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        

        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-[100] transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-purple-500 to-pink-500 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>
      </div>

      {latestCode && (
        <div className="px-6 pb-24 lg:px-8 flex-1">
          <div className="mx-auto max-w-[95rem]">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Live Editor & Preview</h2>
              <button
                onClick={handleCopy}
                className="rounded-lg bg-purple-400 px-4 py-2 text-sm font-bold text-gray-900 hover:bg-purple-500 transition-colors"
              >
                {copied ? '✓ Copied!' : '📋 Copy Code'}
              </button>
            </div>
            
            <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              <SandpackProvider
                key={latestCode}
                template="react"
                theme="dark"
                files={{
                  "/App.js": {
                    code: latestCode,
                    active: true,
                  },
                  "/index.js": {
                    code: `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

// Inject Tailwind CSS
const script = document.createElement('script');
script.src = 'https://cdn.tailwindcss.com';
document.head.appendChild(script);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);`,
                    hidden: false,
                  },
                  "/styles.css": {
                    code: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
}`,
                    hidden: false,
                  },
                }}
                options={{
                  showNavigator: false,
                  showTabs: true,
                  showLineNumbers: true,
                  editorHeight: "600px",
                  autorun: true,
                  autoReload: true,
                }}
              >
                <SandpackLayout style={{ height: 700 }}>
                  <SandpackFileExplorer style={{ minWidth: 150 }} />
                  <SandpackCodeEditor 
                    showLineNumbers
                    showTabs
                    style={{ flex: 2 }}
                  />
                  <SandpackPreview 
                    showNavigator={false}
                    showRefreshButton
                    showOpenInCodeSandbox={false}
                    style={{ flex: 3 }}
                  />
                </SandpackLayout>
              </SandpackProvider>
            </div>
          </div>
        </div>
      )}

      <footer className="py-8 border-t border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex justify-center items-center gap-6">
          <span className="text-gray-400 text-sm">Built by Rishabh</span>
          
          <a
            href="https://github.com/Riashabh"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          
          <a
            href="https://www.linkedin.com/in/meenarishabh35"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
        </div>
      </footer>
    </div>
  )
}

export default App