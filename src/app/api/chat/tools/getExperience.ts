import { tool } from 'ai';
import { z } from 'zod';

export const getExperience = tool({
  description:
    'Shows my professional experience — employers, roles and what I built at each. Use it for questions about my work history, career or where I have worked.',
  parameters: z.object({}),
  execute: async () => {
    return 'My work history is above. Ask me about any role and I can go into detail.';
  },
});
