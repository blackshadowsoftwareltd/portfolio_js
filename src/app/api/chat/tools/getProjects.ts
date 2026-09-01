import { tool } from 'ai';
import { z } from 'zod';

export const getProjects = tool({
  description: 'Shows the list of my open-source and personal projects.',
  parameters: z.object({}),
  execute: async () => {
    return "Here are my projects (above). Ask me about any of them and I'll go deeper!";
  },
});
