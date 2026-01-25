import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

// Load environment variables from .env
dotenv.config();

const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.warn(
    "Warning: OPENAI_API_KEY is not set. The /generate endpoint will fail until it is configured."
  );
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// POST /generate
app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body || {};

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({
        error: "Invalid request. Expected JSON body with a string 'prompt' field.",
      });
    }

    if (!OPENAI_API_KEY) {
      return res
        .status(500)
        .json({ error: "Server is not configured with OPENAI_API_KEY." });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.3,
      max_tokens: 4096,
      messages: [
        {
          role: "system",
          content: `You are an expert React + Tailwind CSS component generator.

CRITICAL OUTPUT RULES:
- Return ONLY raw JSX code, NO markdown formatting, NO backticks, NO explanations
- NEVER wrap code in \`\`\`jsx or \`\`\` 
- Start directly with imports (if needed)

COMPONENT STRUCTURE:
- Import hooks at the top: import { useState, useEffect } from 'react'
- Use: export default function App() { ... }
- All styling must use Tailwind CSS utility classes
- Use modern, clean, professional UI design
- Make components responsive and accessible
- Add hover states, transitions, and animations where appropriate

REQUIREMENTS:
- Use semantic HTML elements
- Add proper spacing (p-, m-, gap-)
- Use proper colors from Tailwind palette
- Make it visually appealing and polished
- Add interactive states (hover:, focus:, active:)
- Ensure proper contrast and readability

Example output format (raw code, no markdown):
import { useState } from 'react'

export default function App() {
  const [count, setCount] = useState(0)
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <button 
        onClick={() => setCount(count + 1)}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
      >
        Clicked {count} times
      </button>
    </div>
  )
}`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const generated = completion.choices?.[0]?.message?.content ?? "";

    // Strip markdown code fences if present
    let cleanedCode = generated.trim();
    
    // Remove markdown code blocks
    cleanedCode = cleanedCode.replace(/^```(?:jsx?|typescript|tsx?)?\n?/gm, '');
    cleanedCode = cleanedCode.replace(/\n?```$/gm, '');
    cleanedCode = cleanedCode.trim();

    return res.json({
      code: cleanedCode,
    });
  } catch (err) {
    console.error("Error in /generate:", err);

    const message =
      (err && err.message) || (typeof err === "string" ? err : "Unknown error");

    return res.status(500).json({
      error: "Failed to generate code from Claude.",
      details: message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
