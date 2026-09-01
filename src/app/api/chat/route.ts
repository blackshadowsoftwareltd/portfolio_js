import { streamText } from "ai";
import {
  LLM_PROVIDER,
  checkOllamaReachable,
  describeChatModel,
  getChatModel,
} from './model';
import { SYSTEM_PROMPT } from './prompt';
import { getProjects } from './tools/getProjects';
import { getPresentation } from './tools/getPresentation';
import { getResume } from './tools/getResume';
import { getContact } from './tools/getContact';
import { getSkills } from './tools/getSkills';
import { getExperience } from './tools/getExperience';

export const maxDuration = 30;

// ❌ Pas besoin de l'export ici, Next.js n'aime pas ça
function errorHandler(error: unknown) {
  if (error == null) {
    return 'Unknown error';
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return JSON.stringify(error);
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    console.log(`[CHAT-API] ${describeChatModel()} — ${messages.length} message(s)`);

    // A local model that isn't running is the most likely failure here, so say
    // so plainly instead of surfacing a connection stack trace in the chat UI.
    if (LLM_PROVIDER !== 'openai') {
      const health = await checkOllamaReachable();
      if (!health.ok) {
        return new Response(health.error, { status: 503 });
      }
    }

    messages.unshift(SYSTEM_PROMPT);

    const tools = {
      getProjects,
      getPresentation,
      getResume,
      getContact,
      getSkills,
      getExperience,
    };

    const result = streamText({
      model: getChatModel(),
      messages,
      toolCallStreaming: true,
      tools,
      maxSteps: 2,
    });

    return result.toDataStreamResponse({
      getErrorMessage: errorHandler,
    });
  } catch (err) {
    console.error("Global error:", err);
    const errorMessage = errorHandler(err);
    return new Response(errorMessage, { status: 500 });
  }
}