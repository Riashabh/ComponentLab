# ComponentLab

An AI-powered UI component generator that transforms natural language into production-ready React components with live preview and code editing.

![Demo](demo.gif)

## ✨ Features

- **Natural Language to Code** — Describe a component, get working React + Tailwind code
- **Live Preview** — See your component render in real-time
- **In-Browser Code Editor** — Edit code with syntax highlighting via Sandpack
- **Iterative Refinement** — Keep editing with follow-up prompts ("make it darker", "add a hover effect")
- **Export to CodeSandbox** — One-click export to continue working in a full IDE
- **Copy Code** — Grab the generated code instantly

## 🛠️ Tech Stack

**Frontend:**
- React + Vite
- Tailwind CSS
- Sandpack (live code editor)

**Backend:**
- Express.js
- OpenAI API (GPT-4)

**Deployment:**
- Frontend: Vercel
- Backend: Render

## 🚀 Live Demo

**[componentlab-ai.vercel.app](https://componentlab-ai.vercel.app)**

## 📦 Run Locally

### Prerequisites

- Node.js 18+
- OpenAI API key

### Setup

1. Clone the repo:

```bash
git clone https://github.com/Riashabh/ComponentLab.git
cd ComponentLab
```

2. Install dependencies:

```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

3. Add your OpenAI key:

```bash
# In /server, create .env file
echo "OPENAI_API_KEY=your-key-here" > .env
```

4. Start both servers:

```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd client
npm run dev
```

5. Open [localhost:5173](http://localhost:5173)

## 💡 Example Prompts

- "A pricing card with a title, price, 3 features, and a CTA button"
- "A toggle switch that shows ON/OFF with smooth animation"
- "A glassmorphism login form with blur effect"
- "A dark mode card with hover effects and a gradient border"

## 📁 Project Structure

```
ComponentLab/
├── client/                 # React frontend
│   ├── src/
│   │   ├── App.jsx        # Main app with Sandpack integration
│   │   └── ...
│   └── package.json
├── server/                 # Express backend
│   ├── server.js          # API endpoint for code generation
│   └── package.json
└── README.md
```

## 🔮 Future Improvements

- [ ] Component history/versioning
- [ ] Share components via unique URLs
- [ ] Support for Vue/Svelte output
- [ ] AI chat sidebar for code explanations

## 👤 Author

**Rishabh Meena**

- GitHub: [@Riashabh](https://github.com/Riashabh)
- LinkedIn: [meenarishabh35](https://linkedin.com/in/meenarishabh35)

## 📄 License

MIT
