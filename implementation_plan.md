# Extend Fallback-Parse + Retry to All Nodes

The recent shift of all agents to `llama-3.1-8b-instant` introduced the `tool_use_failed` hallucination error into the `research_trends` and `plan_calendar` nodes. We will abstract the robust fallback-parse logic we built for `write_posts` into a global helper and wrap all LLM calls in it.

## Proposed Changes

### 1. Shared Helper Extraction
- Create a `callWithStructuredFallback<T>` function in `lib/langgraph/nodes.ts` (or `utils.ts`).
- This helper will:
  - Attempt the LLM call.
  - Catch `tool_use_failed` and reliably extract `failed_generation` (handling object paths and string-escaped fallbacks).
  - Catch `429` rate limits and extract `retry-after` times.
  - Implement an exponential/parsed backoff retry loop up to a configurable `maxRetries`.

### 2. Universal Application
- Wrap the `model.invoke()` execution in `research_trends` with this helper.
- Wrap the `model.invoke()` execution in `plan_calendar` with this helper.
- Refactor `generatePostForDay` to use this helper instead of its custom inline loop.

### 3. Model Consistency
- Keep all models assigned to `llama-3.1-8b-instant` as-is to verify the fix works under maximum hallucination pressure. (Will upgrade Planner/Researcher later).

### 4. API Key Verification
- A new API key has been securely placed in `.env.local` by the user. Next.js reads `.env.local` natively on startup. I will restart the dev server prior to verification to ensure it strictly picks up the new quota.

## Verification Plan
- Restart the Next.js dev server.
- Run a full pipeline generation and confirm via server logs that no unhandled `tool_use_failed` crashes the pipeline.
- Ensure the UI properly displays the calendar and active days instead of the `0 active days` glitch.
- Run a second full generation immediately after to confirm stability.
