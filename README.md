# ContentAI — 30-Day AI Content Calendar

> **Generate a complete 30-day social media content calendar in under 60 seconds using a 5-stage multi-agent AI pipeline.**

---

## What Is This?

ContentAI takes the most tedious part of social media management — figuring out what to post, when to post it, and writing it for every platform — and replaces it with a one-click AI pipeline.

You enter your brand's niche, target audience, voice, and platforms. A coordinated team of AI agents immediately goes to work: researching what's trending in your niche, mapping out a strategic 30-day posting schedule, and writing platform-native captions, hashtags, and calls-to-action for Instagram, Twitter/X, LinkedIn, TikTok, and YouTube.

The entire process streams back to your browser in real-time. You watch each agent complete its work live.

---

## Features

- **5-stage autonomous pipeline** — Researcher → Planner → Copywriter → Validator → Self-Corrector, all running without user input
- **Platform-native copy** — Twitter posts stay under 280 characters, Instagram posts include 8–12 hashtags, LinkedIn posts use a professional tone. Each platform gets content written to its specific rules.
- **Live progress tracking** — Server-Sent Events stream agent status updates to the browser as each stage completes. No polling, no loading spinners.
- **Self-correcting AI** — A deterministic validator checks every post against platform constraints. Posts that fail are automatically sent back to the AI for a rewrite.
- **Resilient fallback parser** — If the LLM returns malformed or prefixed JSON, a regex-based rescue parser strips the garbage and recovers the data without a full retry.
- **Content mix strategy** — The planner enforces a 40/25/20/15 ratio (educational / entertaining / promotional / behind-the-scenes) and never places two promotional posts back-to-back.
- **Inline editing** — Every generated caption, hashtag set, and CTA is editable directly in the UI.
- **Export** — Download your full calendar as CSV or JSON.
- **Session persistence** — Completed calendars are saved to `localStorage` and restored automatically on next visit.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.2.9 |
| Frontend | React | 19.2.4 |
| Language | TypeScript | ^5 |
| AI Orchestration | LangGraph (`@langchain/langgraph`) | ^1.4.7 |
| LLM Client | LangChain Groq (`@langchain/groq`) | ^1.3.1 |
| LLM Provider | Groq API | — |
| Output Validation | Zod | ^4.4.3 |
| Concurrency Control | p-limit | ^7.3.0 |
| Styling | TailwindCSS | ^4 |
| UI Components | shadcn/ui | ^4.12.0 |
| Icons | Lucide React | ^1.21.0 |
| Date Utilities | date-fns | ^4.4.0 |

**Models used:**
- `llama-3.3-70b-versatile` — Trend research and calendar planning (higher reasoning quality)
- `llama-3.1-8b-instant` — Copywriting (faster, lower cost, runs once per active day)

---

## How the Pipeline Works

```
User submits brand config
        │
        ▼
[1] Trend Researcher
    llama-3.3-70b-versatile
    → Identifies 15 trending topics for the brand's niche
        │
        ▼
[2] Content Planner
    llama-3.3-70b-versatile
    → Maps trends to a 30-day calendar with content mix strategy
        │
        ▼
[3] Copywriter
    llama-3.1-8b-instant (p-limit: 2 concurrent)
    → Writes platform-specific posts for every active day
        │
        ▼
[4] Validator (no LLM)
    → Checks character limits, hashtags, CTAs
        │
    ┌───┴───────────────────────┐
    │ Errors found?             │ No errors
    ▼                           ▼
[5] Self-Corrector           [END]
    llama-3.1-8b-instant
    → Rewrites failing posts
    → Routes back to Validator
```

Each completed stage streams an SSE event to the browser. The UI updates the agent progress tracker in real-time.

---

## Project Structure

```
ai-content-calendar/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout (font, navbar, toaster)
│   ├── create/page.tsx             # 3-step brand config wizard
│   ├── calendar/page.tsx           # Calendar view + pipeline trigger
│   └── api/
│       ├── agent/pipeline/route.ts # SSE streaming pipeline endpoint
│       └── export/route.ts         # CSV / JSON export endpoint
│
├── components/
│   ├── AgentPipeline.tsx           # Live agent progress tracker
│   ├── CalendarGrid.tsx            # 30-day calendar grid
│   ├── PostDrawer.tsx              # Slide-out post detail panel
│   ├── PlatformTabs.tsx            # Per-platform post viewer + editor
│   ├── BrandForm.tsx               # Wizard step 1
│   ├── PlatformSelector.tsx        # Wizard step 2
│   ├── GoalSelector.tsx            # Wizard step 3
│   ├── ExportBar.tsx               # CSV/JSON export controls
│   ├── TrendsBadges.tsx            # Trend chip list
│   └── Navbar.tsx                  # Top navigation
│
├── hooks/
│   ├── useAgentPipeline.ts         # SSE stream reader + state machine
│   └── useCalendar.ts              # Drawer open/close + day navigation
│
├── lib/
│   ├── types.ts                    # Shared TypeScript interfaces
│   ├── agents.ts                   # Prompt templates for all 3 LLM agents
│   ├── storage.ts                  # localStorage helpers
│   ├── utils.ts                    # cn() class utility
│   └── langgraph/
│       ├── graph.ts                # StateGraph definition + compilation
│       ├── nodes.ts                # 5 node functions + fallback parser
│       └── schema.ts              # Zod schemas + AgentState interface
│
├── .env.example                    # Environment variable template
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A free [Groq API Key](https://console.groq.com/) (sign up at console.groq.com)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-content-calendar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```
   > ⚠️ Never commit `.env.local` to version control. It is already listed in `.gitignore`.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the app**

   Visit [http://localhost:3000](http://localhost:3000)

### Build for Production
```bash
npm run build
npm run start
```

---

## Usage

1. Click **Create Calendar** on the homepage
2. Fill in your brand details across 3 steps:
   - **Step 1**: Brand name, niche, target audience, brand voice, posts per week
   - **Step 2**: Select your platforms (Instagram, Twitter, LinkedIn, TikTok, YouTube)
   - **Step 3**: Select your content goals
3. Click **Generate** and watch the AI pipeline run live
4. Browse your 30-day calendar — click any day to view the full post for each platform
5. Edit any caption, hashtag, or CTA inline
6. Export your calendar as **CSV** or **JSON**

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | ✅ Yes | Your Groq API key. Get one free at [console.groq.com](https://console.groq.com). Server-side only — never exposed to the browser. |

---

## Rate Limits (Groq Free Tier)

The free Groq tier has the following limits:
- **6,000 tokens per minute (TPM)**
- **100,000 tokens per day (TPD)**

The pipeline uses a concurrency limiter (`p-limit`) and per-request delays to stay within the TPM limit. On a paid Groq tier, these delays can be removed for significantly faster generation.

---

## License

MIT
