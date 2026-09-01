import { tool } from 'ai';
import { z } from 'zod';

export const getResume = tool({
  description: 'Shows my resume — summary, experience and education.',
  parameters: z.object({}),
  execute: async () => {
    return 'My resume is above.';
  },
});
