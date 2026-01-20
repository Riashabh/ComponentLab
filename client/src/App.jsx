import { useState } from "react";
import "./App.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    setGeneratedCode("");

    try {
      const res = await fetch("http://localhost:3000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to generate component");
      }

      const data = await res.json();
      setGeneratedCode(data.code || "");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedCode) return;
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="app">
      <h1>ComponentLab</h1>
      <p>Describe a UI component and generate HTML/CSS code.</p>

      <div className="controls">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. A responsive pricing card with three tiers and a CTA button"
          rows={5}
        />

        <button onClick={handleGenerate} disabled={loading || !prompt.trim()}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {generatedCode && (
        <div className="output">
          <h2>Generated Code</h2>
          <pre>
            <code>{generatedCode}</code>
          </pre>

          <button onClick={handleCopy} disabled={!generatedCode}>
            {copied ? "Copied!" : "Copy to clipboard"}
          </button>

          <h2>Preview</h2>
          <iframe
            title="Component Preview"
            srcDoc={generatedCode}
            style={{
              width: "100%",
              height: "300px",
              border: "1px solid #ccc",
            }}
          />
        </div>
      )}
    </div>
  );
}

export default App;
