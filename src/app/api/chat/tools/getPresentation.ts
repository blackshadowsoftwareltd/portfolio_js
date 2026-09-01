import { tool } from 'ai';
import { z } from 'zod';
import { RESUME } from '@/constants/resume';

export const getPresentation = tool({
  description:
    'Returns a concise personal introduction. Use it to answer "Who are you?" or "Tell me about yourself".',
  parameters: z.object({}),
  execute: async () => {
    return {
      presentation: `I'm ${RESUME.name}, a ${RESUME.title.toLowerCase()} based in ${RESUME.location}. ${RESUME.summary}`,
    };
  },
});
