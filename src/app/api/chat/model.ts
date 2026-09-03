import { createOpenAI, openai } from '@ai-sdk/openai';

/**
 * Chat model selection.
 *
 * Default is a local model served by Ollama, which speaks the OpenAI chat
 * completions protocol on /v1 — so the existing `@ai-sdk/openai` provider works
 * against it with nothing more than a different baseURL, and no extra
 * dependency. Set LLM_PROVIDER=openai to go back to the hosted model.
 *
 *   LLM_PROVIDER     'ollama' (default) | 'openai'
 *   OLLAMA_BASE_URL  default http://localhost:11434/v1
 *   OLLAMA_MODEL     default qwen2.5:1.5b
 *   OPENAI_MODEL     default gpt-4o-mini (only when LLM_PROVIDER=openai)
 */

export const DEFAULT_OLLAMA_BASE_URL = 'http://localhost:11434/v1';
// qwen2.5:3b, not 1.5b: the 1.5B model cannot hold a negative constraint and
// invents an age and a date of birth when asked, despite the prompt forbidding it.
// 3b refuses correctly and costs ~1s per reply. Stay in the qwen2 family — on this
// Ollama build, llama-family models are rejected with "does not support chat".
export const DEFAULT_OLLAMA_MODEL = 'qwen2.5:3b';

export const LLM_PROVIDER = (process.env.LLM_PROVIDER ?? 'ollama').toLowerCase();
export const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL ?? DEFAULT_OLLAMA_BASE_URL;
export const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? DEFAULT_OLLAMA_MODEL;

export function getChatModel() {
  if (LLM_PROVIDER === 'openai') {
    return openai(process.env.OPENAI_MODEL ?? 'gpt-4o-mini');
  }

  const ollama = createOpenAI({
    baseURL: OLLAMA_BASE_URL,
    // Ollama ignores the key, but the provider requires a non-empty one.
    apiKey: 'ollama',
    // Keeps the provider off OpenAI-only features (strict tool schemas,
    // structured outputs) that Ollama's compatibility layer rejects.
    compatibility: 'compatible',
    name: 'ollama',
  });

  return ollama(OLLAMA_MODEL);
}

/** Human-readable label for logs and error messages. */
export function describeChatModel() {
  return LLM_PROVIDER === 'openai'
    ? `openai:${process.env.OPENAI_MODEL ?? 'gpt-4o-mini'}`
    : `ollama:${OLLAMA_MODEL} (${OLLAMA_BASE_URL})`;
}

/** Verify the local server is up so the UI can show a useful message. */
export async function checkOllamaReachable(): Promise<
  { ok: true; models: string[] } | { ok: false; error: string }
> {
  const tagsUrl = new URL('/api/tags', OLLAMA_BASE_URL).toString();

  try {
    const response = await fetch(tagsUrl, {
      signal: AbortSignal.timeout(3000),
      cache: 'no-store',
    });

    if (!response.ok) {
      return { ok: false, error: `Ollama responded with ${response.status}` };
    }

    const data = await response.json();
    return {
      ok: true,
      models: (data.models ?? []).map((model: { name: string }) => model.name),
    };
  } catch {
    return {
      ok: false,
      error: `Cannot reach Ollama at ${OLLAMA_BASE_URL}. Start it with \`ollama serve\`.`,
    };
  }
}
