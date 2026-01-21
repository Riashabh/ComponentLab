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
      model: "gpt-4.1",
      temperature: 0.3,
      max_tokens: 2048,
      messages: [
        {
          role: "system",
          content:
            "You are an expert UI component generator. Given a description, you respond with ONLY valid HTML and CSS (inline <style> or classes) needed to implement the component, no explanations or markdown.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const generated = completion.choices?.[0]?.message?.content ?? "";

    return res.json({
      code: generated,
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
